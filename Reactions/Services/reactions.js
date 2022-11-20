/* eslint-disable camelcase */
const { CommentRepository, LikeRepository, DislikeRepository } = require('../Database')
const logger = require('../Utils/logger')
const { RPCrequest } = require('../Utils/events')

// All Business logic will be here
class ReactionsService {
    constructor () {
        this.commentRepository = new CommentRepository()
        this.likeRepository = new LikeRepository()
        this.dislikeRepository = new DislikeRepository()
    }

    async createComment (input) {
        const { comment, userid, memoryid } = input

        const newComment = await this.commentRepository.createComment({ comment, userid, memoryid })

        return newComment
    }

    async updateComment (input) {
        const { comment, userid, commentid } = input

        await this.commentRepository.findComment({ _id: commentid })

        const updatedComment = await this.commentRepository.updateComment({ comment, userid, commentid })
        return updatedComment
    }

    async deleteComment (input) {
        const { _id, userid } = input
        return await this.commentRepository.deleteComment({ _id, userid })
    }

    async getComments (input) {
        const { memoryid } = input
        const comments = await this.commentRepository.getComments({ memoryid })
        return comments
    }

    async likeMemory (input) {
        const { userid, memoryid } = input

        // checking if the user has liked the memory before
        const prevLike = await this.likeRepository.findAndDelete({ userid, memoryid })
        if (prevLike) {
            // removing the like from the memory
            await RPCrequest(process.env.MEMORIES_BINDING_KEY, JSON.stringify({ event: 'REMOVE_LIKE', data: { memoryid } }))
            const message = 'removed the like'
            return message
        }

        // checking if the user has disliked the memory before
        const prevDislike = await this.dislikeRepository.findAndDelete({ userid, memoryid })
        if (prevDislike) {
        // removing the dislike from the memory
            await RPCrequest(process.env.MEMORIES_BINDING_KEY, JSON.stringify({ event: 'REMOVE_DISLIKE', data: { memoryid } }))
            const message = 'removed the dislike'
            return message
        }

        await RPCrequest(process.env.MEMORIES_BINDING_KEY, JSON.stringify({ event: 'ADD_LIKE', data: { memoryid } }))
        const newLike = await this.likeRepository.createLike({ userid, memoryid })
        return newLike
    }

    async dislikeMemory (input) {
        const { userid, memoryid } = input

        // checking if the user has disliked the memory before
        const prevDislike = await this.dislikeRepository.findAndDelete({ userid, memoryid })
        if (prevDislike) {
            // removing the dislike from the memory
            await RPCrequest(process.env.MEMORIES_BINDING_KEY, JSON.stringify({ event: 'REMOVE_DISLIKE', data: { memoryid } }))
            const message = 'removed the dislike'
            return message
        }

        // checking if the user has liked the memory before
        const prevLike = await this.likeRepository.findAndDelete({ userid, memoryid })
        if (prevLike) {
            // removing the like from the memory
            await RPCrequest(process.env.MEMORIES_BINDING_KEY, JSON.stringify({ event: 'REMOVE_LIKE', data: { memoryid } }))
            const message = 'removed the like'
            return message
        }

        await RPCrequest(process.env.MEMORIES_BINDING_KEY, JSON.stringify({ event: 'ADD_DISLIKE', data: { memoryid } }))
        const newDislike = await this.dislikeRepository.createDislike({ userid, memoryid })
        return newDislike
    }

    async deleteCommentMemoryid (input) {
        const { memoryid } = input
        return await this.commentRepository.deleteCommentMemoryid({ memoryid })
    }

    async deleteCommentUserid (input) {
        const { userid } = input
        return await this.commentRepository.deleteCommentUserid({ userid })
    }

    async SubscribeEvents (payload) {
        logger.info('============= Triggering Reactions Events =============')

        payload = JSON.parse(payload)
        const { event, data } = payload

        const { memoryid, userid } = data

        switch (event) {
        case 'GET_COMMENTS':
            return await this.getComments({ memoryid })
        case 'DELETE_COMMENTS_MEMORYID':
            return await this.deleteCommentMemoryid({ memoryid })
        case 'DELETE_COMMENTS_USERID':
            return await this.deleteCommentUserid({ userid })
        default:
            break
        }
    }
}

module.exports = ReactionsService
