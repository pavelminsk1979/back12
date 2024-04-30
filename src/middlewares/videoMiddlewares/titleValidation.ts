import {body} from "express-validator";


export const titleValidation = body('title').trim().isString().isLength({min: 1, max: 40}).withMessage('Incorrect title')