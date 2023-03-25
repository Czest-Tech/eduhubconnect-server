import jobsModel from "./jobs.model";
import Jobs from "./jobs.interface";
import mongoose, {FilterQuery,UpdateQuery} from "mongoose";

export default class JobsService {
    private jobs = jobsModel;
    
    public async create (body:any): Promise<Jobs> {
       try {   
          return await this.jobs.create( {...body});
       } catch (error:any) {
          throw new Error(error.message)
       }
    }

    
    public async update(body: UpdateQuery<any>, jobId: any): Promise<any> {
        try {
            return  await this.jobs.findOneAndUpdate({ _id:new mongoose.Types.ObjectId(jobId) }, { ...body }, { returnDocument: "after" });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async deleteJob(jobId: any): Promise<any> {
        try {
            return await this.jobs.deleteOne({ _id: new mongoose.Types.ObjectId(jobId) });
        } catch (error:any) {
            throw new Error(error.message);

        }
    }

    public async searchJobs(data: string): Promise<any> {
        try {
            const search = await this.jobs.aggregate(
                [{
                    $search: {
                        index: "default",
                        autocomplete: {
                            query: data,
                            path: "name",
                            fuzzy: {
                                maxEdits: 2
                            }
                        }
                    }
                }]
            );
            return search;
        } catch (error: any) {
            throw new Error(error.message);

        }
    }

    public async getJobs(query?: FilterQuery<Jobs>): Promise<any> {
        try {
            return query?  await this.jobs.find(query) : this.jobs.find();
        } catch (error: any) {
            throw new Error(error.message);

        }
    }
    public async getSingleJob(query: FilterQuery<Jobs>): Promise<any> {
        try {
            const products: any = await this.jobs.aggregate([
                { $match: query }          
            ])
            
            return products;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}