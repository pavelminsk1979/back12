import {body} from "express-validator";



export const descriptionValidationBlogs = body('description')
    .exists()
    .trim()
    .custom((value) => typeof value === 'string')
    .isLength({min: 1, max: 500})
    .withMessage('Incorrect description')