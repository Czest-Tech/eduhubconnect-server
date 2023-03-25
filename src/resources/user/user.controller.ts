import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptions/http.exception';
import validationMiddleware from '../../middleware/validation.middleware'
import {signup,uploadImage, updateUser} from './user.validate'
import UserService from    './user.service';
import HashKeys from '../../utils/hashKeys';
import multer from 'multer';
import fs from 'fs';
import util from 'util';
import { uploadS3, getFileStream } from '../../utils/uploadFiltersHandler';
import mongoose from 'mongoose';
import EmailHandler from '../../utils/emailHandler';
import SMSHandler from '../../utils/smsHandler';

class UserController implements Controller {
    public router = Router();
    public path = '/user';
    private upload  =  multer({ dest: './'});
    private userRegisterEndoint = '/register';
    private userUpdate = '/update';
    private deleteUser = '/delete/:id';
    private getAllUsersEndpoint = '/get-users';
    private getUserById = '/get-user/:id'
    private uploadUserPicture = '/profile-picture-upload'
    private uploadUserCover = '/profile-cover-upload'
    private updateProfileInfo = '/profile-info-update'
    private updateUserSettingsEndpoint = '/settings';
    private verifyUser = '/verify-email'
    private verifyUserSms = '/verify-sms'
    private unlinkFile = util.promisify(fs.unlink);
    // private upload  =  multer({ dest: '/uploads' });


    private userService =  new UserService()
    private initHashClass =  new HashKeys();
    private smsHander = new SMSHandler()
    constructor(){
        this.initialiseRoutes()
    }

    private initialiseRoutes():void {
        this.router.post(`${this.path+this.uploadUserPicture}`,[ this.upload.single('image'), validationMiddleware(uploadImage)], this.uploadProfilePicture);
        this.router.post(`${this.path+this.uploadUserCover}`,[ this.upload.single('image'), validationMiddleware(uploadImage)], this.uploadProfileCover);

        this.router.post(`${this.path+this.userRegisterEndoint}`, validationMiddleware(signup), this.create);
        this.router.patch(`${this.path+this.userUpdate}`, validationMiddleware(updateUser), this.update);
        this.router.delete(`${this.path+this.deleteUser}`, this.delete);
        this.router.get(`${this.path+this.getAllUsersEndpoint}`, this.getAllUsers);
        this.router.put(`${this.path+this.updateProfileInfo}`, this.updateUserInfo);
        this.router.get(`${this.path+this.getUserById}`, this.getUserByID);
        this.router.post(`${this.path+this.updateUserSettingsEndpoint}`, this.updateUserSettings);
        this.router.post(this.path+this.verifyUser, this.verificationFunction )
        this.router.get(this.path+this.verifyUser, this.GetVerificationFunction )
        this.router.post(this.path+this.verifyUserSms, this.SMSVerificationFunction )


  

    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { firstName,lastName,email,password,accountType} = req.body;
            console.log(req.body)
            const hashedPassword = await  this.initHashClass.hashPassword(password) ;
            if(hashedPassword){
                 const user =  await this.userService.create(firstName,lastName,email,hashedPassword,accountType) as any
                 (user && (delete  user["password"]))
                 res.status(201).json({user})
            } else {
                res.status(501).json(new HttpException(400, 'can not create user'))
            }

           
        } catch (error:any) {
            next(new HttpException(400, error.message))
        }
    }

    private update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const sessionId = res.locals.user._id;
            const updateQuery  = req.body

            
            if(res.locals.user){
                 const user =  await this.userService.update(sessionId, updateQuery)
                 res.status(201).json({user})
            } else {
                res.status(501).json(new HttpException(400, 'can not send post'))
            }
           
        } catch (error:any) {
            next(new HttpException(400,error.message))
        }
    }
    private delete = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const sessionId = res.locals.user._id;
            const {id}  = req.params
       
            if(res.locals.user){
                 const user =  await this.userService.delete(id)
                 res.status(201).json({user})
            } else {
                res.status(501).json(new HttpException(400, 'can not delete user'))
            }
            
               
        } catch (error) {
            next(new HttpException(400, 'can not delete user'))
        }
    }
    private getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {     
            const users =  await this.userService.getAllUsers()
            
             res.status(201).json({users})
         
        } catch (error:any) {
            next(new HttpException(400,error.message))
        }
    }
    private getUserByID = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {    
            const {id} = req.params; 
            const user =  await this.userService.getUserByID(id)
            if(user){ 
                 res.status(201).json({user})
            } else {
                res.status(501).json(new HttpException(400, 'can not delete user'))
            }
            
               
        } catch (error) {
            next(new HttpException(400, 'can not delete user'))
        }
    }
    private uploadProfilePicture = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
           
            const file = req.file as any;
            const {userId,profileSource } = req.body;
            const result = await uploadS3(file)
            await this.unlinkFile(file.path)
            
            const user =  await this.userService.update({_id:new mongoose.Types.ObjectId(userId) }, {profilePhoto:result,profilePhotoSource:profileSource})

            res.send(user)
        } catch (error:any) {
            next(new HttpException(400, error.message))
        }
    }
    private uploadProfileCover = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
           
            const file = req.file as any;
            const {userId,profileSource } = req.body;
            const result = await uploadS3(file)
            await this.unlinkFile(file.path)
        
            const user =  await this.userService.update({_id:userId}, {profileCoverPhoto:result,profilePhotoSource:profileSource})

            res.send(user)
        } catch (error:any) {
            next(new HttpException(400, error.message))
        }
    }
    private updateUserInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {userId} = req.body;
            var updateQuery:object  = req.body
            const user =  await this.userService.update({_id:new mongoose.Types.ObjectId(userId)}, updateQuery)
            res.status(201).json({user})

        } catch (error:any) {
            next(new HttpException(400,error.message))
        }
    }
    private updateUserSettings = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {userId} = req.body;
            var updateQuery:object  = req.body
            const user =  await this.userService.createOrupdateUserSettings({userId:new mongoose.Types.ObjectId(userId)}, updateQuery)
            res.status(201).json({user})

        } catch (error:any) {
            next(new HttpException(error.status,error.message))
        }
    }
    private verificationFunction = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      const {userId, email,UserName} = req.body;
      const comfirmationNumber =  this.initHashClass.generateKey(5,"mixed");

      try {
        let userSaveData = {
            userId:userId,
            token:comfirmationNumber,
            email:email,
            isExpired:false,      
        }
        let sendObj = {
            to:email,
            from:"mabineteam@mabine.co",
            subject:"Email Verification",
            dynamic_template_data: {code:comfirmationNumber,first_name:UserName, Sender_Name:"Ma Bine", Sender_City:"Lusaka,Zambia",Sender_Zip:"101010", Sender_Address:"Nalikwanza Rd, Woodlands"} as any,
            
        }
         const newEmaiil =  new EmailHandler(sendObj);
         const sendEmail =  await newEmaiil.sendEmail();
         const user =  await this.userService.createOrupdateUserVerificationSettings({userId:new mongoose.Types.ObjectId(userId)}, userSaveData)
         res.status(201).json({message:"succesiful"})
      } catch (error:any) {
        next(new HttpException(error.status,error.message))
      }

      
    }
    private GetVerificationFunction = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {userId,code, email }=  req.body;
            const checCode = await this.userService.verifyCode({userId: new mongoose.Types.ObjectId(userId)}, {email:email, token:code})
            console.log(checCode)
        } catch (error:any) {
            console.log(error.message)
        }
     }
     private SMSVerificationFunction = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {userId,number }=  req.body;
            const comfirmationNumber =  this.initHashClass.generateKey(5,"numbers");
            let body = `Your Verification code is: ${comfirmationNumber} \n Mabine Team`
            const smsSend =  this.smsHander.setFieldName('to', number)
            this.smsHander.setFieldName('body', body)
            this.smsHander.sendSms()
        } catch (error:any) {
            console.log(error.message)
        }
     }
}
export default UserController;