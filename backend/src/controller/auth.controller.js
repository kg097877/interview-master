const userModel = require("../models/user.model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const tokenBlacklistModel = require("../models/blacklist.model.js")
/**
 * 
 * @name registerUserController
 * @desciption register a new user, expects username,email and password
 * @access public
 */
async function registerUserController(req,res){
    const {username,email,password}= req.body
    if(!username || !email || !password){
        return res.status(400).json({
            message:"username email and password are required",
            status:400
        })
    }
    const isUserAlreadyExists = await userModel.findOne({
        $or:[{email} ,{username}]
    })
    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"username or email already exists",
            status:400
        })
    }
    const hash = await bcrypt.hash(password,10);
    const user = await userModel.create({
        username,
        email,
        password:hash,
    });
    return res.status(201).json({
        message:"user registered successfully",
        status:201,
        data:user
    })
    const token = jwt.sign(
        {id:user._id, username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("token",token)
    res.status(201).json({
        message:"user registered successfully",
        status:201,
        user:{
            id: user._id,
            username:user.username,
            email:user.email
        }
    })      
}
/**
 * 
 * @name loginUserController
 * @desciption login a  user, expects email and password
 * @access public
 */
async function loginUserController(req,res){
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({
            message:"email and password are required",
            status:400
        })
    }
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"user not found",
            status:400
        })
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message:"invalid password",
            status:400
        })
    }
    const token = jwt.sign(
        {id:user._id, username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("token",token)
    res.status(200).json({
        message:"user logged in successfully",
        status:200,
        user:{
            id: user._id,
            username:user.username,
            email:user.email
        }
    })
}
async function logoutUserController(req,res){
    const token = req.cookies.token
    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
        message: "User logged out successfully"
    })
}
/**
 * @name getMeController
 * @desciption get the current logged in user detail
 * @access private
 */
async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)
    return res.status(200).json({
        message: "User details fetched successfully",
        status:200,
        user:{
            id: user._id,
            username: user.username,
            emaiul: user.email
        }
    })
}
module.exports ={registerUserController,loginUserController,logoutUserController,getMeController}