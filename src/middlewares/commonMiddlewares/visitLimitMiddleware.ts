import {NextFunction, Request, Response} from "express";
import {STATUS_CODE} from "../../common/constant-status-code";
import {visitLimitService} from "../../servisces/visitLimitService";



export const visitLimitMiddleware = async (req:Request, res:Response, next:NextFunction)=>{

    const IP = req.headers['x-forwarded-for'] as string|| req.socket.remoteAddress as string
    const URL =  req.originalUrl
    const date=new Date()
    try {
        const isLimitTooMany = await visitLimitService.checkLimitVisits(IP,URL,date)


        if(isLimitTooMany){
            res.sendStatus(STATUS_CODE.TOO_MANY_REQUESTS_429)
            return
        } else { next()}

    }catch (error) {
        console.log('visitLimitMiddleware' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        return
    }
}