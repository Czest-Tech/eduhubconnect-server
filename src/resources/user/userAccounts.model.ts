import { Schema, model } from "mongoose";
import {Agent,CompanyUsers,StudentAccount, Company} from './user.interface'

const agentSchema = new Schema(
    {
        userId: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        notificationSettings: {
            type:Array,
            required:true,
          
        },
        about: {
            type:String,
            required:true,
           
        },
       

    },
    {timestamps:true}
);
const companySchema = new Schema(
    {
        createdBy: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        notificationSettings: {
            type:Array,
            required:true        
        },
        images: {
            type:Array,
            required:true        
        },
        files: {
            type:Array,
            required:false        
        },
        about: {
            type:String,
            required:true         
        },
        name: {
            type:String,
            required:false         
        },
        country: {
            type:String,
            required:false         
        },
        description: {
            type:String,
            required:false         
        },
        contact: {
            type:String,
            required:false         
        },
       

    },
    {timestamps:true}
);

const companyUsersSchema = new Schema(
    {
        companyId: {
            type:Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },
        userId: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userType: {
            type:Number,
            required:true, 
        },
       

    },
    {timestamps:true}
);

export const CompanyUsersSchema =  model<Agent>('Company', companyUsersSchema);
export const CompanySchema =  model<Agent>('Company', companySchema);
export const AgentSchema =  model<Agent>('UserSettings', agentSchema);