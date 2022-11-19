/* eslint-disable camelcase */
const CommentModel = require('../Models/comments')
const { NotFoundError } = require('../../Errors')

// Dealing with data base operations
class CommentRepository {
    async createComment ({ comment, userid, memoryid }) {
        const comm = new CommentModel({
            comment,
            userid,
            memoryid
        })

        const newComment = await comm.save()
        return newComment
    }

    async findComment ({ _id }) {
        const comment = await CommentModel.findById(_id)

        if (!comment) throw new NotFoundError('sorry, this comment does not exist')

        return comment
    }

    async updateComment ({ comment, userid, commentid }) {
        const updatedComment = await CommentModel.findOneAndUpdate({ _id: commentid, userid }, { comment, edited: true }, { new: true })
        return updatedComment
    }

    async deleteComment ({ _id, userid }) {
        return await CommentModel.findOneAndDelete({ _id, userid })
    }

    async getComments ({ memoryid }) {
        const comments = await CommentModel.find({ memoryid }).select('-createdAt -updatedAt -__v')
        return comments
    }

    async deleteCommentMemoryid ({ memoryid }) {
        return await CommentModel.deleteMany({ memoryid })
    }

    async deleteCommentUserid ({ userid }) {
        return await CommentModel.deleteMany({ userid })
    }
}

module.exports = CommentRepository
