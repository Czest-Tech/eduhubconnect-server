import { User } from '../user/user.interface';
import { Document } from 'mongoose';

export default interface Jobs extends Document {
    name:String;
    skills:Array<string>;
    location:string;
    phone:string;
    email:string;
    nameSlug:string;
    desctrition:string;
    attachments:Array<string>;
    links:Array<string>;
    postedBy: User["_id"];
    createdAt: Date;
    updatedAt: Date;
    isActive:boolean;
}