/* eslint-disable no-useless-constructor */

class CustomApiError extends Error {
    constructor (message) {
        super(message)
    }
}

module.exports = CustomApiError
