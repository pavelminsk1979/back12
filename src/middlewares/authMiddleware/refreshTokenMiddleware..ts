import {NextFunction, Response} from "express";
import {STATUS_CODE} from "../../common/constant-status-code";
import {authService} from "../../servisces/auth-service";


export const refreshTokenMiddleware = async (req: any, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return res.send(STATUS_CODE.UNAUTHORIZED_401)
    }

    const dataUser = await authService.checkAccessToken(req.headers.authorization)

    if(!dataUser){
        return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
    } else {
        req.userIdLoginEmail = dataUser
        return next()
    }
}



