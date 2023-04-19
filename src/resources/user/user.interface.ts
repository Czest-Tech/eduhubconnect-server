import {Document, ObjectId} from 'mongoose'

interface UpdateUser extends Document{
    firstName: string;
    lastName: string;
    email:string;
}
interface User extends UpdateUser,Document {
  isEmailVerified: boolean;
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
  title?:string;
  accountType:number;
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
interface UserVerificationResend extends  Document,UserVerification {
  _id:ObjectId;
  
}
interface StudentAccount extends UserDocument {
  userId : User["_id"];
  skills: Object;
  files: Object;
  resume: Object;
  education: Object;
}
interface Agent extends UserDocument {
  userId : User["_id"];
  about: string;
  phone:string;
  configs:Object;
  email:string;
  verified: boolean;
}
interface Company extends UserDocument { 
  createdBy: User["_id"];
  name:string;
  city:string;
  country:string;
  configs:Object;
  description:string;
  about:string;
  images:Array<any>;
  files:Array<any>;
  contact:string;
  address:string;
}
interface CompanyUsers extends UserDocument {
  companyId: Company["_id"];
  userId: User["_id"];
  userType:number;
}
interface UserAccounts extends Document {
  userId: User["_id"];
  accountType:number;
  isActive:Boolean;
  verified:boolean;
}
 
 
export { User, UserDocument, Agent, UserAccounts, CompanyUsers,UserVerificationResend, Company,UpdateUser, UserSettings, StudentAccount, UserVerification }