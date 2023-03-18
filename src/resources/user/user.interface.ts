import {Document} from 'mongoose'

interface UpdateUser extends Document{
    firstName: string;
    lastName: string;
    email:string;
}
interface User extends UpdateUser,Document {
    password: string;
    about?:string;
    profilePhoto?:Array<any>;
    profileCoverPhoto:Array<any>;
    profilePhotoSource:string;

    dateOfBirth?:string;
    location?:string;
    country?:string;
    city?:string;
    profession?:string;
    title?:string   
}

interface UserDocument extends UpdateUser,User, Document {
    createdAt: Date;
    updatedAt: Date;
}
interface UserSettings extends UserDocument, Document {
  userId:User["_id"];
  notificationSettings:Array<object>;
  notificationPrivacySettings:Array<object>;

}
interface UserVerification extends  Document {
    userId:User["_id"];
    token:string;
    email:string;
    isExpired:boolean;
  
  }
  



export {   User, UserDocument, UpdateUser,UserSettings,UserVerification}