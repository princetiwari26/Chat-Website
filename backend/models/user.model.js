const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    profilePicture: {type: String},
    gender: {type: String},
    password: {type: String, required: true},
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User;