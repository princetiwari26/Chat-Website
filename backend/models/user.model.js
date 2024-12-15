const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    bio: { type: String },
    gender: { type: String },
    myfriends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User;