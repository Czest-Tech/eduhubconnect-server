import { Schema , model } from "mongoose";
import {University,Program, Scholarships, Blogs, BlogCategory } from "./site-content.interface";

const scholarshipsSchema = new Schema (
    {

        id: {type: Number, required: false},
        title: {type: String, required: false},
        main_image: {type: String, required: false},
        university: {type: String, required: false},
        department: {type: String, required: false},
        language:  {type: String, required: false},
        degree:  {type: String, required: false},
        duration:  {type: String, required: false},
        tuition_fees:  {type: String, required: false},
        discounted_fees:  {type: String, required: false},
        description:  {type: String, required: false},
        requirement:  {type: String, required: false},
        discipline:  {type: String, required: false},
        location:  {type: String, required: false},
        remember_token: {type: String, required: false},
        created_at:  {type: String, required: false},
        updated_at:  {type: String, required: false},
        university_id: {type: String, required: false},
        country_id: {type: String, required: false},
        application_link:  {type: String, required: false},
        external_links:  {type: String, required: false},
        scholarship_percentage: {type: String, required: false},
        currency:  {type: String, required: false},
        start_date:  {type: String, required: false},
        end_date:  {type: String, required: false},
        isActive:  {type: String, required: false},
        deleted:  {type: String, required: false},
        city:  {type: String, required: false},
        permalink:  {type: String, required: false},
        sponsor:  {type: String, required: false},
        image_link: {type: String, required: false},
        deadline:  {type: String, required: false},
        eligibility:  {type: String, required: false},  
    },
    {timestamps:true}
);
const programsSchema = new Schema ({
    main_image: {type: String, required: false},
    university: {type: String, required: false},
    department:  {type: String, required: false},
    language:  {type: String, required: false},
    degree:  {type: String, required: false},
    duration:  {type: String, required: false},
    tuition_fees: {type: String, required: false},
    discounted_fees:  {type: String, required: false},
    description:  {type: String, required: false},
    requirement:  {type: String, required: false},
    discipline:  {type: String, required: false},
    location:  {type: String, required: false},
    remember_token:  {type: String, required: false},
    created_at:  {type: String, required: false},
    updated_at:  {type: String, required: false},
    university_id:  {type: String, required: false},
    programs:  {type: String, required: false}
})
const universitySchema = new Schema({
    main_image:  {type: String, required: false},
    university_logo:  {type: String, required: false},
    description:  {type: String, required: false},
    title:  {type: String, required: false},
    university: {type: String, required: false},
    location:  {type: String, required: false},
    university_type:  {type: String, required: false},
    foundation:  {type: String, required: false},
    total_students:  {type: String, required: false},
    created_at:  {type: String, required: false},
    updated_at:  {type: String, required: false},
    university_name_slug:  {type: String, required: false},
    country_id:  {type: String, required: false},
    city:  {type: String, required: false},
    phone_number:  {type: String, required: false},
    email:  {type: String, required: false},
    website:  {type: String, required: false},
    programs:  {type: String, required: false}
});
const blogsSchema = new Schema({
    title: {type: String, required: false},
    content: {type: String, required: false},
    description: {type: String, required: false},
    posted:{type: String, required: false},
    category: {type: String, required: false},
    thumbnail: {type: String, required: false},
    view:{type: Number, required: false},
    shared: {type: Number, required: false},
    tags: {type: String, required: false},
    created_at: {type: Number, required: false},
    created_by: {type: Number, required: false},
    postedBy: {
        type:Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    nameSlug:{type:String, required: false}
});
const blogCategorySchema = new Schema({
    name: {type: String, required: true},
    images: {type: Array, required: false}

});
export const ScholarshipsSchema = model<Scholarships>('Scholarships', scholarshipsSchema);
export const ProgramsSchema = model<Program>('Programs', programsSchema);
export const UnivesitySchema = model<University>('Universities', universitySchema);
export const BlogsSchema = model<Blogs>('Blogs', blogsSchema);
export const BlogsCategoriesSchema = model<BlogCategory>('blogCategories', blogCategorySchema);