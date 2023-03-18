import MessagesSchema from './messages.model'
import {MessagesInterface} from './message.interface'
import { Schema,FilterQuery,ObjectId, UpdateQuery, SchemaType } from 'mongoose';
import mongoose from 'mongoose';

class MessagesService {
    private messagesModel = MessagesSchema;

    public async create(body:any): Promise<MessagesInterface> {
        try { 
            const { toUserId, fromUserId } = body;
            const message =  await this.messagesModel.create({...body});
            const chats = await this.findUserConversation(toUserId,fromUserId);     
            return (message)? chats : message;
        } catch (error:any) {
            throw new Error(error.message);
            
        }
    }
    
    public async update(body:UpdateQuery<MessagesInterface>, MessageId:any): Promise<any> {
        try {
            const updated =  await this.messagesModel.findOneAndUpdate({_id:MessageId},{...body},{returnDocument:"after"});
            return updated;
        } catch (error) {
            throw new Error("unable to message");
            
        }
    }
    public async getAllMessages(): Promise<any> {
        try {
            const Messages =  await this.messagesModel.find();
            return Messages;
        } catch (error) {
            throw new Error("unable to message");
            
        }
    }
    public async getSingleMessage(MessageId:any):Promise<any> {
        try {
            const singleMessage =  await this.messagesModel.findOne({_id:MessageId});
            return singleMessage;
        } catch (error) {
            throw new Error("unable to message");
            
        }
    }
    public async findMessageByOwnerId(OwnerId:any):Promise<any> {
        try {
            const singleMessage =  await this.messagesModel.findOne({userId:OwnerId});
            return singleMessage;
        } catch (error) {
            throw new Error("unable to message");
            
        }
    } 
    public async findMessageByOwnerIdAndMessageId(OwnerId:any, shopId:any):Promise<any> {
        try {
            const singleMessage =  await this.messagesModel.findOne({userId:OwnerId,_id:shopId});
            return singleMessage;
        } catch (error:any) {
            throw new Error(error);
            
        }
    }
    public async findUserMessages(OwnerIds:any):Promise<any> {
        const OwnerId = new mongoose.Types.ObjectId(OwnerIds)
        try {
            const singleMessage =  await this.messagesModel.aggregate([
                {$match:{ $or: [{fromUserId:OwnerId},{toUserId:OwnerId },{userId:OwnerId }] }},
                {
                    $lookup: {
                        from: "users",
                        localField: "toUserId",
                        foreignField: "_id",
                        as: "receiverData"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "fromUserId",
                        foreignField: "_id",
                        as: "senderData"
                    }
                },
            ]).sort({"createdAt":-1});
            
            return singleMessage;
        } catch (error:any) {
            throw new Error(error.message);
            
        }
    }

    public async findUserConversation(receiverId:any, myID:any):Promise<any>{
        const OwnerId = new mongoose.Types.ObjectId(myID)
        const recweiverID = new mongoose.Types.ObjectId(receiverId)

        try{

            let chats = await this.messagesModel.aggregate([
                {$match: { $or: [ {fromUserId:recweiverID,toUserId:OwnerId} ,{fromUserId:OwnerId,toUserId:recweiverID}]}},
                {
                    $lookup: {
                        from: "users",
                        localField: "toUserId",
                        foreignField: "_id",
                        as: "receiverData"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "fromUserId",
                        foreignField: "_id",
                        as: "senderData"
                    }
                },
                
            ]).sort({"createdAt":1});

            if(chats.length !== 0){
                const newObject = chats[chats.length -  1];
                
                if(!OwnerId.equals(newObject.fromUserId) ){
                    const updateLast = await this.messagesModel.findOneAndUpdate({_id:new mongoose.Types.ObjectId(newObject._id)},{seen:true})
                    chats[chats.length -  1].seen = true
                }
            }

         return chats
        } catch (error:any) {
            throw Error(error.message)
        }

     
    }

    public async deleteMessage(MessageId:any):Promise<any> {
        try {
             
            const deleteMessage =  await this.messagesModel.deleteOne({_id:MessageId});

            return deleteMessage;
        } catch (error) {
            throw new Error("unable to message");
            
        }
    }
    

}
export default MessagesService;