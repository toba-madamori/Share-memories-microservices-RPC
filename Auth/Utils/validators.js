const Joi = require('joi')

const name = Joi.string().trim(true).required()
const email = Joi.string().email().trim(true).required()
const password = Joi.string().min(6).trim(true).required().strict()

const signupSchema = Joi.object().keys({
    name,
    email,
    password
})

const idtokenSchema = Joi.object().keys({
    id: Joi.string().hex().length(24).pattern(/^[0-9a-fA-F]{24}$/).required(),
    token: Joi.string().required()
})

const loginSchema = Joi.object().keys({
    email,
    password
})

const forgotSchema = Joi.object().keys({
    email
})

const resetSchema = Joi.object().keys({
    new_password: password
})

module.exports = {
    signupSchema,
    idtokenSchema,
    loginSchema,
    forgotSchema,
    resetSchema
}
