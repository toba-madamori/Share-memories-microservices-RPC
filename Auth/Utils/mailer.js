const nodemailer = require('nodemailer')
const logger = require('./logger')
const mg = require('nodemailer-mailgun-transport')

const mailgunAuth = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
}

const smtpTransport = nodemailer.createTransport(mg(mailgunAuth))

const sendMail = (options) => {
    return new Promise((resolve, reject) => {
        try {
            smtpTransport.sendMail(options)
            resolve(true)
        } catch (error) {
            logger.error(error.message, { tag: 'signup mailer' })
        }
    })
}

module.exports = {
    sendMail
}
