import mongoose,{ FilterQuery, UpdateQuery } from 'mongoose';
import UserModel from './user.model'
import UserSettingsModel from './userSettings.model'
import {User, UserDocument,UserSettings,UserVerification,UserVerificationResend} from './user.interface'
import userVerificationModel from './userVerification.model';
import HashKeys from '../../utils/hashKeys';
import EmailHandler from '../../utils/emailHandler';

class UserService {
    private user = UserModel;
    private userSettingsModel = UserSettingsModel;
    private userVerification = userVerificationModel;
    private hashKeys = new HashKeys();
    private emailHandler = new EmailHandler()

    public async create(firstName:string, lastName: string, email:string, password:string,accountType:string): Promise<User> {
        try {
            const creatUser =  await this.user.create({firstName,lastName,email, password,accountType});
            let userSettings = {
                "userId":creatUser._id,
                "notificationSettings": [
                            {
                               "name":"Send Promitions to via sms", "value":false 
                            },
                            {
                                "name":"Receive monthly news letter to my email", "value":true 
                             },
                             {
                                "name":"Enable notification sound", "value":false 
                             }
                        ],
                
                "notificationPrivacySettings":     [
                            {
                               "name":"Show My Profile", "value":false 
                            },
                            {
                                "name":"Find me on Google", "value":true 
                             },
                             {
                                "name":"Share my location", "value":false 
                             },
                             {
                                "name":"Find me by EMail Address", "value":false 
                             }
                        ]
            
            }
            const createAcounts = (accountType:number) => {
                if(accountType === 1 ){
                    
                }
            }
            if(creatUser._id){
                const mailCode = this.hashKeys.generateKey(6,"IUoid1o3noi3u3IH5n4oi766UG89O56ijO8gvBHfgty");
                this.emailHandler.setFieldText(firstName, mailCode);
                this.emailHandler.setRecepient({email:email});
                const data = {email:email,token:mailCode, isExpired:false}
                await this.emailHandler.sendMailTrap();
                await this.userVerification.updateOne({userId: new mongoose.Types.ObjectId(creatUser._id)}, data,{upsert:true})
            }
            await this.createOrupdateUserSettings({userId:creatUser._id}, userSettings)


            return creatUser;
        } catch(error:any) {
            throw new Error(error.message);
            
        }
    }

    public async verificationCode (filterQuery:any): Promise<boolean | undefined>  {
        
        try{
            const {token, type, email} = filterQuery;
            const send =  await this.userVerification.find({email: email});

            if(type === 'resend'){
               if(send){
                const mailCode = this.hashKeys.generateKey(6,"IUoid1o3noi3u3IH5n4oi766UG89O56ijO8gvBHfgty");
                this.emailHandler.setFieldText("User", mailCode);
                this.emailHandler.setRecepient({email:email});
                const data = {email:email,token:mailCode, isExpired:false}
                await this.emailHandler.sendMailTrap();
                await this.userVerification.updateOne({email:email}, data,{upsert:true})
                return true;
               } 
               return false
            }
            
            if(type === "verify") {
                if(send[0].token === token && !send[0].isExpired){
                 const updateOne =  await this.user.updateOne({_id:new mongoose.Types.ObjectId(send[0].userId)}, {isEmailVerified:true});
                 const updateTwo = await this.userVerification.updateOne({email:email},{isExpired:true});
                 return true
                } else {
                    return false
                }
            }

        } catch (error:any) {
            throw new Error(error.message);

        }
    }

    public async update(update:FilterQuery<UserDocument>,query:UpdateQuery<UserDocument>) {
        try {
            const updateUser =  await this.user.findOneAndUpdate(update, query,{returnDocument:"after"});
            return updateUser;
        } catch (error:any) {
            throw new Error(error.message);
            
        }
    }
    public async delete(id:any) {
        try {
            const creatUser =  await this.user.deleteOne(id);
            return creatUser;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }
    public async getAllUsers() {
        try {
            const getAllUsers =  await this.user.aggregate(  [{ $set: { password: ""} }]);
            return getAllUsers;
        } catch (error:any) {
            throw new Error(error.message);
            
        }
    }

    public async findUser(query:any){
        try{
            const checkEmail = await this.user.findOne({email: query});
            return checkEmail;
        } catch (error:any) {
            throw new Error(error.message);
            
        }
    }
    public async getUserByID(query:any){
        try{
            const getUser = await this.user.findOne({_id: new mongoose.Types.ObjectId(query) }) as any;
              if(getUser?.password) {delete getUser.password }
            return getUser?.toJSON();
        } catch (error:any) {
            throw new Error(error.message);
            
        }
    }
    public async createOrupdateUserSettings(update:FilterQuery<UserSettings>,query:UpdateQuery<UserSettings>) {
        try {
            const updateUser =  await this.userSettingsModel.updateOne(query,update,{returnDocument:"after",upsert:true});
            return updateUser;
        } catch (error:any) {
            throw new Error(error.message);
            
        }
    }
    public async createOrupdateUserVerificationSettings(update:FilterQuery<UserSettings>,query:UpdateQuery<UserSettings>) {
        try {
            const updateUser =  await this.userVerification.updateOne(query,update,{returnDocument:"after",upsert:true});
            return updateUser;
        } catch (error:any) {
            throw new Error(error.message);
            
        }
    }
    public async verifyCode (filterQuery:FilterQuery<UserSettings>,updateQuery:UpdateQuery<UserSettings>) {
        
        try{
            const checkCode = await this.userVerification.find(filterQuery);
          console.log(checkCode)

        } catch (error:any) {

        }
    }

    

}
export default UserService;