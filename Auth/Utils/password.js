const bcrypt = require('bcrypt')
const logger = require('./logger')
const { InternalServerError } = require('../Errors')

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            const saltRounds = 10
            const salt = bcrypt.genSaltSync(saltRounds)
            const hashedPassword = bcrypt.hashSync(password, salt)
            resolve(hashedPassword)
        } catch (error) {
            logger.error(error.message)
            reject(new InternalServerError('something went wrong, please try again later'))
        }
    })
}

const validatePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        try {
            const isMatch = bcrypt.compareSync(password, hash)
            if (isMatch) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            logger.error(error.message)
            reject(new InternalServerError('something went wrong, please try again later'))
        }
    })
}

module.exports = {
    hashPassword,
    validatePassword
}
