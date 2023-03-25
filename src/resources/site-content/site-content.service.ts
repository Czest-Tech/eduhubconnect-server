import {ScholarshipsSchema,ProgramsSchema,UnivesitySchema,BlogsSchema} from "./site-content.model";
import mongoose, {FilterQuery,UpdateQuery} from "mongoose";
import { Blogs, Program, Scholarships, University } from "./site-content.interface";

export default class SiteContentService {
    private university = UnivesitySchema;
    private programs = ProgramsSchema;
    private scholarship = ScholarshipsSchema;
    private blogs =  BlogsSchema;
    

    public async searchPrograms(data: string): Promise<any> {
        try {
            const search = await this.programs.aggregate(
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

    public async getBlogs(query?: FilterQuery<Blogs>): Promise<any> {
        try {
            return query?  await this.blogs.find(query) : this.blogs.find();
        } catch (error: any) {
            throw new Error(error.message);

        }
    }
    public async getUniversity(query?: FilterQuery<University>): Promise<any> {
        try {
            return query?  await this.university.find(query) : this.university.find();
        } catch (error: any) {
            throw new Error(error.message);

        }
    }
    public async getPrograms(query?: FilterQuery<Program>): Promise<any> {
        try {
            return query?  await this.programs.find(query) : this.programs.find();
        } catch (error: any) {
            throw new Error(error.message);

        }
    }
    public async getScholarships(query?: FilterQuery<Scholarships>): Promise<any> {
        try {
            return query?  await this.scholarship.find(query) : this.scholarship.find();
        } catch (error: any) {
            throw new Error(error.message);

        }
    }
    public async getSingleBlog(query: FilterQuery<Blogs>): Promise<any> {
        try {
            const products: any = await this.blogs.aggregate([
                { $match: query }          
            ])
            
            return products;
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

    public async getSingleProgram(query: FilterQuery<Program>): Promise<any> {
        try {
            const products: any = await this.programs.aggregate([
                { $match: query }          
            ])
            
            return products;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async getSingleUnversity(query: FilterQuery<University>): Promise<any> {
        try {
            const products: any = await this.university.aggregate([
                { $match: query }          
            ])
            
            return products;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}