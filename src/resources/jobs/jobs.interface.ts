import { User, Company } from '../user/user.interface';
import { Document } from 'mongoose';

interface Jobs extends Document {
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
interface Applications extends Document {
    jobId:Jobs["_id"];
    applicationId?:string;
    images?: Array<any>;
    firstName:string;
    lastName:string;
    files?: Array<any>;
    about?: string;
    address:string;
    city:string;
    country:string;
    email:string;
    description: string;
    contact?: string;
    skills?: Array<any>;
    location?: string;
    phone: string;
    level?: string;
    amount?: 0,
    rate?: string;
    duration?: string;
    currency?: string;
    period?: string;
    resume?: [],
    links?: [],
    companyId: Company["_id"];
}

export { Jobs, Applications  }