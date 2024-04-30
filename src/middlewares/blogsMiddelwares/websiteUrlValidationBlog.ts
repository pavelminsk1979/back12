import {body} from "express-validator";



export const websiteUrlValidationBlog = body('websiteUrl')
    .trim()
    .exists()
    .custom((value) => typeof value === 'string')
    .isLength({ max: 100})
    .matches( '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Incorrect websiteUrl')