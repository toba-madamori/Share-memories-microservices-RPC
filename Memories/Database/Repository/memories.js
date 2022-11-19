/* eslint-disable camelcase */
const MemoryModel = require('../Models/memories')
const { NotFoundError, BadRequestError } = require('../../Errors')

// Dealing with data base operations
class MemoryRepository {
    async createMemory ({ userid, memory, title, tags, cloudinary_id }) {
        const mem = new MemoryModel({
            userid,
            memory,
            title,
            tags,
            cloudinary_id
        })

        const newMemory = await mem.save()
        return newMemory
    }

    async findMemory ({ _id }) {
        const memory = await MemoryModel.findById(_id)

        if (!memory) throw new NotFoundError('sorry, this memory does not exist')

        return memory
    }

    async findAll ({ userid }) {
        const memories = await MemoryModel.find({ userid }).select('-createdAt -updatedAt -__v')

        return memories
    }

    async findOne ({ userid, memoryid }) {
        const memory = await MemoryModel.findOne({ _id: memoryid, userid })
        if (!memory) throw new NotFoundError('sorry, this memory does not exist')

        return memory
    }

    async updateMemory ({ memoryid, update }) {
        const memory = await MemoryModel.findByIdAndUpdate({ _id: memoryid }, update, { new: true, runValidators: true }).select('-createdAt -updatedAt -__v')

        return memory
    }

    async deleteMemory ({ memoryid, userid }) {
        const memory = await MemoryModel.findOneAndDelete({ _id: memoryid, userid })
        if (!memory) throw new BadRequestError('method not allowed')

        return memory
    }

    async searchMemories ({ skip, limit, queryObject }) {
        const memories = await MemoryModel.find(queryObject).select('-createdAt -updatedAt -__v').skip(skip).limit(limit)
        return memories
    }

    async addLike ({ memoryid }) {
        const memory = await MemoryModel.findByIdAndUpdate({ _id: memoryid }, { $inc: { likes: 1 } }, { new: true, runValidators: true })
        return memory
    }

    async removeLike ({ memoryid }) {
        const memory = await MemoryModel.findByIdAndUpdate({ _id: memoryid }, { $inc: { likes: -1 } }, { new: true, runValidators: true })
        return memory
    }

    async addDislike ({ memoryid }) {
        const memory = await MemoryModel.findByIdAndUpdate({ _id: memoryid }, { $inc: { dislikes: 1 } }, { new: true, runValidators: true })
        return memory
    }

    async removeDislike ({ memoryid }) {
        const memory = await MemoryModel.findByIdAndUpdate({ _id: memoryid }, { $inc: { dislikes: -1 } }, { new: true, runValidators: true })
        return memory
    }

    async deleteOne ({ memoryid }) {
        const memory = await MemoryModel.findByIdAndDelete({ _id: memoryid })
        return memory
    }
}

module.exports = MemoryRepository
