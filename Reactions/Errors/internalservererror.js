const CustomApiError = require('../Errors/customapierror')
const { StatusCodes } = require('http-status-codes')

class InternalServerError extends CustomApiError {
    constructor (message) {
        super(message)
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    }
}

module.exports = InternalServerError
