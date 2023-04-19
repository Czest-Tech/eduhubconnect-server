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

    public async getJobs(req?:any): Promise<any> {
        try {

            let uiValues:any = {
                filtering: {},
                sorting: {},
            } as any;

            const queryObj = { ...req.query } as any;
            const excludeFields = ["page", "sort", "limit", "fields"];
            excludeFields.forEach((el) => {
                delete queryObj[el]
            });
            for(let el in queryObj ) {
                if(typeof queryObj[el] === "object") {
                    if( Object.keys(queryObj[el])[0] === "regex"){
                        if(queryObj[el][Object.keys(queryObj[el])[0]] === ""){
                            delete queryObj[el];
                        } else {
                            // queryObj[el]["regex"] = `/${queryObj[el][Object.keys(queryObj[el])[0]]}/`
                            queryObj[el]["options"] = 'i';
                        }
                    }
                }

            }
            let queryStr = JSON.stringify(queryObj);
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|regex|options|match)\b/g, (match) =>{
                
               return `$${match}`
            });
            
            let query = this.jobs.find(JSON.parse(queryStr));
        
            // Sorting
        
            if (req.query.sort) {
              const sortBy = req.query.sort.split(",").join(" ");
              query = query.sort(sortBy);
            } else {
              query = query.sort("-createdAt");
            }
        
            // limiting the fields
        
            if (req.query.fields) {
              const fields = req.query.fields.split(",").join(" ");
              query = query.select(fields);
            } else {
              query = query.select("-__v");
            }

            const filterKeys = Object.keys(queryObj);
            const filterValues = Object.values(queryObj);

            filterKeys.forEach(
                (val, idx) => (uiValues.filtering[val] = filterValues[idx])
            );
        
            // pagination
            let results;

            const page = req.query.page;
            const limit = req.query.limit;
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
            if (req.query.page) {
               results = await this.jobs.countDocuments(JSON.parse(queryStr));
              if (page >= results) throw new Error("This Page does not exists");
            }
             const jobs =  await query;
             return {jobs,results,filterKeys}
            
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async getSingleJob(query: FilterQuery<Jobs>): Promise<any> {
        try {
            const job: any = await this.jobs.aggregate([
                { $match: query }          
            ])
            
            return job;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}