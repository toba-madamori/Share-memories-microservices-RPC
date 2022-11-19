const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a username'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6
    },
    avatar: {
        type: String,
        required: [true, 'Please provide the user avatar']
    },
    status: {
        type: String,
        default: 'Available'
    },
    cloudinary_id: {
        type: String,
        required: [true, 'Please provide the cloudinary_id']
    },
    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const db = mongoose.connection.useDb('Share-Memories-Micro-Services')

module.exports = db.model('Users', UserSchema)
