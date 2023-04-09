import { User } from '../user/user.interface';
import { Document } from 'mongoose';


export interface Scholarships extends Document { 
    id: number;
    title: string;
    main_image: string;
    university: string;
    department: string;
    language:  string;
    degree:  string;
    duration:  string;
    tuition_fees:  string;
    discounted_fees:  string;
    description:  string;
    requirement:  string;
    discipline:  string;
    location:  string;
    remember_token: string;
    created_at:  string;
    updated_at:  string;
    university_id: string;
    country_id: string;
    application_link:  string;
    external_links:  string;
    scholarship_percentage: string;
    currency:  string;
    start_date:  string;
    end_date:  string;
    isActive:  boolean;
    deleted:  boolean;
    city:  string;
    permalink:  string;
    sponsor:  string;
    image_link: string;
    deadline:  string;
    eligibility:  string;  
}

export interface Program extends Document { 
    main_image: string;
    university: string;
    department:  string;
    language:  string;
    degree:  string;
    duration:  string;
    tuition_fees: string;
    discounted_fees:  string;
    description:  string;
    requirement:  string;
    discipline:  string;
    location:  string;
    remember_token:  string;
    created_at:  string;
    updated_at:  string;
    university_id:  string;
    programs:  string; 
}
export interface University extends Document {
    main_image:  string;
    university_logo:  string;
    description:  string;
    title:  string;
    university: string;
    location:  string;
    university_type:  string;
    foundation:  string;
    total_students:  string;
    created_at:  string;
    updated_at:  string;
    university_name_slug:  string;
    country_id:  string;
    city:  string;
    phone_number:  string;
    email:  string;
    website:  string;
    programs:  string;
}
export interface Blogs extends Document {
    title: string;
    content: string;
    description: string;
    published:boolean;
    category: BlogCategory["_id"];
    thumbnail: Array<any>;
    view:number;
    shared: number;
    nameSlug:string;
    tags: string;
    postedBy:User["_id"];
}
export interface BlogCategory extends Document { 
    name: string;
    images: Array<any>;
}