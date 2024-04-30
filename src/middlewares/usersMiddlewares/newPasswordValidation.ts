import {body} from "express-validator";




export const newPasswordValidation = body('newPassword')
    .trim()
    .exists()
    .custom((value) => typeof value === 'string')
    .isLength({min: 6, max: 20})
    .withMessage('Incorrect newPassword')