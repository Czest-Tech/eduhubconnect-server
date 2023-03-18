import Controller from '../../utils/interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';
import { getFileStream } from '../../utils/uploadFiltersHandler';
import HttpException from '../../utils/exceptions/http.exception';
import fs from 'fs'
class UploadsController implements Controller {
    public router = Router();
    public path = "/uploads"
    private getFileKey = "/images/:key"

    constructor(){
        this.initialiseRoutes()
    }
    private initialiseRoutes():void {
        this.router.get(`${this.path + this.getFileKey}`, this.getUploadFiles);
    }

    private getUploadFiles = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
           
            const file = req.params.key;

            const result = await getFileStream(file)
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.setHeader('Cross-Origin-Embedder-Policy', 'cross-origin');

           result.pipe(res)
        } catch (error:any) {
            next(new HttpException(400, error.message))
        }
    }

}
export default UploadsController