const pdfParse = require("pdf-parse")
const interviewReportModel = require("../models/inteviewReport.model")
const {generateInterviewReport,generateResumePdf }= require("../services/ai.services")

async function generateInterviewReportController(req, res) {
    try {
        const resumeFile = req.file
        if (!resumeFile) {
            return res.status(400).json({ message: "Resume file is required" })
        }
        const resumeContent = await(new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
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
    } catch (error) {
        console.error("Generate report error:", error)
        res.status(500).json({ message: "Failed to generate interview report", status: 500 })
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
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
    } catch (error) {
        console.error("Get report by ID error:", error)
        res.status(500).json({ message: "Failed to fetch interview report", status: 500 })
    }
}
    

async function getAllInterviewReportsController(req,res){
    try {
        const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -v__ -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        })
    } catch (error) {
        console.error("Get all reports error:", error)
        res.status(500).json({ message: "Failed to fetch interview reports", status: 500 })
    }
}

async function generateResumePdfController(req, res){
    try {
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
    } catch (error) {
        console.error("Generate resume PDF error:", error)
        res.status(500).json({ message: "Failed to generate resume PDF", status: 500 })
    }
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }