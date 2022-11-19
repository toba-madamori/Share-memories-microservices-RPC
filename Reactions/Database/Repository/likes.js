/* eslint-disable camelcase */
const LikeModel = require('../Models/likes')

// Dealing with data base operations
class LikeRepository {
    async createLike ({ userid, memoryid }) {
        const like = new LikeModel({
            userid,
            memoryid
        })

        const newLike = await like.save()
        return newLike
    }

    async findAndDelete ({ userid, memoryid }) {
        const like = await LikeModel.findOneAndDelete({ userid, memoryid })
        return like
    }
}

module.exports = LikeRepository
