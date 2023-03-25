import { Router, Request, Response, NextFunction} from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import JobsService from './site-content.service';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import util from 'util';
import { uploadS3, uploadMultipleS3, getFileStream, deleteMultipleS3 } from '../../utils/uploadFiltersHandler';
import HashKeys from '../../utils/hashKeys';
import HttpException from '../../utils/exceptions/http.exception';
import SiteContentService from './site-content.service';

class SiteContentController implements Controller {
    public router =  Router();
    private unlinkFile = util.promisify(fs.unlink);
    public path: string = '/main-site';
    private upload = multer({ dest: "./" });
    private blogsEndPoint = '/blogs';
    private programsEndPoint = '/programs';
    private universitiesEndPoint = '/universities';
    private universityEndPoint = '/university/:id';
    private scholarshipsEndPoint = '/scholarships';

    
    private mainSite = new SiteContentService();
    constructor(){
     this.initialiseRoutes();
    }

    private initialiseRoutes(): void {    
        this.router.get(`${this.path + this.blogsEndPoint}`, this.getBlogs);
        this.router.get(`${this.path + this.programsEndPoint}`, this.getPrograms);
        this.router.get(`${this.path + this.universitiesEndPoint}`, this.getUniversities);
        this.router.get(`${this.path + this.universityEndPoint}`, this.getUniversity);
        this.router.get(`${this.path + this.scholarshipsEndPoint}`, this.getScholarships);
    }

    private getUniversities = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const universities = await this.mainSite.getUniversity()
            res.status(201).json({ universities })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getScholarships = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const scholarships = await this.mainSite.getScholarships()
            res.status(201).json({ scholarships })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getBlogs = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const blogs = await this.mainSite.getBlogs()
            res.status(201).json({ blogs })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getPrograms = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const programs = await this.mainSite.getPrograms()
            res.status(201).json({ programs })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getUniversity = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const university = await this.mainSite.getUniversity({ _id: new mongoose.Types.ObjectId(id) })

            res.status(201).json({ university })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
   
    private UnlinkMultipleDownload(files: any[]): void {
        files.forEach(async file => {
            await this.unlinkFile(file.path)
        })
    }

}
export default SiteContentController;
