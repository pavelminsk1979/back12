import {body} from "express-validator";


export const authorValidation = body('author').trim().isString().isLength({min: 1, max: 20}).withMessage('Incorrect author')