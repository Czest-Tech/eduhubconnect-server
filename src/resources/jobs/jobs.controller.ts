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
    private unlinkFile = util.promisify(fs.unlink);
    public path: string = 'jobs';
    private upload = multer({ dest: "./" });
    private createJobsEndPoint = '/create';
    private updateJobsEndPoint = '/update';
    private deleteJobsEndPoint = '/delete/:jobId';
    private getAllJobsEndPoint = '/get-all';
    private getOneJobsEndPoint = '/get-single/:jobId';
    private getNearJobsEndPoint = '/get-near-me';
    private searchProduct = '/search'
    private getRecommendedJobsEndPoint = '/get-recommended';
    private getShopJobsEndPoint = '/get-shop-jobs/:shopId'
    private getPromotedJobsEndPoint = '/get-promoted';
    private getRelateJobsEndPoint = '/get-related';
    
    jobsService = new JobsService();
    constructor(){
     this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(`${this.path + this.createJobsEndPoint}`, [this.upload?.array("images")], this.create);
        this.router.post(`${this.path + this.updateJobsEndPoint}`, [this.upload?.array("updateImages")], this.update);
        this.router.post(`${this.path + this.getAllJobsEndPoint}`, this.getAllJobs);
        this.router.post(`${this.path + this.searchProduct}`, this.searchJobs);
        this.router.get(`${this.path + this.getShopJobsEndPoint}`, this.getCompanyJobs);
        this.router.get(`${this.path + this.getOneJobsEndPoint}`, this.getJob);
        this.router.delete(`${this.path + this.deleteJobsEndPoint}`, this.deleteJob);


    }
    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { userId,name} = req.body;
            const file = req.files as any;

            const result = file ? await uploadMultipleS3(file) : []
       
            req.body["nameSlug"] = new HashKeys().slugify(name +"-ref-"+ new Date().getTime().toString())
            
            req.body["attachments"] = result;
            const jobs = await this.jobsService.create(req.body)

            res.status(201).json({ jobs })
        } catch (error: any) {
            next(new HttpException(201, error.message))
        }
    }
    private update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const file = req.files as any[];
            const filterImages: any[] = [];
            var result:any;
            const { imagesToDelete, jobId } = req.body;
            JSON.parse(imagesToDelete)
            var imagesToRemove: any[] = [];
            if (imagesToDelete) {
                if (typeof imagesToDelete == "string") {
                    imagesToRemove = imagesToDelete.split(',');
                } else if (typeof imagesToDelete == "object") {
                    imagesToRemove = imagesToDelete;
                }
            }

            if (imagesToRemove.length !== 0) {
                await deleteMultipleS3(imagesToRemove as unknown as Array<any>);
            }
            if (file) {
                result = await uploadMultipleS3(file)
            }

            const { attachments } = await this.jobsService.getSingleJob({ _id: new mongoose.Types.ObjectId(jobId) })
            attachments.forEach((element: any) => {
                if (!imagesToDelete.includes(element.key)) {
                    filterImages.push(element)
                }
            });
            this.UnlinkMultipleDownload(file)
            if(filterImages || result ){
                req.body["attachments"] = [...filterImages, ...result ];

            }
            const product = await this.jobsService.update(req.body, jobId)

            res.status(201).json({ product })
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
            res.status(201).json({ jobs })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getAllJobs = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            // this.updateNAmeSlugs()
            const { userId } = req.body
            const jobs = await this.jobsService.getJobs()

            res.status(201).json({ jobs })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getJob = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { jobId } = req.params;
            const product = await this.jobsService.getSingleJob({ _id: new mongoose.Types.ObjectId(jobId) })

            res.status(201).json({ product })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private getCompanyJobs = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { companyId } = req.params;
            const jobs = await this.jobsService.getJobs({ postedBy: new mongoose.Types.ObjectId(companyId) })

            res.status(201).json({ jobs })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { jobId } = req.params;
            console.log(req.params)
            const product = await this.jobsService.deleteJob(jobId)
            res.status(201).json({ delete: true, product: product })
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
