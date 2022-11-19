/* eslint-disable camelcase */
const ReactionsService = require('../../Services/reactions')
const { StatusCodes } = require('http-status-codes')
const { newCommentSchema, idSchema } = require('../../Utils/validators')
const validator = require('express-joi-validation').createValidator({})
const authMiddleware = require('../Middleware/authentication')

module.exports = (app) => {
    const service = new ReactionsService()

    app.post('/comment/new/:id', authMiddleware, validator.params(idSchema), validator.body(newCommentSchema), async (req, res) => {
        let { comment } = req.body
        const { id: memoryid } = req.params
        const { userID: userid } = req.user

        comment = await service.createComment({ comment, userid, memoryid })
        res.status(StatusCodes.CREATED).json({ status: 'success', comment })
    })

    app.patch('/comment/update/:id', authMiddleware, validator.params(idSchema), validator.body(newCommentSchema), async (req, res) => {
        let { comment } = req.body
        const { id: commentid } = req.params
        const { userID: userid } = req.user

        comment = await service.updateComment({ comment, userid, commentid })
        res.status(StatusCodes.OK).json({ status: 'success', comment })
    })

    app.delete('/comment/delete/:id', authMiddleware, validator.params(idSchema), async (req, res) => {
        const { id: _id } = req.params
        const { userID: userid } = req.user

        await service.deleteComment({ _id, userid })
        res.status(StatusCodes.OK).json({ status: 'success', msg: 'comment deleted' })
    })

    app.get('/comment/:id', authMiddleware, validator.params(idSchema), async (req, res) => {
        const { id: memoryid } = req.params

        const comments = await service.getComments({ memoryid })
        res.status(StatusCodes.OK).json({ status: 'success', comments })
    })

    app.post('/like/:id', authMiddleware, validator.params(idSchema), async (req, res) => {
        const { id: memoryid } = req.params
        const { userID: userid } = req.user

        const response = await service.likeMemory({ userid, memoryid })

        res.status(StatusCodes.OK).json({ status: 'success', response })
    })

    app.post('/dislike/:id', authMiddleware, validator.params(idSchema), async (req, res) => {
        const { id: memoryid } = req.params
        const { userID: userid } = req.user

        const response = await service.dislikeMemory({ userid, memoryid })

        res.status(StatusCodes.OK).json({ status: 'success', response })
    })

    app.get('/whoami', (req, res, next) => {
        return res.status(StatusCodes.OK).json({ msg: '/reactions : I am Reactions Service' })
    })
}
