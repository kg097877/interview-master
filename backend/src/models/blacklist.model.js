const mongoose = require ('mongoose')
const blacklistTokenSchema = mongoose.Schema({
    token:{type:String,required:true}
}, {timestamps:true})
const tokenBlacklistModel = mongoose.model("blacklistTokens",blacklistTokenSchema)
module.exports = tokenBlacklistModel