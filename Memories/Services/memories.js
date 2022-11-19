/* eslint-disable camelcase */
const { MemoryRepository } = require('../Database')
const cloudinary = require('../Utils/cloudinary')
const { BadRequestError } = require('../Errors')
const logger = require('../Utils/logger')
const { publishReactionEvent } = require('../Utils/events')

// All Business logic will be here
class MemoryService {
    constructor () {
        this.repository = new MemoryRepository()
    }

    async createMemory (input) {
        const { userid, title, tags, image } = input
        let result = {}

        if (!image) throw new BadRequestError('cannot create memories without an image')
        result = await cloudinary.uploader.upload(image.path, { folder: 'memory_upload' })

        const memory = result.secure_url
        const cloudinary_id = result.public_id

        const newMemory = await this.repository.createMemory({ userid, memory, title, tags, cloudinary_id })

        return newMemory
    }

    async getMemory (input) {
        const { memoryid } = input

        const memory = await this.repository.findMemory({ _id: memoryid })
        return memory
    }

    async getAllMemories (input) {
        const { userid } = input
        const memories = await this.repository.findAll({ userid })

        return memories
    }

    async updateMemory (input) {
        const { userid, title, tags, image, memoryid } = input
        let result = {}
        const update = {}
        const prevMemory = await this.repository.findOne({ userid, memoryid })

        if (image) {
            await cloudinary.uploader.destroy(prevMemory.cloudinary_id)
            result = await cloudinary.uploader.upload(image.path, { folder: 'memory_upload' })
            update.memory = result.secure_url
            update.cloudinary_id = result.public_id
        }

        if (title) update.title = title
        if (tags) update.tags = tags

        const updatedMemory = await this.repository.updateMemory({ memoryid, update })

        return updatedMemory
    }

    async deleteMemory (input) {
        const { memoryid, userid } = input
        const memory = await this.repository.deleteMemory({ memoryid, userid })

        await cloudinary.uploader.destroy(memory.cloudinary_id)
        return true
    }

    async searchMemories (input) {
        let { title, tags, page, limit } = input
        const queryObject = {}

        if (title) queryObject.title = { $regex: title, $options: 'i' }
        if (tags) queryObject.tags = { $in: tags }

        page = Number(page) || 1
        limit = Number(limit) || 0
        const skip = (page - 1) * limit

        const memories = await this.repository.searchMemories({ skip, limit, queryObject })
        return memories
    }

    async addLike (input) {
        const { memoryid } = input

        await this.repository.findMemory({ _id: memoryid })
        const memory = await this.repository.addLike({ memoryid })

        return memory
    }

    async removeLike (input) {
        const { memoryid } = input

        await this.repository.findMemory({ _id: memoryid })
        const memory = await this.repository.removeLike({ memoryid })

        return memory
    }

    async addDislike (input) {
        const { memoryid } = input

        await this.repository.findMemory({ _id: memoryid })
        const memory = await this.repository.addDislike({ memoryid })

        return memory
    }

    async removeDislike (input) {
        const { memoryid } = input

        await this.repository.findMemory({ _id: memoryid })
        const memory = await this.repository.removeDislike({ memoryid })

        return memory
    }

    async deleteMemories (input) {
        const { userid } = input

        const memories = await this.repository.findAll({ userid })
        for await (const memory of memories) {
            Promise.all([
                await publishReactionEvent({ event: 'DELETE_COMMENTS_MEMORYID', data: { memoryid: memory._id } }),
                await cloudinary.uploader.destroy(memory.cloudinary_id),
                await this.repository.deleteOne({ memoryid: memory._id })
            ])
        }
    }

    async SubscribeEvents (payload) {
        logger.info('============= Triggering Memory Events =============')

        const { event, data } = payload

        const { memoryid, userid } = data

        switch (event) {
        case 'ADD_LIKE':
            return await this.addLike({ memoryid })
        case 'REMOVE_LIKE':
            return await this.removeLike({ memoryid })
        case 'ADD_DISLIKE':
            return await this.addDislike({ memoryid })
        case 'REMOVE_DISLIKE':
            return await this.removeDislike({ memoryid })
        case 'DELETE_MEMORIES':
            return await this.deleteMemories({ userid })
        default:
            break
        }
    }
}

module.exports = MemoryService
