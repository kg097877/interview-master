const mongoose = require('mongoose')

const blacklistTokenSchema = mongoose.Schema({
    token: { type: String, required: true, index: true, unique: true }
}, {
    timestamps: true
})
blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 }) // 2 days

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)
module.exports = tokenBlacklistModel
