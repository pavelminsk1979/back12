import {body} from "express-validator";



export const contentValidationComments = body('content')
    .exists()
    .trim()
    .custom((value) => typeof value === 'string')
    .isLength({min:20, max: 300})
    .withMessage('Incorrect content for comment')