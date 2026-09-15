const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const errorHandler = require("./middlewares/error.middleware")

app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))

// require all routes here:
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

//use all routes here:
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.use(errorHandler)

module.exports = app
