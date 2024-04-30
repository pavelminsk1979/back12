import {body} from "express-validator";
import {AvailableResolutions} from "../../db/db";



export const availableResolutionsValidation =     body('availableResolutions').optional().custom((value, {req}) => {
    if (Array.isArray(value)) {
        value.forEach(e => {
            if (!(e in AvailableResolutions)) {
                throw new Error('Incorrect availableResolutions');
            }
        })
    } else {
        req.body.availableResolutions = []
    }
}).withMessage('Incorrect availableResolutions')