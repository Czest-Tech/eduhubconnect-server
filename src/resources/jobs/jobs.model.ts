import { Schema , model } from "mongoose";
import { Jobs, Applications  } from "./jobs.interface";

const jobSchema = new Schema (
    {
        name:{type: String, required: true},
        skills:{
            type:Array<string>,
            required: false,
            default: []
        },
        location:{type: String, required: true,default: ""},
        phone:{type: String, required: false, default:null},
        email:{type: String, required: false,default: ""},
        nameSlug:{type: String, required: false,default: ""},
        description:{type: String, required: false,default: ""},
        duration:{type: String, required: false,default: ""},
        level:{type: String, required: false,default: ""},
        attachments:{
            type:Array<string>,
            required: false,
            default: []
        },
        links:{
            type:Array<string>,
            required: false,
            default: []
        },
        period:{type: String, required: false,default: ""},
        amount:{type: Number, required: false,default: 0.00},
        rate:{type: String, required: false, default: ""},
        currency:{type: String, required: false,default: ""},
        postedBy: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        companyId: {
            type:Schema.Types.ObjectId,
            ref: "CompanyAccounts",
            required: true
        },
        isActive:{type: String, required: false}
    },
    {timestamps:true}
);

const applicationSchema = new Schema (
    {
        firstName:{type: String, required: false,default: ""},
        lastName:{type: String, required: false,default: ""},
        jobId:{
            type:Schema.Types.ObjectId,
            ref: "Jobs",
            required: true
        },
        applicationId:{type: String, required: false,default: ""},
        images:{
            type:Array<string>,
            required: false,
            default: []
        },
        files: {
            type:Array<string>,
            required: false,
            default: []
        },
        about: {type: String, required: false,default: ""},
        address:{type: String, required: false,default: ""},
        city:{type: String, required: false,default: ""},
        country:{type: String, required: false,default: ""},
        email:{type: String, required: false,default: ""},
        description: {type: String, required: false,default: ""},
        contact: {type: String, required: false,default: ""},
        skills: {
            type:Array<string>,
            required: false,
            default: []
        },
        location: {type: String, required: false,default: ""},
        phone: {type: String, required: false,default: ""},
        level: {type: String, required: false,default: ""},
        amount: {type: Number, required: false,default: 0.00},
        rate: {type: String, required: false,default: ""},
        duration:{type: String, required: false,default: ""},
        currency:{type: String, required: false,default: ""},
        period:{type: String, required: false,default: ""},
        resume: {
            type:Array<string>,
            required: false,
            default: []
        },
        links:{
            type:Array<string>,
            required: false,
            default: []
        },
        postedBy: {type: String, required: false,default: ""},
        companyId: {type: String, required: false,default: ""},
    },
    {timestamps:true}
)

export const JobSchema =  model<Jobs>('Jobs', jobSchema);
export const ApplicationSchema = model<Applications>('Applications', applicationSchema);