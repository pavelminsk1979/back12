
import {body} from "express-validator";


export const titleValidationPosts = body('title')
    .exists()
    .trim()
    .custom((value) => typeof value === 'string')
    .isLength({min:1, max: 30})
    .withMessage('Incorrect title')