require("dotenv").config()
// Load the Express application instance from src/app.js
const {resume, selfDescription, jobDescription} = require("./src/services/temp.js")
const app = require("./src/app.js")
const connectToDB = require("./src/config/database.js")
const generateInterviewReport = require("./src/services/ai.services")
connectToDB()
generateInterviewReport({resume,selfDescription,jobDescription})
app.listen(3000, () => {
    console.log("server is running on port 3000")
})