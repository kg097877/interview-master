const { Router } = require('express')
const authController = require("../controller/auth.controller.js")
const authRouter = Router()
const authMiddleware = require("../middlewares/auth.middleware.js")
const validate = require("../middlewares/validate.middleware.js")
const { registerSchema, loginSchema } = require("../validators/auth.validators.js")
const { authLimiter } = require("../middlewares/rateLimit.middleware.js")

/**
 * @route POST /api/auth/register
 * @description register a new user
 * @access public 
 */
authRouter.post("/register", authLimiter, validate(registerSchema), authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description login a user
 * @access public 
 */
authRouter.post("/login", authLimiter, validate(loginSchema), authController.loginUserController)

/**
 * @route POST /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public 
 */
authRouter.post("/logout", authController.logoutUserController)

/**
 * @route get /api/auth/get-me
 * @description get the current logged in user detail
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)

module.exports = authRouter
