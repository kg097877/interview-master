const { z } = require("zod");

const interviewReportSchema = z.object({
    jobDescription: z.string().min(1, "Job description is required").max(10000, "Job description is too long"),
    selfDescription: z.string().max(10000, "Self description is too long").optional()
});

module.exports = { interviewReportSchema };
