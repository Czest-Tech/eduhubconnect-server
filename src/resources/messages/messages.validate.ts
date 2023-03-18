import Joi from 'joi';

const create = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    location: Joi.string(),
    email: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    title: Joi.string(),
    state: Joi.string(),
    postalCode: Joi.string(),
    currency: Joi.string(),
    registrationNumber: Joi.number(),
    isActive: Joi.boolean(),
    category: Joi.string(),
    images: Joi.array(),
    rating: Joi.number(),
    socialLinks: Joi.array(),
    contact: Joi.string(),
    userId: Joi.string(),
});

const update = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    title: Joi.string().required(),
    currency: Joi.string().required(),
    registrationNumber: Joi.number().required(),
    isActive: Joi.boolean().required(),
    category: Joi.string().required(),
    images: Joi.array().required(),
    rating: Joi.number().required(),
    socialLinks: Joi.array().required(),
    contact: Joi.string().required(),
    userId: Joi.string().required(),
});

export default { create, update }