const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewRouter = express.Router();
const upload = require("../middlewares/file.middleware")
const interviewController = require("../controller/interview.controller")
const validate = require("../middlewares/validate.middleware.js")
const { interviewReportSchema } = require("../validators/interview.validators.js")
const { interviewLimiter } = require("../middlewares/rateLimit.middleware.js")

/**
 * @route POST /api/interview/
 * @description Generate Interview Report from resume, self-description and job description
 * @access Private
 */
interviewRouter.post("/", authMiddleware.authUser, interviewLimiter, upload.single("resume"), validate(interviewReportSchema), interviewController.generateInterviewReportController)

/**
 * @route GET/api/interview/report/:id
 * @description get interview reports by id 
 * @access private
 */
interviewRouter.get("/report/:id", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET/api/interview/
 * @description get all interview reports of logged in user
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * @route POST/api/interview/resume/pdf/:interviewReportId
 * @description get resume pdf on the basis of user self description, job description and resume
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

/**
 * @route DELETE/api/interview/report/:id
 * @description delete interview report by id
 * @access private
 */
interviewRouter.delete("/report/:id", authMiddleware.authUser, interviewController.deleteInterviewReportController)

module.exports = interviewRouter    
