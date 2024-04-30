import {NextFunction,Response,Request} from "express";
import {STATUS_CODE} from "../../common/constant-status-code";



export const authMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    if(req.headers['authorization']==='Basic YWRtaW46cXdlcnR5'){
        next()
    } else {res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)}
}

