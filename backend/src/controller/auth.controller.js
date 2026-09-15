const userModel = require("../models/user.model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model.js")
const asyncHandler = require("../utils/asyncHandler.js")

/**
 * 
 * @name registerUserController
 * @description register a new user, expects username,email and password
 * @access public
 */
const registerUserController = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    })
    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "username or email already exists",
            status: 400
        })
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        username,
        email,
        password: hash,
    });

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000
    })
    res.status(201).json({
        message: "user registered successfully",
        status: 201,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
})

/**
 * 
 * @name loginUserController
 * @description login a  user, expects email and password
 * @access public
 */
const loginUserController = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    // Email casing is handled in the validator middleware before reaching this logic.
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({
            message: "user not found",
            status: 400
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "invalid password",
            status: 400
        })
    }
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000
    })
    res.status(200).json({
        message: "user logged in successfully",
        status: 200,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
})

const logoutUserController = asyncHandler(async (req, res) => {
    const token = req.cookies.token
    if (token) {
        await tokenBlacklistModel.create({ token })
    }
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
    })
    res.status(200).json({
        message: "User logged out successfully"
    })
})

/**
 * @name getMeController
 * @description get the current logged in user detail
 * @access private
 */
const getMeController = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user.id)
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            status: 404
        })
    }
    return res.status(200).json({
        message: "User details fetched successfully",
        status: 200,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
})

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }
