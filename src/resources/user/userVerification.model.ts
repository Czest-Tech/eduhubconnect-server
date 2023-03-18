import { Schema, model} from "mongoose";
import {UserVerification} from "./user.interface"

const userVerifiySchma = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token:{
        type:String,
        required: false
    },
    email:{
        type:String,
        required: false
    },
    isExpired:{
        type:Boolean,
        required: false
    }
},  {timestamps:true}
);
export default model<UserVerification>('userVerification', userVerifiySchma);