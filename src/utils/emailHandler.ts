import { MailService } from '@sendgrid/mail/src/mail';
import  sgMail from '@sendgrid/mail'
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
    constructor( sendObject?: SendObject){
        this.sgmail.setApiKey(process.env.SENDGRID_API_KEY || '');
        
        this.sendObject = sendObject
        this.sendObject.headers = {"Content-Encoding":"--data-binary '@data.json.gz'"}
        this.sendObject.templateId = process.env.EMAIL_VERIFICATION_TEMPLATE_KEY;
    }

    setFieldName(key:{to:string, from:string,subject:String,text:string,html:string} | any, value:string){
        this.sendObject[key] = value;
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
    sendEmailVerification(email:string){
        
        this.sendObject.email = email;
        // let comfirmText = `Hello ${username} \n <br> Welcome to Mabine, `
        return this.sendEmail()

    }


}
