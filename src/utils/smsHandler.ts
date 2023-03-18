import { MailService } from '@sendgrid/mail/src/mail';
import  twilio, { Twilio } from 'twilio'
interface SendObject {
     to:string;
     from:string;
     body:string;
   
}

export default class SMSHandler {
     sendObject: any = {
       to:'',
       from: process.env.TWIIO_PHONE_NUMBER,
       body:'',
     } as any;
    constructor( private client?:Twilio){
        this.client =  twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN); 
    }

    setFieldName(key:{to:string, from:string,subject:String,text:string,html:string} | any, value:string){
        this.sendObject[key] = value;
    }
    sendSms(){
        this.client?.messages
        .create(this.sendObject)
        .then((response:any) => {
            console.log(response)
            return response;
        
        })
        .catch((error) => {
            console.log(error.message)
           return error;
        })
    }
    // sendEmailVerification(email:string){
        
    //     this.sendObject.email = email;
    //     // let comfirmText = `Hello ${username} \n <br> Welcome to Mabine, `
    //     return this.sendEmail()

    // }


}
