const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

const interviewReportSchema = z.object({

    // Job title for this report
    title: z.string().describe("The title of the job for which the interview report is generated"),

    // Overall match score
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),

    // Candidate snapshot
    candidateProfile: z.object({
        name: z.string().describe("Candidate's name extracted from the resume"),
        currentRole: z.string().describe("Current or most recent job title"),
        experienceLevel: z.enum(["fresher", "junior", "mid", "senior", "lead"])
            .describe("Estimated experience level based on resume"),
        summary: z.string().describe("A 2-3 sentence professional summary of the candidate"),
    }),

    // Strengths the candidate brings to this role
    strengths: z.array(z.object({
        strength: z.string().describe("A specific strength of the candidate"),
        evidence: z.string().describe("Evidence from the resume or self-description that supports this strength"),
    })).describe("Top 4-6 strengths with evidence from the resume"),

    // Technical interview questions (enhanced)
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question to ask in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
        difficulty: z.enum(["easy", "medium", "hard"]).describe("Difficulty level of this question"),
        area: z.string().describe("Technical area this question covers, e.g. React, Node.js, System Design, DSA"),
        followUp: z.string().describe("A follow-up question the interviewer might ask to dig deeper"),
    })).describe("8-10 technical questions with a mix of easy, medium, and hard difficulty"),

    // Behavioral interview questions (enhanced)
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question to ask in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question using STAR format, what points to cover"),
        assessingTrait: z.string().describe("The soft skill being evaluated, e.g. leadership, teamwork, conflict resolution"),
        redFlags: z.string().describe("Answer patterns that would be concerning to the interviewer"),
        greenFlags: z.string().describe("Answer patterns that indicate a strong candidate"),
    })).describe("5-6 behavioral questions assessing different soft skills"),

    // Skill gaps (enhanced)
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("How important this skill is for the job and how much it impacts the candidate's chances"),
        improvementSuggestion: z.string().describe("Specific advice on how the candidate can learn or demonstrate this skill quickly"),
    })).describe("List of skill gaps in the candidate's profile, ordered by severity"),

    // Preparation plan (enhanced)
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day, e.g. data structures, system design, mock interviews"),
        tasks: z.array(z.string()).describe("Concrete tasks for this day, e.g. solve 5 LeetCode medium problems on trees, read MongoDB indexing docs"),
        timeEstimate: z.string().describe("Estimated time needed for this day's tasks, e.g. 3-4 hours"),
        resources: z.array(z.string()).describe("Specific resources to use: article URLs, YouTube channels, documentation pages, book chapters"),
    })).describe("A 14-day preparation plan with daily tasks, time estimates, and resources"),

})


// =============================================================================
// GENERATE INTERVIEW REPORT
// =============================================================================
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `
generate an interview report for a candidate
based on their resume, self-description, and the job description
${resume}
${selfDescription}
${jobDescription}
`
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema.toJSONSchema({ target: "jsonSchema7" })
        }
    })
    const result = JSON.parse(response.text)
    console.log(result)
    return result

}

module.exports = generateInterviewReport;