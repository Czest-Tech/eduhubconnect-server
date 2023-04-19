import { Schema, model } from "mongoose";
import {Agent,CompanyUsers,StudentAccount, Company} from './user.interface'

const agentSchema = new Schema(
    {
        userId: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        configs: {
            type:Object,
            required:false,
            default:{}
          
        },
        about: {
            type:String,
            required:false, 
            default:''    
        },
        email: {
            type:String,
            required:false,
            default:''
           
        },
        phone: {
            type:String,
            required:false,
            default:'',        
        },
        verified: {
            type:Boolean,
            required:false,
            default:false        
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
        configs: {
            type:Object,
            required:false,
            default:{}        
        },
        images: {
            type:Array,
            required:false,
            default:[]        
        },
        files: {
            type:Array,
            required:false,
            default:[]         
        },
        about: {
            type:String,
            required:false,
            default:""         
        },
        name: {
            type:String,
            required:false,
            default:""        
        },
        country: {
            type:String,
            required:false,
            default:""          
        },
        description: {
            type:String,
            required:false,
            default:""         
        },
        contact: {
            type:String,
            required:false,
            default:""          
        },
        address: {
            type:String,
            required:false,
            default:""          
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
const userAccountsSchema = new Schema(
    {
  
        userId: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        accountType: {
            type:Number,
            required:true, 
        },
        isActive: {
            type:Boolean,
            required:true, 
            default:false
        },
        verified: {
            type:Boolean,
            required:true, 
            default:true
        },     

    },
    {timestamps:true}
);
const studentSchema = new Schema(
    {
        
        userId: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        skills: {
            type:Object,
            required:false,
            default:{}
          
        },
        files: {
            type:Object,
            required:false,
            default:{}
          
        },
        resume: {
            type:Object,
            required:false,
            default:{}
          
        },
        education: {
            type:Object,
            required:false,
            default:{}
          
        },
       

    },
    {timestamps:true}
);

export const CompanyUsersSchema =  model<Agent>('CompanyUsers', companyUsersSchema);
export const CompanySchema =  model<Agent>('CompanyAccount', companySchema);
export const AgentSchema =  model<Agent>('AgentAccount', agentSchema);
export const StudentSchema =  model<Agent>('StudentAccount', studentSchema);
export const UserAccountsSchema =  model<Agent>('UserAccounts', userAccountsSchema);
