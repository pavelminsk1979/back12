import {NextFunction, Request, Response} from "express";
import { validationResult} from "express-validator";
import {STATUS_CODE} from "../../common/constant-status-code";


type ErrorsMessage = {
    msg: string,
    type: string,
    value: string,
    path: string,
    location: string,
}
type ErrorType = { errors: ErrorsMessage[] }

export const errorValidation = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(STATUS_CODE.BAD_REQUEST_400).json({errors: errors.array()})
    } else {
        next()
    }
}