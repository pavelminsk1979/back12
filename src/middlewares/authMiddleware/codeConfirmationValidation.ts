import {body} from "express-validator";
import {usersRepository} from "../../repositories/users/users-repository";


let user:any;
const findCode = async (value:string) => {
     user = await usersRepository.findUserByConfirmationCode(value)
    if(user)return true
    return false
}
const findFlag= () => {
    if(user.emailConfirmation.isConfirmed) return false
    return true
}
const checkValidDate= () => {
    if(user.emailConfirmation.expirationDate < new Date()) return false
    return true
}
export const codeConfirmationValidation = body('code')
    .trim()
    .exists()
    .custom(async(value) => {

        const isExistCodeInDB = await findCode(value)
        const isFlagFalse =  findFlag()
        const isValidDate = checkValidDate()

        if(isExistCodeInDB&&isFlagFalse&&isValidDate) return true
        throw new Error('Incorrect code');
    })
    .withMessage('Incorrect code')