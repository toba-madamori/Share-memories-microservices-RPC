/* eslint-disable no-useless-constructor */
/* eslint-disable camelcase */
const logger = require('../Utils/logger')

// All Business logic will be here
class UserService {
    constructor () {

    }

    async SubscribeEvents (payload) {
        logger.info('============= Triggering user Events =============')

        payload = JSON.parse(payload)
        const { event, data } = payload

        const {} = data

        switch (event) {
        case 'TEST':
            return true
        default:
            break
        }
    }
}

module.exports = UserService
