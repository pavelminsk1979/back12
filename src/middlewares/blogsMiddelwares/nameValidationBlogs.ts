import {body} from "express-validator";


export const nameValidationBlogs = body('name')
    .trim()
    .exists()
    .custom((value) => typeof value === 'string')
    .isLength({min: 1, max: 15})
    .withMessage('Incorrect name')
