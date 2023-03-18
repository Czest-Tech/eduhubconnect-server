import { Document } from "mongoose";

export default interface AuthInterface extends Document {
    email:string;
    password:string;
}