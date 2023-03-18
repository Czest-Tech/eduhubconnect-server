import { Schema, model } from "mongoose";
import {UserSettings} from './user.interface'
const findOrCreate = require('mongoose-findorcreate');

const Settings = new Schema(
    {
        userId: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        notificationSettings: {
            type:Array,
            required:true,
            default:[
                {
                   name:"Send Promitions to via sms", value:false 
                },
                {
                    name:"Receive monthly news letter to my email", value:true 
                 },
                 {
                    name:"Enable notification sound", value:false 
                 }
            ]
        },
        notificationPrivacySettings: {
            type:Array,
            required:true,
            default:[
                {
                   name:"Show My Profile", value:false 
                },
                {
                    name:"Find me on Google", value:true 
                 },
                 {
                    name:"Share my location", value:false 
                 },
                 {
                    name:"Find me by EMail Address", value:false 
                 }
            ]
        },
       

    },
    {timestamps:true}
);
// const newSc = UserSchema.plugin(findOrCreate);
export default model<UserSettings>('UserSettings', Settings);