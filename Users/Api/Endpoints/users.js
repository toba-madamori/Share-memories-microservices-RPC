/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const UserService = require('../../Services/users')
const { StatusCodes } = require('http-status-codes')
const { updateUserSchema } = require('../../Utils/validators')
const validator = require('express-joi-validation').createValidator({})
const authMiddleware = require('../Middleware/authentication')
const { RPCrequest } = require('../../Utils/events')
const upload = require('../../Utils/multer')

module.exports = (app) => {
    const service = new UserService()

    app.get('/profile/find', authMiddleware, async (req, res) => {
        const { userID: userid } = req.user

        // call to auth-service for user profile
        const response = await RPCrequest(process.env.AUTH_BINDING_KEY, JSON.stringify({ event: 'GET_USER', data: { userid } }))

        res.status(StatusCodes.OK).json({ status: 'success', user: response })
    })

    app.patch('/profile/update', authMiddleware, upload.single('avatar'), validator.body(updateUserSchema), async (req, res) => {
        const { name, email, status } = req.body
        const avatar = req.file
        const { userID: userid } = req.user

        // call to auth-service for user profile
        const response = await RPCrequest(process.env.AUTH_BINDING_KEY, JSON.stringify({ event: 'UPDATE_USER', data: { userid, name, email, status, avatar } }))

        res.status(StatusCodes.OK).json({ status: 'success', user: response })
    })

    app.delete('/profile/delete', authMiddleware, async (req, res) => {
        const { userID: userid } = req.user

        Promise.all([
            await RPCrequest(process.env.AUTH_BINDING_KEY, JSON.stringify({ event: 'DELETE_USER', data: { userid } })),
            await RPCrequest(process.env.MEMORIES_BINDING_KEY, JSON.stringify({ event: 'DELETE_MEMORIES', data: { userid } })),
            await RPCrequest(process.env.REACTIONS_BINDING_KEY, JSON.stringify({ event: 'DELETE_COMMENTS_USERID', data: { userid } }))

        ])

        res.status(StatusCodes.OK).json({ status: 'success', msg: 'account deleted successfully' })
    })

    app.get('/whoami', (req, res, next) => {
        return res.status(StatusCodes.OK).json({ msg: '/users : I am User Service' })
    })
}
