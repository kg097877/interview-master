const multer = require("multer")

function errorHandler(err, req, res, next) {
    console.error(err)

    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "username or email already exists",
            status: 400
        })
    }

    if (err instanceof multer.MulterError || (err.message && err.message.includes("Only PDF files are allowed"))) {
        return res.status(400).json({
            success: false,
            message: err.message || "File upload error",
            status: 400
        })
    }

    const status = err.statusCode || 500
    res.status(status).json({
        success: false,
        message: err.message || "Internal server error",
        status
    })
}
module.exports = errorHandler
