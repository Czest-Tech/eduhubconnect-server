import { Router, Request, Response, NextFunction} from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import JobsService from './jobs.service';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import util from 'util';
import { uploadS3, uploadMultipleS3, getFileStream, deleteMultipleS3 } from '../../utils/uploadFiltersHandler';
import HashKeys from '../../utils/hashKeys';
import HttpException from '../../utils/exceptions/http.exception';

class JobsController implements Controller {
    public router =  Router();
    public path: string = '/jobs';
    private unlinkFile = util.promisify(fs.unlink);
    private upload = multer({ dest: "./" });
    private createJobsEndPoint = '/create';
    private updateJobsEndPoint = '/update';
    private deleteJobsEndPoint = '/delete/:jobId';
    private getAllJobsEndPoint = '/get-all';
    private getOneJobsEndPoint = '/get-single/:jobId';
    private getNearJobsEndPoint = '/get-near-me';
    private searchProduct = '/search'
    private getRecommendedJobsEndPoint = '/get-recommended';
    private getShopJobsEndPoint = '/get-company-jobs'
    private getPromotedJobsEndPoint = '/get-promoted';
    private getRelateJobsEndPoint = '/get-related';
    
    jobsService = new JobsService();
    constructor(){
     this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(`${this.path + this.createJobsEndPoint}`, [this.upload?.array("images")], this.create);
        this.router.patch(`${this.path + this.updateJobsEndPoint}`, [this.upload?.array("images")], this.update);
        this.router.put(`${this.path + this.updateJobsEndPoint}`, [this.upload?.array("images")], this.update);
        this.router.get(`${this.path + this.getAllJobsEndPoint}`, this.getAllJobs);
        this.router.post(`${this.path + this.searchProduct}`, this.searchJobs);
        this.router.get(`${this.path + this.getShopJobsEndPoint}`, this.getCompanyJobs);
        this.router.get(`${this.path + this.getOneJobsEndPoint}`, this.getJob);
        this.router.delete(`${this.path + this.deleteJobsEndPoint}`, this.deleteJob);
    }
    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { name} = req.body;
           
            const file = req.files as any;
            if(file){
                const result = file ? await uploadMultipleS3(file) : []
                await this.unlinkFile(file.path)
                req.body["attachments"] = result;
            }
            req.body["nameSlug"] = new HashKeys().slugify(name +"-ref-"+ new Date().getTime().toString())
            
    
            const jobs = await this.jobsService.create(req.body)

            res.status(201).json(jobs)
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }
    private update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const file = req.files as any[];
            const filterImages: any[] = [];
            var result:any;
            const { imagesToDelete, jobId } = req.body;
          
         
            if (file) {
                result = await uploadMultipleS3(file) 
                  if (imagesToDelete.length !== 0) {
                    await deleteMultipleS3(imagesToDelete as unknown as Array<any>);
                }
            

            const data = await this.jobsService.getSingleJob({ _id: new mongoose.Types.ObjectId(jobId) })
            data[0].attachments.forEach((element: any) => {
                if (!imagesToDelete.includes(element.key)) {
                    filterImages.push(element)
                }
            });
            this.UnlinkMultipleDownload(file)
            if(filterImages || result ){
                const combinedImages = [...filterImages, ...result ];
                req.body["attachments"] = combinedImages;
            }}
            const jobs = await this.jobsService.update(req.body, jobId)

            res.status(201).json(jobs)
        } catch (error: any) {
            if (error instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(error)
              } else if (error) {
                // An unknown error occurred when uploading.
                console.log(error)

              }
            next(new HttpException(error.status, error.message))
        }
    }
    private searchJobs = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { query } = req.body;
            const jobs = await this.jobsService.searchJobs(query)
            res.status(201).json(jobs)
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getAllJobs = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const jobs = await this.jobsService.getJobs(req)

            res.status(201).json(jobs)
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getJob = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {

            const { jobId } = req.params;
            const job = await this.jobsService.getSingleJob({ _id: new mongoose.Types.ObjectId(jobId) })

            res.status(201).json(job[0])
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getCompanyJobs = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const jobs = await this.jobsService.getJobs(req)

            res.status(201).json(jobs)
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { jobId } = req.params;
            const job = await this.jobsService.deleteJob(jobId)
            res.status(201).json({ delete: true, job })
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
export default JobsController;
