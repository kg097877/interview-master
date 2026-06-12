const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
async function authUser(req,res,next){
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({message: "token not found"})
    }
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({token})
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"token not found",
            status:401,
            success:false
        })
    }
    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message:"INvalid Token",
            status:401,
            success:false,
        })
        
    }
    
}
module.exports = {authUser}