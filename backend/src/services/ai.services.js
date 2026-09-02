const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");
const { default: zodToJsonSchema } = require("zod-to-json-schema");
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

async function generatePdfFromhtml(htmlContent){
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page  = await browser.newPage()
    // Set a viewport that matches the A4 aspect ratio to ensure consistent rendering
    await page.setViewport({
        width: 794,
        height: 1123,
        deviceScaleFactor: 2
    })
    await page.setContent(htmlContent,{
        waitUntil: "networkidle0"
    })
    const pdfbuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true
    })
    await browser.close()
    return pdfbuffer
}

async function generateResumePdf({resume, selfDescription, jobDescription}){
    const resumepdfSchema = z.object({
        html: z.string().describe("HTML code for the resume in which can be converted into pdf using puppeteer")
    })
    const prompt = `
You are a master executive resume writer and professional typographer. Generate a highly polished, single-page, professional resume tailored for the provided Job Description.

Candidate Details:
- Original Resume:
"""
${resume}
"""
- Candidate Self-Description/Custom Focus:
"""
${selfDescription}
"""

Target Job Description:
"""
${jobDescription}
"""

Core Instructions:
1. Writing Tone (Avoid "AI-Generated" Clichés):
   - Do NOT use generic AI buzzwords or empty transition phrases (e.g., "Results-driven professional with a proven track record...", "Spearheaded...", "Leveraged synergies to...", "Fostered collaborative environments").
   - Write in a natural, direct, and high-impact human voice. Use strong action verbs and focus on concrete, quantifiable results (e.g., "Reduced database query response times by 35% by redesigning indexes and optimizing joints" instead of "Successfully optimized database queries").
   - Describe technical challenges and actual solutions. Keep it grounded and authentic.

2. Full Page Coverage (No Empty Space):
   - The content must naturally and beautifully cover 85-95% of the A4 page vertically. It must NOT look empty or leave a large blank space at the bottom.
   - Adjust the content density: ensure there are 3-4 detailed bullet points per professional experience, and include a dedicated "Key Projects" section with 2 detailed projects showing technical challenge and outcomes.
   - If the candidate's provided details are brief, expand them constructively by detailing relevant technical implementations, core methodologies, or adding sections like "Certifications" or "Key Achievements" matching the target job description.

3. Professional Layout & Typography (Consistent Sans-Serif & A4 Size):
   - Apply a single, consistent, clean sans-serif font family globally to the entire document. Force it using a wildcard selector (e.g. \`* { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; }\`). Do NOT mix font families or let default serif fonts (like Times New Roman) render in any section. Import 'Inter' from Google Fonts at the top of the style tag.
   - Enforce exact A4 page size in CSS: Include \`@page { size: A4; margin: 0; }\`.
   - Wrap the entire resume inside a root container: \`width: 210mm; height: 297mm; box-sizing: border-box; padding: 15mm 20mm; overflow: hidden;\`.
   - Use a clean, modern, single-column layout with comfortable margins and line spacing.
   - Use a professional, high-contrast typography scale: Name (bold, 24px), Section Headers (semi-bold, 13px, uppercase, with a thin bottom border: \`border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 20px; margin-bottom: 10px;\`), Body Text (10px, line-height: 1.4, color: #334155).
   - Align dates, companies, and roles cleanly. Use flexbox to right-align dates and locations (e.g., \`display: flex; justify-content: space-between; align-items: baseline;\`).
   - Group skills into distinct, labeled subcategories (e.g., Frontend, Backend, Tools) arranged in a neat grid or structured lists rather than one big block.

Your response MUST be a JSON object matching the schema: {"html": "..."} containing the complete, valid, raw HTML string (do not wrap the HTML in markdown backticks inside the JSON value).
`
const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: resumepdfSchema.toJSONSchema({ target: "jsonSchema7" }),
    }
})
const jsoncontent = JSON.parse(response.text)
const pdfbuffer = await generatePdfFromhtml(jsoncontent.html)
return pdfbuffer
}


module.exports = {generateInterviewReport, generateResumePdf};