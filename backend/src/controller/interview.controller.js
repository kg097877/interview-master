const pdfParse = require("pdf-parse")
const interviewReportModel = require("../models/inteviewReport.model")
const {generateInterviewReport,generateResumePdf }= require("../services/ai.services")
const asyncHandler = require("../utils/asyncHandler.js")

const generateInterviewReportController = asyncHandler(async (req, res) => {
    const resumeFile = req.file
    if (!resumeFile) {
        return res.status(400).json({ message: "Resume file is required" })
    }
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body
    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription: selfDescription,
        jobDescription: jobDescription
    })
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })
    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
})

const getInterviewReportByIdController = asyncHandler(async (req, res) => {
    const {id} = req.params
    const interviewReport = await interviewReportModel.findOne({_id:id,user: req.user.id})
    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }
    res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    })
})
    
const getAllInterviewReportsController = asyncHandler(async (req, res) => {
    const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -candidateProfile -strengths")
    res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports
    })
})

const generateResumePdfController = asyncHandler(async (req, res) => {
    const {interviewReportId}= req.params
    const interviewReport = await interviewReportModel.findOne({_id:interviewReportId,user: req.user.id})
    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }
    const {resume, jobDescription, selfDescription} =interviewReport
    const pdfBuffer = await generateResumePdf({resume, jobDescription, selfDescription})
    res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`,
    })
    res.send(pdfBuffer)
})

const deleteInterviewReportController = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await interviewReportModel.findOneAndDelete({ _id: id, user: req.user.id })
    if (!result) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }
    res.status(200).json({
        message: "Interview report deleted successfully"
    })
})

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, deleteInterviewReportController }
