/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const UserService = require('../../Services/users')
const { StatusCodes } = require('http-status-codes')
const { updateUserSchema } = require('../../Utils/validators')
const validator = require('express-joi-validation').createValidator({})
const authMiddleware = require('../Middleware/authentication')
const { publishAuthEvent, publishMemoryEvent, publishReactionEvent } = require('../../Utils/events')
const upload = require('../../Utils/multer')

module.exports = (app) => {
    const service = new UserService()

    app.get('/profile/find', authMiddleware, async (req, res) => {
        const { userID: userid } = req.user

        // call to auth-service for user profile
        const response = await publishAuthEvent({ event: 'GET_USER', data: { userid } })

        res.status(StatusCodes.OK).json({ status: 'success', user: response.data.data })
    })

    app.patch('/profile/update', authMiddleware, upload.single('avatar'), validator.body(updateUserSchema), async (req, res) => {
        const { name, email, status } = req.body
        const avatar = req.file
        const { userID: userid } = req.user

        // call to auth-service for user profile
        const response = await publishAuthEvent({ event: 'UPDATE_USER', data: { userid, name, email, status, avatar } })

        res.status(StatusCodes.OK).json({ status: 'success', user: response.data.data })
    })

    app.delete('/profile/delete', authMiddleware, async (req, res) => {
        const { userID: userid } = req.user

        Promise.all([
            await publishAuthEvent({ event: 'DELETE_USER', data: { userid } }),
            await publishMemoryEvent({ event: 'DELETE_MEMORIES', data: { userid } }),
            await publishReactionEvent({ event: 'DELETE_COMMENTS_USERID', data: { userid } })
        ])

        res.status(StatusCodes.OK).json({ status: 'success', msg: 'account deleted successfully' })
    })

    app.get('/whoami', (req, res, next) => {
        return res.status(StatusCodes.OK).json({ msg: '/users : I am User Service' })
    })
}
