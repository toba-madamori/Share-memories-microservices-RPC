const Joi = require('joi')

const name = Joi.string().trim(true)
const email = Joi.string().email().trim(true)

const updateUserSchema = Joi.object().keys({
    name,
    email,
    status: Joi.string().trim(true)
})

const idSchema = Joi.object().keys({
    id: Joi.string().hex().length(24).pattern(/^[0-9a-fA-F]{24}$/).required()
})

module.exports = {
    idSchema,
    updateUserSchema
}
