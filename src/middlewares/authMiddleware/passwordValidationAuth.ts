import {body} from "express-validator";




export const passwordValidationAuth = body('password')
    .trim()
    .notEmpty()
    .exists()
    .custom((value) => typeof value === 'string')
    .withMessage('Incorrect password')