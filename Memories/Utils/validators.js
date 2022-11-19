const Joi = require('joi')

const stringRequired = Joi.string().trim(true).required()
const array = Joi.array().items(Joi.string().trim(true))

const newMemorySchema = Joi.object().keys({
    title: stringRequired,
    tags: array
})

const idSchema = Joi.object().keys({
    id: Joi.string().hex().length(24).pattern(/^[0-9a-fA-F]{24}$/).required()
})

const updateMemorySchema = Joi.object().keys({
    title: Joi.string().trim(true),
    tags: array
})

const searchSchema = Joi.object().keys({
    title: Joi.string().trim(true),
    tags: Joi.string().trim(true),
    page: Joi.number().integer(),
    limit: Joi.number().integer()
})

module.exports = {
    newMemorySchema,
    idSchema,
    updateMemorySchema,
    searchSchema
}
