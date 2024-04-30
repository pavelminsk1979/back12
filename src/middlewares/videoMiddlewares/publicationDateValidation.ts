import {body} from "express-validator";


export const publicationDateValidation =   body('publicationDate').optional().custom((value) => typeof value === 'string').withMessage('Date value, type string')