/* eslint-disable camelcase */
const UserService = require('../../Services/user.auth')
const { StatusCodes } = require('http-status-codes')
const validator = require('express-joi-validation').createValidator({})
const { signupSchema, idtokenSchema, loginSchema, forgotSchema, resetSchema } = require('../../Utils/validators')
const upload = require('../../Utils/multer')
const { RPCobserver } = require('../../Utils/events')

module.exports = (app) => {
    const service = new UserService()
    RPCobserver(service)

    app.post('/signup', upload.single('avatar'), validator.body(signupSchema), async (req, res) => {
        const { name, email, password } = req.body
        const avatar = req.file

        await service.SignUp({ name, email, password, avatar })
        res.status(StatusCodes.CREATED).json({ status: 'success', msg: 'verification link sent to email' })
    })

    app.patch('/verify/:id/:token', validator.params(idtokenSchema), async (req, res) => {
        const { id: _id, token } = req.params
        await service.verify({ _id, token })
        res.status(StatusCodes.OK).json({ status: 'success', msg: 'verification complete' })
    })

    app.post('/login', validator.body(loginSchema), async (req, res) => {
        const { email, password } = req.body
        const accessToken = await service.login({ email, password })
        res.status(StatusCodes.OK).json({ status: 'success', token: accessToken })
    })

    app.post('/forgot', validator.body(forgotSchema), async (req, res) => {
        const { email } = req.body
        await service.forgotPassword({ email })
        res.status(StatusCodes.OK).json({ status: 'success', msg: 'password reset link sent to email' })
    })

    app.patch('/reset/:id/:token', validator.params(idtokenSchema), validator.body(resetSchema), async (req, res) => {
        const { id: _id, token } = req.params
        const { new_password } = req.body
        await service.resetPassword({ _id, token, new_password })
        res.status(StatusCodes.OK).json({ status: 'success', msg: 'password reset complete' })
    })

    app.get('/whoami', (req, res, next) => {
        return res.status(StatusCodes.OK).json({ msg: '/auth : I am Auth Service' })
    })
}
