const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CommentSchema = new Schema({
    comment: {
        type: String,
        required: [true, 'please provide the comment']
    },
    edited: {
        type: Boolean,
        default: false
    },
    userid: {
        type: Schema.Types.ObjectId,
        required: [true, 'please provide a user-id']
    },
    memoryid: {
        type: Schema.Types.ObjectId,
        required: [true, 'please provide a memory-id']
    }
}, { timestamps: true })

const db = mongoose.connection.useDb('Reactions-Service')

module.exports = db.model('Comments', CommentSchema)
