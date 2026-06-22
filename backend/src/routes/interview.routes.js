const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewRouter = express.Router();
const upload = require("../middlewares/file.middleware")
const interviewController = require("../controller/interview.controller")
/**
 * @route POST /api/interview/
 * @description Generate Interview Report from resume, self-description and job description
 * @access Private
 */

interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)
module.exports = interviewRouter