import { FilterQuery, UpdateQuery } from "mongoose";
import userModel from "../user/user.model";
import {Session, SessionCreate} from "./session.interface";
import sessionModel from "./session.model";


class SessionHandler {
    


    async CreateSession(userId:string, userAgent: string):Promise<any>{
        const session =  await sessionModel.updateOne({user:userId}, {$setOnInsert:{ userAgent: userAgent,user:userId}},{upsert: true});
        return session;
    }
    
    async CreateNewSession(data: any):Promise<any>{
        const session =  await sessionModel.create(data);
        return session;
    }

    async FindSessions(query:FilterQuery<Session>):Promise<any> {
        const findSession = await sessionModel.aggregate([
            {$match: query},
            {$lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userData"
            }},
            {$lookup: {
                from: "usersettings",
                localField: "user",
                foreignField: "userId",
                as: "UserSettings"
            }}
        ]).exec();
        return findSession;
    }

    async UpdateSession(query:FilterQuery<Session>, update:UpdateQuery<Session>): Promise<object> {
       const updateSession = sessionModel.updateOne(query,update);
       return updateSession;
    }

}
export default SessionHandler