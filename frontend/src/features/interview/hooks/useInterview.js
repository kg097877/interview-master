
import { getAllInterviewReports, getInterviewReportById, generateInterviewReport, generateResumePdf } from "../services/interview.api";
import { useContext } from "react";
import InterviewContext from "../interview.context";

export const useInterview = () => {
    const context = useContext(InterviewContext)
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }
    const { loading, setLoading, report, setReport, reports, setReports } = context;
    const generateReport = async ({ jobDescription, selfDescription, resume }) => {
        let response = null;
        setLoading(true)
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resume })
            setReport(response.interviewReport)
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }
    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null;
        try {
            response = await getInterviewReportById(interviewId)

            setReport(response.interviewReport)
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }
    const getAllReports = async () => {
        setLoading(true)
        let response = null;
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
        return response.interviewReports
    }
    const deleteReport = async (interviewId) => {
        setLoading(true)
        try {
            await deleteInterviewReport(interviewId)
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }
    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const pdfBlob = await generateResumePdf(interviewReportId)
            const url = URL.createObjectURL(pdfBlob)
            
            const link = document.createElement("a")
            link.href = url
            link.download = "generated_resume.pdf"
            document.body.appendChild(link)
            link.click()
            link.remove()
            URL.revokeObjectURL(url)
        } catch (error) {
            throw error
        }finally{
            setLoading(false)
        }
    }
    return { generateReport, getReportById, getAllReports, deleteReport, loading, report, reports, setReports, getResumePdf }

}