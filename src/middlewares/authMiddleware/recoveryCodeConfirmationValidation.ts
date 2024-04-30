import {body} from "express-validator";
import {usersRepository} from "../../repositories/users/users-repository";


let user: any;
const findCode = async (value: string) => {
    user = await usersRepository.findUserByConfirmationCode(value)
    if (user) return true
    return false
}

const checkValidDate = () => {
    if (user.emailConfirmation.expirationDate < new Date()) return false
    return true
}
export const recoveryCodeConfirmationValidation = body('recoveryCode')
    .trim()
    .exists()
    .custom(async (value) => {

        const isExistCodeInDB = await findCode(value)
        const isValidDate = checkValidDate()

        if (isExistCodeInDB && isValidDate) return true
        throw new Error('Incorrect recoveryCode');
    })
    .withMessage('Incorrect recoveryCode')