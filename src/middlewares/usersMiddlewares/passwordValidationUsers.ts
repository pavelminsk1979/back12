import {body} from "express-validator";




export const passwordValidationUsers = body('password')
    .trim()
    .exists()
    .custom((value) => typeof value === 'string')
    .isLength({min: 6, max: 20})
    .withMessage('Incorrect password')