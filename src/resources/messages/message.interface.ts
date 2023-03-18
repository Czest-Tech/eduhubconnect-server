import {Document} from 'mongoose'
import { User } from '../user/user.interface';

 interface MessagesInterface extends Document {
    name: string;
    title:string;
    message: string;
    reaction:string;
    deleted:boolean;
    socialLinks:Array<any>,
    images: Array<string>;
    files:Array<any>;
    userId: User["_id"];
    fromUserId: User["_id"];
    toUserId: User["_id"];
    seen:boolean;
    mentionedProduct?:string;
    mentionedShop?:string

   

}
interface UpdateMessagesInterface extends MessagesInterface {
    createdAt:Date;
    updateAt:Date;
}
export {MessagesInterface, UpdateMessagesInterface}