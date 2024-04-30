
import {body} from "express-validator";


export const shortDescriptionValidationPosts = body('shortDescription')
    .exists()
    .trim()
    .custom((value) => typeof value === 'string')
    .isLength({min:1, max: 100})
    .withMessage('Incorrect shortDescription')