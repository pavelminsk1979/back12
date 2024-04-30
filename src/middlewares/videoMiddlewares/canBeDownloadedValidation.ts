import {body} from "express-validator";


export const canBeDownloadedValidation =  body('canBeDownloaded').optional().custom((value) => typeof value === 'boolean').withMessage('boolean value')