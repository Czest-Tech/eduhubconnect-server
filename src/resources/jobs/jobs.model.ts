import { Schema , model } from "mongoose";
import Jobs from "./jobs.interface";

const JobSchema = new Schema (
    {
        name:{type: String, required: true},
        skills:{
            type:Array<string>,
            required: false
        },
        location:{type: String, required: false},
        phone:{type: String, required: false},
        email:{type: String, required: false},
        nameSlug:{type: String, required: false},
        description:{type: String, required: false},
        attachments:{
            type:Array<string>,
            required: false
        },
        links:{
            type:Array<string>,
            required: false
        },
        postedBy: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        isActive:{type: String, required: false}
    },
    {timestamps:true}
);
export default model<Jobs>('Jobs', JobSchema);