import { User } from '../user/user.interface';
import { Document } from 'mongoose';

export default interface Jobs extends Document {
    name:String;
    skills:Array<string>;
    location:string;
    phone:string;
    email:string;
    level:string;
    amount:Number;
    rate:String;
    nameSlug:string;
    desctrition:string;
    currency:string;
    period:string;
    attachments:Array<string>;
    links:Array<string>;
    postedBy: User["_id"];
    companyId: User["_id"];
    duration:string;
    isActive:boolean;
}