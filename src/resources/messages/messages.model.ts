import { boolean, string } from "joi";
import { Schema, model } from "mongoose";
import {MessagesInterface} from './message.interface'

const MessagesSchema = new Schema(
    {
        name: {
            type:String,
            required: false
        },
        title: {
            type:String,
            required: false
        },
        message: {
            type:String,
            required: false
        },
        reaction: {
            type:String,
            required: false
        }, 
        deleted: {
            type: Boolean,
            required: false
        },
        socialLinks: {
            type:Array<any>,
            required: false
        },
        images: {
            type:Array<any>,
            required: false
         
        },
        files: {
            type:Array<any>,
            required: false
        },
        seen: {
            type:Boolean,
            required: false
        },
        userId: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fromUserId: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        toUserId: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        mentionedProduct: {
            type:Schema.Types.ObjectId,
            ref: "Post",
            required: false
        },
        mentionedShop: {
            type:Schema.Types.ObjectId,
            ref: "Shop",
            required: false
        },

        
    },
    {timestamps:true}
);
export default model<MessagesInterface>('Messages', MessagesSchema);