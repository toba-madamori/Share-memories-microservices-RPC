const AuthService = require('../../Services/user.auth')
const { StatusCodes } = require('http-status-codes')

module.exports = (app) => {
    const service = new AuthService()

    app.use('/app-events', async (req, res, next) => {
        const { payload } = req.body

        // handle subscribe events
        const data = await service.SubscribeEvents(payload)

        return res.status(StatusCodes.OK).json({ status: 'success', data })
    })
}
