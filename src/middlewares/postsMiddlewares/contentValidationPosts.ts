
import {body} from "express-validator";


export const contentValidationPosts = body('content')
    .exists()
    .trim()
    .custom((value) => typeof value === 'string')
    .isLength({min:1, max: 1000})
    .withMessage('Incorrect content')