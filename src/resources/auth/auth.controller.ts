import { Router, Request, Response, NextFunction } from 'express';
import { get } from "lodash";
import Controller from '../../utils/interfaces/controller.interface';
import validationMiddleware from '../../middleware/validation.middleware'
import validate from './auth.validate'
import UserService from '../user/user.service';
import HashKeys from '../../utils/hashKeys';
import SessionController from '../sessions/session.controller';
import HttpException from '../../utils/exceptions/http.exception';
import SessionHandler from '../sessions/session.service';
import passport from "passport";
import { env } from 'process';
import { AnyARecord } from 'dns';
import mongoose from 'mongoose';
import { User } from '../user/user.interface';
class AuthController implements Controller {
  public router = Router();
  public path = "/auth";
  public loginRoute = "/login";
  public logOutRoute = "/logout";
  public loginGoogle = "/google";
  public getSesion = "/get-session";
  public reSendVerificatione = "/re-send-verification";

  private changePasswordRoute = "/change-password"

  private hashKeys = new HashKeys();
  private userService = new UserService();
  private sessionHandler = new SessionController();
  private loginRedirect = env.CLIENT_APP_URL as string;
  loginFailureRedirect = this.loginRedirect + "/login"

  constructor() {

    this.initialiseRoutes()
  }
  private initialiseRoutes(): void {
    this.router.post(`${this.path + this.loginRoute}`, validationMiddleware(validate.login), this.loginUser);
    this.router.post(`${this.path + this.logOutRoute}`, this.logOut);
    this.router.put(`${this.path + this.changePasswordRoute}`, this.changePassword);
    this.router.post(`${this.path + this.loginRoute}/social/:id`, this.checkSocial);
    this.router.get(`${this.path + this.getSesion}`, this.decodeSession);
    this.router.get(this.path + this.loginGoogle, passport.authenticate("google", { scope: ["profile", "email"] }));
    this.router.get(`${this.path + this.loginRoute + this.loginGoogle}`, this.loginWithGoogle);
    this.router.get(`${this.path + this.loginGoogle}/callback`, passport.authenticate("google", { failureRedirect: this.loginFailureRedirect }), this.loginWithGoogleCallBack);
    this.router.post(`${this.path + this.reSendVerificatione}`, this.reSendVerification)
  }

  private loginUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    var loginResponse = {};
    try {

      const { email, password } = req.body;
      const checkLogin = await this.userService.findUser(email)
      if (checkLogin) {
        const checkPassword = await this.hashKeys.checkPasswordHash(password, checkLogin.password);

        if (checkPassword) {
          if(checkLogin.isEmailVerified as any){
            checkLogin
            const createUserSession = await this.sessionHandler.CreateUserSession(checkLogin, req.get("user-agent") || "")


             return res.send({checkLogin,createUserSession})
          } else {
             return res.send({email:email, isEmailVerified:checkLogin.isEmailVerified})
          }
          

          
        } else {
          let errors = { errors: ["wrong password"] } as any;
          return next(new HttpException(401, errors))
        }

      } else {
        let errors = { errors: ["wrong password"] } as any;
        next(new HttpException(401, errors))
      }
    } catch (error: any) {
      next(new HttpException(401, error.message))

    }

  }

  private decodeSession = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

    const refreshToken: any = req.get("refreshToken");
    const accessToken: any = req.get("accessToken");


    const validate = await this.sessionHandler.validateAndReissueTokens(refreshToken, accessToken)

    return res.send(validate)
  }
  private logOut = async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

    const refreshToken: string = get(req, "headers.x-refresh");
    const { userId } = req.body;

    const logOutUser = await this.sessionHandler.deleteSessionHandler(userId, refreshToken);
    if (logOutUser) {
      req.logout(function(err:any) {
        if (err) { return next(err); }
          res.send({logoutHandler:logOutUser, loggedOut:true})
      });
    }


  }
  private loginWithGoogle = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const runAuth = passport.authenticate("google", { scope: ["profile", "email"] })
      return res.send(runAuth)
    } catch (error: any) {
      next(new HttpException(401, error.message))
    }
  }
  private loginWithGoogleCallBack = async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      let link = `${this.loginFailureRedirect}?social=${req.user[1].accessToken}`
      res.redirect(link);
    } catch (error: any) {
      next(new HttpException(401, error.message))
    }
  }
  private checkSocial = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {

      const { id } = req.params;
      const session = await this.sessionHandler.getUserSession(id)
      return res.send(session)
    } catch (error: any) {
      next(new HttpException(500, error.message))
    }
  }
  private changePassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try{
        const { email,userId, oldPassword,newPassword } = req.body;
        const checkLogin = await this.userService.findUser(email)
        if (checkLogin) {
          const checkPassword = await this.hashKeys.checkPasswordHash(oldPassword, checkLogin.password);
          if( checkPassword ){
              const hashedPassword = await  this.hashKeys.hashPassword(newPassword) ;
              if(hashedPassword){
                const user = await this.userService.update({_id:new mongoose.Types.ObjectId(userId)},{password:hashedPassword} )
                res.status(201).json({user})
              } 
          
          } else {
            res.status(401).json({message:"old password not correct"})
          }
        } else {
          res.status(401).json({message:"user not found"})
        }

    } catch (error:any) {
      next(new HttpException(400,error.message))
    } 
    
  }
  private reSendVerification = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {email,token,type }=  req.body;
      const checCode = await this.userService.verificationCode(req.body)
      console.log(checCode)
          if(checCode){
            if(type === "resend"){
              res.status(201).json({status:201,type:type,loggedIn:false, reference:checCode})
            } else {
        
              const userData = await this.userService.findUser(email)
              const createUserSession = await this.sessionHandler.CreateUserSession(userData, req.get("user-agent") || "")
              
              if(userData?.isEmailVerified){
                return  res.status(201).json({userData,createUserSession,status:201,type:type, loggedIn:true,reference:checCode})
              }
            }
          }

          return  res.status(201).json({status:401,type:type,loggedIn:false})

      
    } catch (error:any) {
        console.log(error.message)
    }
 }

}
export default AuthController;