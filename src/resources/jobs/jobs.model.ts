import { Schema , model } from "mongoose";
import Jobs from "./jobs.interface";

const JobSchema = new Schema (
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
export default model<Jobs>('Jobs', JobSchema);