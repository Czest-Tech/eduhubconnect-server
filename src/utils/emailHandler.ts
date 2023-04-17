import { MailService } from '@sendgrid/mail/src/mail';
import  sgMail from '@sendgrid/mail'
import { MailtrapClient } from "mailtrap";

interface SendObject {
     to:string;
     from:string;
     subject:string;
     text?:string;
     html?: string;
     dynamic_template_data?:object;
     templateId?:string
}

export default class EmailHandler {
     sendObject: any = {
       to:'',
       from:'',
       subject:'',
       dynamic_template_data: {},
       text: '',
       html: '',
       templateId: process.env.EMAIL_VERIFICATION_TEMPLATE_KEY
     } as any;
    
    private sgmail =  sgMail;
    private client = new MailtrapClient({ endpoint: process.env.MAIL_TRAP_ENDPOINT || '', token: process.env.MAILTRAP_TOKEN || ''});
    public sender = {
        email: "no-reply@eduhubconnect.com",
        name: "EDU HUB CONNECT",
    };
    public recipients:Array<object>= [
     
    ];

    mailTrapSendObject: any = {
        
        from: this.sender,
        to: this.recipients,
        subject: "EDU HUB CONNECT NEW ACCOUNT VERIFICATION CODE",
        text: ``,
        category: "Email Verification Code",
        
     }
    constructor( ){
        // this.sgmail.setApiKey(process.env.SENDGRID_API_KEY || '');
        
        // this.sendObject = sendObject
        // this.sendObject.headers = {"Content-Encoding":"--data-binary '@data.json.gz'"}
        // this.sendObject.templateId = process.env.EMAIL_VERIFICATION_TEMPLATE_KEY;

    }

    setFieldName(key:{to:string, from:string,subject:String,text:string,html:string} | any, value:string){
        this.sendObject[key] = value;
    }
    setField(key:any, value:string){
        this.mailTrapSendObject[key] = value;
    }
    setRecepient(object:{email:string}){
        this.recipients.push(object);
    }
    setFieldText(name:string,code:string){
        this.mailTrapSendObject["text"] = `Dear ${name}, \n Your account verification code is ${code} \n Regards \n EduhubConnect Team. \n`
    }
    sendEmail(){
        this.sgmail
        .send(this.sendObject)
        .then((response:any) => {
            console.log(response)
            return response;
        
        })
        .catch((error) => {
            console.log(error.message)
           return error;
        })
    }
    sendMailTrap(){
        this.client
        .send(this.mailTrapSendObject)
        .then(console.log, console.error);
    }
    sendEmailVerification(email:string){     
        this.sendObject.email = email;
        return this.sendEmail()
    }


}
