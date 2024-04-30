import {body} from "express-validator";


export const loginValidationUsers = body('login')
    .trim()
    .exists()
    .custom((value) => typeof value === 'string')
    .isLength({min: 3, max: 10})
    .matches('^[a-zA-Z0-9_-]*$')
    .withMessage('Incorrect login')
