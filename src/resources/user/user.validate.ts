import Joi from 'joi';
import bcrypt from 'bcrypt'

const signup = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    comfirmPassword: Joi.string().required().equal(Joi.ref("password")).messages({
        'string.base': 'second is not a string', // typeof second !== 'string || second === null
        'any.required': 'second is required', // undefined
        'any.only': 'passwords not matching' // second !== first
      }),
      accountType: Joi.number().required(),

    
});
const updateUser = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    about: Joi.string(),
    profilePhoto: Joi.string(),
    dateOfBirth: Joi.string(),
    location: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    profession: Joi.string(),
    title:Joi.string()
    
});
const uploadImage = Joi.object({
    userId: Joi.string().required(),   
});





export { signup,updateUser,uploadImage }