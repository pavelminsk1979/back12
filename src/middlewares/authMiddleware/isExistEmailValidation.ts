import {body} from "express-validator";
import {userQueryRepository} from "../../repositories/users/user-query-repository";


export const isExistEmailValidation = body('email')
    .trim()
    .custom(async (email) => {
        const user= await userQueryRepository.findUserByLoginOrEmail(email)

        if(user){
            throw new Error('Incorrect email');
        }

        return  true

    })
    .withMessage('Incorrect email')