import {ScholarshipsSchema,ProgramsSchema,UnivesitySchema,BlogsSchema, BlogsCategoriesSchema} from "./site-content.model";
import mongoose, {FilterQuery,UpdateQuery} from "mongoose";
import { BlogCategory, Blogs, Program, Scholarships, University } from "./site-content.interface";

export default class SiteContentService {
    private university = UnivesitySchema;
    private programs = ProgramsSchema;
    private scholarship = ScholarshipsSchema;
    private blogs =  BlogsSchema;
    private blogCategory = BlogsCategoriesSchema;

    public async searchPrograms(data: string): Promise<any> {
        try {
            const program = await this.programs.aggregate(
                [
                    {
                        $search: {
                            index: "default",
                            text: {
                            query:  data,
                            path: {
                                wildcard: "*"
                            }
                            }
                        }
                    }
                ]
            );
            return program;
        } catch (error: any) {
            throw new Error(error.message);

        }
    }
    public async searchUniversity(data: string): Promise<any> {
        try {
            const search = await this.university.aggregate(
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
    public async searchScholarships(data: string): Promise<any> {
        try {
            const search = await this.scholarship.aggregate(
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

    public async getBlogs(limit:any = 20,skip:any = 0): Promise<any> {
        try {
            return  await this.blogs.aggregate([
                {
                    $lookup: {
                        from: "blogcategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "categoryName"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "postedBy",
                        foreignField: "_id",
                        as: "postedByName"
                    }
                },
                {
                    $set: {
                        categoryName: { $arrayElemAt: ["$categoryName.name", 0] },
                        postedByName: { 
                            $concat:[ 
                                { $arrayElemAt: ["$postedByName.firstName", 0] }," ",
                                { $arrayElemAt: ["$postedByName.lastName", 0] }
                            ]
                        }    
                    }
                }          
            ]).skip(skip).limit(limit).sort({"createdAt":-1});
        } catch (error: any) {
            throw new Error(error.message);

        }
    }
    public async getUniversity(req:any): Promise<any> {
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
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|regex|options)\b/g, (match) =>{
                
               return `$${match}`
            });
            
            let query = this.university.find(JSON.parse(queryStr));
        
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
               results = await this.university.countDocuments(JSON.parse(queryStr));
              if (page >= results) throw new Error("This Page does not exists");
            }
             const universities =  await query;
             return {universities,results,filterKeys}
        } catch (error: any) {
            throw new Error(error.message);

        }
    }
    public async getPrograms(req:any): Promise<any> {
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
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|regex|options)\b/g, (match) =>{
                
               return `$${match}`
            });
            
            let query = this.programs.find(JSON.parse(queryStr));
        
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
               results = await this.programs.countDocuments(JSON.parse(queryStr));
              if (page >= results) throw new Error("This Page does not exists");
            }
             const programs =  await query;
             return {programs,results,filterKeys}
            
          } catch (error:any) {
            throw new Error(error.message);
          }
        
           
    }
    protected textLike(str:string) {
        var escaped = str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        return new RegExp(escaped, 'i');
    }
    public async getScholarships(req:any): Promise<any> {
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
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|regex|options)\b/g, (match) =>{
                
               return `$${match}`
            });
            
            let query = this.scholarship.find(JSON.parse(queryStr));
        
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
               results = await this.scholarship.countDocuments(JSON.parse(queryStr));
              if (page >= results) throw new Error("This Page does not exists");
            }
             const scholarships =  await query;
             return {scholarships,results,filterKeys}
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async getSingleBlog(query: FilterQuery<Blogs>): Promise<any> {
        try {
            const blog: any = await this.blogs.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: "blogcategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "categoryName"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "postedBy",
                        foreignField: "_id",
                        as: "postedByName"
                    }
                },
                {
                    $set: {
                        categoryName: { $arrayElemAt: ["$categoryName.name", 0] },
                        postedByName: { 
                            $concat:[ 
                                { $arrayElemAt: ["$postedByName.firstName", 0] }," ",
                                { $arrayElemAt: ["$postedByName.lastName", 0] }
                            ]
                        }    
                    }
                }          
            ])
            
            return blog;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async getSingleScholarship(query: FilterQuery<Scholarships>): Promise<any> {
        try {
            const products: any = await this.scholarship.aggregate([
                { $match: query }          
            ])
            
            return products;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async getTotalCount(type:string) {
        if(type === 'program'){
          return await  this.programs.countDocuments();
        }
        return 0;
    }
    public async getSingleProgram(query: FilterQuery<Program>): Promise<any> {
        try {
            const program: any = await this.programs.aggregate([
                { $match: query }          
            ])
            
            return program;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async getSingleUnversity(query: FilterQuery<University>): Promise<any> {
        try {
            const unversity = await this.university.aggregate([
                { $match: query }          
            ])
            
            return unversity;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async createBlogCategory (body:any): Promise<any> {
        try {   
           return await this.blogCategory.create( {...body});
        } catch (error:any) {
           throw new Error(error.message)
        }
    }
    public async getBlogCategory (): Promise<any> {
        try {   
           return await this.blogCategory.find();
        } catch (error:any) {
           throw new Error(error.message)
        }
    }
    public async createBlog (body:any): Promise<any> {
        try {   
           return await this.blogs.create( {...body});
        } catch (error:any) {
           throw new Error(error.message)
        }
    }
    public async updateBlogCategory(body: UpdateQuery<any>, blogCategoryId: any): Promise<any> {
        try {
            return  await this.blogCategory.findOneAndUpdate({ _id:new mongoose.Types.ObjectId(blogCategoryId)}, { ...body }, { returnDocument: "after" });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }    
    public async deleteBlogCategory(blogCategoryId: any): Promise<any> {
        try {
            return await this.blogCategory.deleteOne({ _id: new mongoose.Types.ObjectId(blogCategoryId) });
        } catch (error:any) {
            throw new Error(error.message);

        }
    }
    public async create (body:any): Promise<any> {
        try {   
           return await this.blogs.create( {...body});
        } catch (error:any) {
           throw new Error(error.message)
        }
    }
    public async deleteBlog(blogId: any): Promise<any> {
        try {
            return await this.blogs.deleteOne({ _id: new mongoose.Types.ObjectId(blogId) });
        } catch (error:any) {
            throw new Error(error.message);

        }
    }
    public async updateBlog(body: UpdateQuery<any>, blogId: any): Promise<any> {
        try {
            return  await this.blogs.findOneAndUpdate({ _id:new mongoose.Types.ObjectId(blogId) }, { ...body }, { returnDocument: "after" });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}