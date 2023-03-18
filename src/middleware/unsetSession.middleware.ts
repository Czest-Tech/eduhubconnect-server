import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import HashKeys from "../utils/hashKeys";
import SessionController from "../resources/sessions/session.controller";

const unsetSession = async (req:Request,res:Response,next:NextFunction) => {

    const haskKeys = new HashKeys();
    const sessionHandler = new SessionController()
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/,"");

    const refreshToken: string = get(req, "headers.x-refresh") as string;
    if(!accessToken){
        return next();
    }

    const { decoded,expired } =await  haskKeys.verifyJwt(accessToken, "accessTokenPrivateKey");
    if(decoded){
        res.locals.user = decoded;
        return next();
    }

    if(expired && refreshToken){
        const newAccessToken = await sessionHandler.reIssueToken({refreshToken})

        
        if (newAccessToken) {
            res.setHeader("x-access-token", newAccessToken);
        }
    
        const result = await haskKeys.verifyJwt(newAccessToken as string, "accessTokenPrivateKey");

        res.locals.user = result.decoded;
        return next();
    }

    return  next();

}
export default unsetSession;