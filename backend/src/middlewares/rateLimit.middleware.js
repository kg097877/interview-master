const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    validate: false,
    handler: (req, res, next, options) => {
        res.status(429).json({
            success: false,
            message: "Too many requests, please try again later.",
            status: 429
        });
    }
});

const interviewLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    keyGenerator: (req, res) => {
        return req.user ? req.user.id : req.ip;
    },
    validate: false,
    handler: (req, res, next, options) => {
        res.status(429).json({
            success: false,
            message: "Too many requests, please try again later.",
            status: 429
        });
    }
});

module.exports = { authLimiter, interviewLimiter };
