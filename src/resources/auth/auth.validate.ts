import Joi from 'joi';

const login = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});



export default { login }