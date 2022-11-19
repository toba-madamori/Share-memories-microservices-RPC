const jwt = require('jsonwebtoken')
const { InternalServerError, UnauthenticatedError } = require('../Errors')
const logger = require('./logger')

const confirmRegistrationToken = (email, _id, password) => {
    return new Promise((resolve, reject) => {
        const payload = {
            email,
            id: _id
        }
        const secret = process.env.JWT_SECRET_CONFIRM_REG_TOKEN + password
        const options = {
            expiresIn: process.env.JWT_LIFETIME_CONFIRM_REG_TOKEN
        }
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                logger.error(err.message)
                reject(new InternalServerError('something went wrong, please try again later'))
            }
            resolve(token)
        })
    })
}

const verifyConfirmRegistrationToken = (user, token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_CONFIRM_REG_TOKEN + user.password, (err, payload) => {
            if (err) {
                logger.error(err.message)
                const message = err.name === 'TokenExpiredError' ? err.message : 'Authentication Invalid'
                return reject(new UnauthenticatedError(message))
            }
            const valid = true
            resolve(valid)
        })
    })
}

const signAccessToken = (userID) => {
    return new Promise((resolve, reject) => {
        const payload = {
            id: userID
        }
        const secret = process.env.JWT_SECRET_ACCESS_TOKEN
        const options = {
            expiresIn: process.env.JWT_LIFETIME_ACCESS_TOKEN
        }
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                logger.error(err.message)
                reject(new InternalServerError('something went wrong, please try again later'))
            }
            resolve(token)
        })
    })
}

const forgotPasswordToken = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            email: user.email,
            id: user._id
        }
        const secret = process.env.JWT_SECRET_FORGOT_PASSWORD + user.password
        const options = {
            expiresIn: process.env.JWT_LIFETIME_FORGOT_PASSWORD
        }
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                logger.error(err.message)
                reject(new InternalServerError('something went wrong, please try again later'))
            }
            resolve(token)
        })
    })
}

const verifyForgotPasswordToken = (user, token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_FORGOT_PASSWORD + user.password, (err, payload) => {
            if (err) {
                logger.error(err.message)
                const message = err.name === 'TokenExpiredError' ? err.message : 'Authentication Invalid'
                return reject(new UnauthenticatedError(message))
            }
            const valid = true
            resolve(valid)
        })
    })
}

module.exports = {
    confirmRegistrationToken,
    verifyConfirmRegistrationToken,
    signAccessToken,
    forgotPasswordToken,
    verifyForgotPasswordToken
}
