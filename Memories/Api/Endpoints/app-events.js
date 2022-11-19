const MemoryService = require('../../Services/memories')
const { StatusCodes } = require('http-status-codes')

module.exports = (app) => {
    const service = new MemoryService()

    app.use('/app-events', async (req, res, next) => {
        const { payload } = req.body

        // handle subscribe events
        const data = await service.SubscribeEvents(payload)

        return res.status(StatusCodes.OK).json({ status: 'success', data })
    })
}
