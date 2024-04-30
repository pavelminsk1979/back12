import {body} from "express-validator";




export const emailValidationUsers = body('email')
    .trim()
    .exists()
    .custom((value) => typeof value === 'string')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .withMessage('Incorrect email')