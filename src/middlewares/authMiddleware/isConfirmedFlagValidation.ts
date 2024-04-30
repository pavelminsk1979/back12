import {body} from "express-validator";
import {usersRepository} from "../../repositories/users/users-repository";



let user:any;
const find= async (email:string) => {
        user = await usersRepository.findUserByEmail(email)
        if(user)return true
        return false
}
const findFlag= () => {
        if(user.emailConfirmation.isConfirmed) return false
        return true
}

export const isConfirmedFlagValidation = body('email')
    .trim()
    .custom(async(email) => {
        const isExistUser = await find(email)
        const isFlagFalse =  findFlag()

        if(isExistUser&&isFlagFalse) return true
            throw new Error('Incorrect email');
    })
    .withMessage('Incorrect email')