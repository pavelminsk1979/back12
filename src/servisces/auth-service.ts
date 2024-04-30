import {AuthModel} from "../allTypes/authTypes";
import {userQueryRepository} from "../repositories/users/user-query-repository";
import {hashPasswordService} from "./hash-password-service";
import {usersRepository} from "../repositories/users/users-repository";
import {v4 as randomCode} from 'uuid';
import {add} from 'date-fns';
import {emailAdapter} from "../adapters/emailAdapter";
import {tokenJwtServise} from "./token-jwt-service";
import {emailLetterForRegistration} from "../common/email_letter/email_letter_for_registration";
import {emailLetterForRecoveryPassword} from "../common/email_letter/email_letter_for_recovery_password";


export const authService = {

    async registerUser(login: string, email: string, password: string) {

        const passwordHash = await hashPasswordService.generateHash(password)

        const newUser = {
            login,
            email,
            passwordHash,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: randomCode(),
                expirationDate: add(new Date(), {hours: 1, minutes: 2}),
                isConfirmed: false
            },
            blackListRefreshToken: []
        };

        await usersRepository.createUser(newUser)

        const letter = emailLetterForRegistration(newUser.emailConfirmation.confirmationCode)


        try {
            await emailAdapter.sendEmail(newUser.email, letter)
        } catch (error) {
            console.log(' FIlE auth-service.ts  registerUser' + error)
        }

        return newUser
    },


    async findUserInDataBase(requestBody: AuthModel) {

        const {loginOrEmail, password} = requestBody

        const user = await userQueryRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return null

        const passwordHashFromExistUser = user.passwordHash

        const isCorrectPasword = await hashPasswordService.checkPassword(password, passwordHashFromExistUser)


        if (!isCorrectPasword) return null

        return user._id.toString()
    },


    async updateConfirmationCode(code: string) {
        return await usersRepository.updateFlagIsConfirmedForUser(code)
    },


    async updateCodeConfirmationAndExpirationDate(email: string) {
        const newCode = randomCode()
        const newDate = add(new Date(), {hours: 1, minutes: 2})

        await usersRepository.updateCodeConfirmationAndExpirationDate(email, newCode, newDate)

        try {
            const letter = emailLetterForRegistration(newCode)
            await emailAdapter.sendEmail(email, letter)
        } catch (error) {
            console.log(' FIlE auth-service.ts  updateCodeConfirmationAndExpirationDate' + error)
        }

        return true
    },


    async checkAccessToken(header: string) {
        const titleAndToken = header.split(' ')
        //'Bearer lkdjflksdfjlj889765akljfklaj'
        if (titleAndToken[0] !== 'Bearer') return false

        const userId = await tokenJwtServise.getUserIdByToken(titleAndToken[1])

        if (!userId) return false

        const user = await userQueryRepository.findUserById(userId)

        if (!user) return false

        return user
    },


    /*Востановление пароля через подтверждение по электронной почте.
    Электронное письмо должно быть отправлено С КОДОМ ВОСТАНОВЛЕНИЯ ВНУТРИ*/
    async sendEmailForRecoveryPassword(email:string){

        const newCode = randomCode()
        const newDate = add(new Date(), {hours: 1, minutes: 2})

        await usersRepository.updateCodeConfirmationAndExpirationDate(email, newCode, newDate)

        try {
            const letter = emailLetterForRecoveryPassword(newCode)

            await emailAdapter.sendEmail(email, letter)

        } catch (error) {
            console.log(' FIlE auth-service.ts  sendEmailForRecoveryPassword' + error)
        }
    },

    //новый пароль (passwordHash) в базу данных помещаю
    async recoveryNewPassword(newPassword:string,code:string){

        const newPasswordHash = await hashPasswordService.generateHash(newPassword)

        await usersRepository.updatePasswordHash(newPasswordHash,code)

    }


}