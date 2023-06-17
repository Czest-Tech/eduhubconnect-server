import { ApplicationSchema, JobSchema } from "./jobs.model";
import { Jobs,Applications } from "./jobs.interface";
import mongoose, {FilterQuery,UpdateQuery} from "mongoose";

export default class JobsService {
    private jobs = JobSchema;
    private applications = ApplicationSchema;
    
    public async create (body:any): Promise<Jobs> {
       try {   
          return await this.jobs.create( {...body});
       } catch (error:any) {
          throw new Error(error.message)
       }
    }
    public async apply (body:any): Promise<Applications> {
        try {   
            console.log(body)
           return await this.applications.create({...body});
        } catch (error:any) {
           throw new Error(error.message)
        }
    }
    public async findApplication (query:any): Promise<any> {
        try {   
            const data = await this.applications.find(query);
           return data 
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

    public async getJobs(req?: any): Promise<any> {
        try {
          let uiValues: any = {
            filtering: {},
            sorting: {},
          } as any;
      
          const queryObj = { ...req.query } as any;
          const excludeFields = ["page", "sort", "limit", "fields"];
          excludeFields.forEach((el) => {
            delete queryObj[el];
          });
          for (let el in queryObj) {
            if (typeof queryObj[el] === "object") {
              if (Object.keys(queryObj[el])[0] === "regex") {
                if (queryObj[el][Object.keys(queryObj[el])[0]] === "") {
                  delete queryObj[el];
                } else {
                  queryObj[el]["options"] = "i";
                }
              }
            }
          }
          let queryStr = JSON.stringify(queryObj);
          queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt|in|regex|options|match)\b/g,
            (match) => {
              return `$${match}`;
            }
          );
      
          let pipeline = [];
      
          // Add $match stage to pipeline
          pipeline.push({ $match: JSON.parse(queryStr) });
      
          // Add $lookup stage to pipeline
          pipeline.push({
            $lookup: {
              from: "applications",
              localField: "_id",
              foreignField: "jobId",
              as: "applicantData",
            },
          });
      
          // Add $project stage to pipeline
          pipeline.push({
            $set: {
              applicantCount: { $size: "$applicantData"},
              applicationId:{
                $ifNull: [
                  { $map: { input: "$applicantData", as: "data", in: "$$data.applicationId" } },
                  []
                ]
              }        
            }
          });
      
          // Add $sort stage to pipeline
          if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            pipeline.push({ $sort: sortBy });
          } else {
            pipeline.push({ $sort: { createdAt: -1 } });
          }
      
          // Add $project stage to pipeline to limit fields
          if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            pipeline.push({ $project: fields });
          } else {
            pipeline.push({ $project: { __v: 0 } });
          }
      
          // Add $skip and $limit stages to pipeline
          if (req.query.page) {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const skip = (page - 1) * limit;
            pipeline.push({ $skip: skip }, { $limit: limit });
          }
      
          const jobs = await this.jobs.aggregate(pipeline);
      
          const filterKeys = Object.keys(queryObj);
          const filterValues = Object.values(queryObj);
      
          filterKeys.forEach(
            (val, idx) => (uiValues.filtering[val] = filterValues[idx])
          );
      
          // Get the total count of documents that match the query
          const results = await this.jobs.countDocuments(JSON.parse(queryStr));
      
          return { jobs, results, filterKeys };
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