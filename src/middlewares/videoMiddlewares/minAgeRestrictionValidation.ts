import {body} from "express-validator";


export const minAgeRestrictionValidation = body('minAgeRestriction').optional().trim().isLength({
    min: 1,
    max: 18
}).withMessage('min1,max 18')