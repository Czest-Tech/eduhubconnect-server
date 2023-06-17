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
    private blogsEndPoint = '/blog';
    private blogUpdateEndPoint = '/blog/:id';
    private blogsCategoryEndPoint = '/blog-categories';
    private blogsCategoryDeleteOrUpdateEndPoint = '/blog-categories/:id';
    private programsEndPoint = '/programs';
    private universitiesEndPoint = '/universities';
    private universityEndPoint = '/university/:id';
    private scholarshipsEndPoint = '/scholarships';


    
    private mainSite = new SiteContentService();
    constructor(){
     this.initialiseRoutes();
    }

    private initialiseRoutes(): void {    
        this.router.delete(`${this.path + this.blogUpdateEndPoint}`, this.deleteBlogs);
        this.router.delete(`${this.path + this.blogsCategoryDeleteOrUpdateEndPoint}`, this.deleteBlogCategory);
        this.router.patch(`${this.path + this.blogUpdateEndPoint}`, this.updateBlogs);
        this.router.patch(`${this.path + this.blogsCategoryDeleteOrUpdateEndPoint}`, this.updateBlogCategory);
        this.router.post(`${this.path + this.blogsEndPoint}`,[ this.upload.single('picture')], this.createBlogs);
        this.router.post(`${this.path + this.blogsCategoryEndPoint}`,[ this.upload.single('image')], this.createBlogCategory);
        this.router.get(`${this.path + this.blogsEndPoint}`, this.getBlogs);
        this.router.get(`${this.path + this.blogUpdateEndPoint}`, this.getBlogs);
        this.router.get(`${this.path + this.blogsCategoryEndPoint}`,this.getBlogCategory);
        this.router.get(`${this.path + this.programsEndPoint}`, this.getPrograms);
        this.router.get(`${this.path + this.universitiesEndPoint}`, this.getUniversities);
        this.router.get(`${this.path + this.universityEndPoint}`, this.getUniversity);
        this.router.get(`${this.path + this.scholarshipsEndPoint}`, this.getScholarships);
    }

    private getUniversities = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const universities = await this.mainSite.getUniversity(req)
            res.status(201).json(universities)
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getScholarships = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const scholarships = await this.mainSite.getScholarships(req)
            res.status(201).json(scholarships)
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getBlogs = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {id} = req.params;
            let blogs : any = [];
            if(id){
                 blogs = await this.mainSite.getSingleBlog({_id:new mongoose.Types.ObjectId(id as any) })
                 return res.status(201).json(blogs[0])
                } else {
                 blogs = await this.mainSite.getBlogs(req)
            }
         
            res.status(201).json({ blogs })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getPrograms = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const programs = await this.mainSite.getPrograms(req);
            res.status(201).json(programs)
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
    private deleteBlogs = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const blog = await this.mainSite.deleteBlog(id)
            res.status(201).json({ delete: true, blogs: blog })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private updateBlogs = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {id} = req.params;
            const blog =  await this.mainSite.updateBlog(req.body,id)
            res.status(201).json(blog)     
        } catch (error:any) {
            next(new HttpException(400,error.message))
        }
    }
    private deleteBlogCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const blogCategory = await this.mainSite.deleteBlogCategory(id)
            res.status(201).json({ delete: true, category: blogCategory })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private createBlogs = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {

            const { title } = req.body;
            const file = req.file as any; 
            if(file){
                const result = await uploadS3(file);
                await this.unlinkFile(file.path);
    
                req.body["thumbnail"] = result;
            }
           
            req.body["nameSlug"] = new HashKeys().slugify(title +"-ref-"+ new Date().getTime().toString())
              
            const blogs = await this.mainSite.createBlog(req.body)
            res.status(201).json(blogs)
            
        } catch (error: any) {
            next(new HttpException(201, error.message))
        }
    }
    private createBlogCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const file = req.file as any;
            const {name} = req.body; 

            if(file){
                const result = await uploadS3(file)
                await this.unlinkFile(file.path)
                req.body["images"] = result;
            }
           
            req.body["nameSlug"] = new HashKeys().slugify(name +"-ref-"+ new Date().getTime().toString())
            const category = await this.mainSite.createBlogCategory(req.body)

            res.status(201).json(category)
        } catch (error: any) {
            next(new HttpException(201, error.message))
        }
   
    }
    private getBlogCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const categories = await this.mainSite.getBlogCategory();
            res.status(201).json({ categories })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private updateBlogCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {id} = req.params;
            const category =  await this.mainSite.updateBlogCategory(req.body,id)
            res.status(201).json({category})     
        } catch (error:any) {
            next(new HttpException(400,error.message))
        }
    }
   
    private UnlinkMultipleDownload(files: any[]): void {
        files.forEach(async file => {
            await this.unlinkFile(file.path)
        })
    }

}
export default SiteContentController;
