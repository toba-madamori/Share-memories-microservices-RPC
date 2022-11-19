const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MemorySchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        required: [true, 'please provide a userid']
    },
    memory: {
        type: String,
        required: [true, 'please provide the memory you want to create']
    },
    title: {
        type: String,
        required: [true, 'please provide a title for the memory you want to create']
    },
    tags: {
        type: Array,
        default: []
    },
    cloudinary_id: {
        type: String,
        required: [true, 'Please provide the cloudinary_id']
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const db = mongoose.connection.useDb('Memory-Service')

module.exports = db.model('Memories', MemorySchema)
