import { Document } from "mongoose";
import { User } from "../user/user.interface";


interface SessionBase extends Document {
        user: User["_id"];
        userAgent: string;
}
 interface Session extends SessionBase, Document {

    accessToken?:String;
    refreshToken?:String;
    valid: boolean; 
    createdAt: Date;
    updatedAt: Date;

}

interface SessionCreate extends SessionBase, Document {
    password:string
}

export {Session, SessionCreate  }