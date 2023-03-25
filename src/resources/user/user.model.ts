import { Schema, model } from "mongoose";
import {User} from './user.interface'
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new Schema(
    {
        email: {
            type:String,
            required: true,
            unique:true
        }, 
        isEmailVerified: {
            type:Boolean,
            required:true,
            default:false
        },
        firstName: {
            type: String,
            required: true
        },
        googleId: {
            type: String,
            required: false
        },
        lastName: {
            type: String,
            required: true
        },
        accountType: {
            type: Number,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        about: {
            type: String,
            required: false
        },
        profilePhoto: {
            type: Array,
            required: false
        },
        profileCoverPhoto: {
            type: Array,
            required: false
        },
        profileSource: {
            type: String,
            required: false,
            default:"internal"
        },
        profilePhotoSource: {
            type: String,
            required: true,
            default:"internal"
        },
        dateOfBirth: {
            type: String,
            required: false
        },
        location: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        profession: {
            type: String,
            required: false
        },
        title: {
            type: String,
            required: false
        },
        phone: {
            type: String,
            required: false
        },
        provider: {
            type:String,
            required:false
        },
        providerId: {
            type:String,
            required:false
        },

    },
    {timestamps:true}
);
// const newSc = UserSchema.plugin(findOrCreate);
export default model<User>('User', UserSchema);