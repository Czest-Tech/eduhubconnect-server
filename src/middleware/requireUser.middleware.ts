import { Response, Request, NextFunction } from "express";

const requireUser = (req:Request, res:Response, next: NextFunction) => {
    const user = res.locals.user;
    console.log(res.locals)
    if(!user){
        return res.status(403).json({status:403,error:true,error_code:5, message:"session expired, please login again"})
    }

    return next();

}

export default requireUser;