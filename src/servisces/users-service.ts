import {CreateUserModel, OutputUser} from "../allTypes/userTypes";
import {usersRepository} from "../repositories/users/users-repository";
import {userQueryRepository} from "../repositories/users/user-query-repository";
import {hashPasswordService} from "./hash-password-service";
import {v4 as randomCode} from "uuid";


export const usersService = {

    async createUser(requestBodyUser: CreateUserModel):Promise<OutputUser|null> {

        const {login, password, email} = requestBodyUser


        const passwordHash = await hashPasswordService.generateHash(password)

        const newUser = {
            passwordHash,
            login,
            email,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: randomCode(),
                expirationDate: new Date(),
                isConfirmed: true
            },
            blackListRefreshToken:[]
        }

        const result= await usersRepository.createUser(newUser)

       // const idNewUser = result.insertedId.toString()

            const idNewUser = result._id.toString()
        //const idNewUser = result[0].id

        if (!idNewUser) return null

const user =  await userQueryRepository.findUserById(idNewUser)

        return user

    },

    async deleteUserById(id:string):Promise<boolean>{
        return usersRepository.deleteUserById(id)
    },


}



















