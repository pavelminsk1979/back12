import {NextFunction, Request, Response} from "express";
import {validationResult, ValidationError} from "express-validator";
import {STATUS_CODE} from "../../common/constant-status-code";


export const errorValidationBlogs = (req: Request, res: Response, next: NextFunction) => {

    const formatedErrors = validationResult(req)
        .formatWith((error: ValidationError) => ({
            message: error.msg,
            field: error.type === 'field' ? error.path : 'not found field'
        }))
    if (formatedErrors.isEmpty()) {
        next()
    } else {
        res.status(STATUS_CODE.BAD_REQUEST_400).json({errorsMessages: formatedErrors.array({onlyFirstError:true})})
    }
}