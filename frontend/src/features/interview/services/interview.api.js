import api from "../../../lib/api"

export async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const formData = new FormData() // to send data from frontend to backend
    formData.append("resume", resume)
    formData.append("selfDescription", selfDescription)
    formData.append("jobDescription", jobDescription)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

export async function getAllInterviewReports(){
    const response = await api.get("/api/interview/")
    return response.data
}
 
export async function getInterviewReportById(interviewId){
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}

export async function generateResumePdf(interviewReportId){
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, {},{
        responseType: "blob"
    })
    return response.data
}

export async function deleteInterviewReport(interviewId) {
    const response = await api.delete(`/api/interview/report/${interviewId}`)
    return response.data
}
