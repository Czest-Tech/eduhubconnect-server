import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptions/http.exception';
import validationMiddleware from '../../middleware/validation.middleware'
import validate from './messages.validate'
import MessagesService from './messages.service';
import unsetSession from '../../middleware/unsetSession.middleware';
import requireUser from '../../middleware/requireUser.middleware';
import multer from 'multer';
import fs from 'fs';
import util from 'util';
import { uploadS3, getFileStream } from '../../utils/uploadFiltersHandler';



class MessagesController implements Controller {
    public router = Router();
    public path = '/messages';
    private createMessagesEndPoint = '/send';
    private updateMessagesEndPoint = '/update/:messageId';
    private deleteMessagesEndPoint = '/delete/:messageId';
    private getAllMessagesEndPoint = '/get-all';
    private getOneMessagesEndPoint = '/get-single/:messageId';
    private getUserMessagesEndPoint = '/get-user-messages/:userId';
    private getUserConversationEndPoint = '/get-user-conversation/:receiverId/:myId';
    private uploadFileTest = '/upload-test';
    private getUploadFileTest = '/upload-test/:key';
    private unlinkFile = util.promisify(fs.unlink);
    private upload  =  multer({ dest: './'});
    private messagesService = new MessagesService()
    constructor() {
        this.initialiseRoutes()
    }

    private initialiseRoutes(): void {
        this.router.post(`${this.path + this.createMessagesEndPoint}`, this.create);
        this.router.put(`${this.path + this.updateMessagesEndPoint}`, validationMiddleware(validate.create), this.update);
        this.router.get(`${this.path + this.getAllMessagesEndPoint}`, this.getAllMessages);
        this.router.get(`${this.path + this.getUserConversationEndPoint}`, this.getUserConversation);
        this.router.get(`${this.path + this.getOneMessagesEndPoint}`, this.getSingleMessage);
        this.router.get(`${this.path + this.getUserMessagesEndPoint}`, this.getUserMessage);
        this.router.delete(`${this.path + this.deleteMessagesEndPoint}`, this.deleteMessage);
        this.router.get(`${this.path + this.getUploadFileTest}`, this.getUploadFiles);
        this.router.post(`${this.path + this.uploadFileTest}`, this.upload.single('image'), this.uploadFiles)


    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { userId } = req.body;
            // const maxMessageCreated =  await this.messagesService.findMessageByOwnerId(userId)
            // if(maxMessageCreated){
            //     return res.status(201).json({status:400,error: true,error_code: 3, message: "this user has an existing message already"})
            // }
            const chats = await this.messagesService.create(req.body)

            res.status(201).json({ chats })
        } catch (error: any) {
            console.log(error)
            next(new HttpException(400, error.message))
        }
    }
    private update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { messageId } = req.params;
            const message = await this.messagesService.update(req.body, messageId)

            res.status(201).json({ message })
        } catch (error) {
            next(new HttpException(400, 'can not send post'))
        }
    }
    private uploadFiles = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
           
            const file = req.file as any;

            // // apply filter
            // // resize 

            const result = await uploadS3(file)
            await this.unlinkFile(file.path)
            console.log(result)

            res.send({ imagePath: `uploads/${result.Key}` })
        } catch (error:any) {
            next(new HttpException(400, error.message))
        }
    }
    private getUploadFiles = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
           
            const file = req.params.key;

            // // apply filter
            // // resize 

            const result = await getFileStream(file)
         
           result.pipe(res)
        } catch (error:any) {
            next(new HttpException(400, error.message))
        }
    }
    private getAllMessages = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            //const { query } = req.body.query
            const Messages = await this.messagesService.getAllMessages()


            res.status(201).json({ Messages })
        } catch (error) {
            next(new HttpException(400, 'can not get Messages'))
        }
    }
    private getSingleMessage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { messageId } = req.params;
            const message = await this.messagesService.getSingleMessage(messageId)

            res.status(201).json({ message })
        } catch (error) {
            next(new HttpException(400, 'can not send post'))
        }
    }

    private getUserMessage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { userId } = req.params;

            const chats = await this.messagesService.findUserMessages(userId)

            res.status(201).json({ chats })
        } catch (error:any) {
            next(new HttpException(error.status, error.message))
        }
    }
    private deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { messageId } = req.params;
            const message = await this.messagesService.deleteMessage(messageId)
            res.status(201).json({ delete: true, message: message })
        } catch (error) {
            next(new HttpException(400, 'can not send post'))
        }
    }

    private getUserConversation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

       
        try{

            const { receiverId,myId } = req.params;
            const chats = await this.messagesService.findUserConversation(receiverId,myId )
            res.status(201).json({ chats })
        } catch (error:any){
            next(new HttpException(error.status, error.message))
        }
    }

}
export default MessagesController;