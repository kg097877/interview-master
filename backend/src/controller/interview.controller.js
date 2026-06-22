const pdfParse = require("pdf-parse")
const interviewReportModel = require("../models/inteviewReport.model")
const generateInterviewReport = require("../services/ai.services")

async function generateInterviewReportController(req, res) {
    const resumeFile = req.file
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
}




module.exports = { generateInterviewReportController }