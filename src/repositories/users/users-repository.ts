import {usersModel} from "../../db/mongoDb";
import {User} from "../../allTypes/userTypes";
import {ObjectId} from "mongodb";


export const usersRepository = {


    async createUser(newUser: User) {

        const result = await usersModel.create(newUser)

        return result
    },

    async deleteUserById(id: string): Promise<boolean> {

        const result = await usersModel.deleteOne({_id: new ObjectId(id)})

        return !!result.deletedCount
    },

    async findUserByConfirmationCode(code: string) {
        return await usersModel.findOne({
            "emailConfirmation.confirmationCode": code
        })
    },

    async findUserByEmail(email: string) {
        return await usersModel.findOne({email})
    },

    async updateFlagIsConfirmedForUser(code: string) {

        const result = await usersModel.updateOne({"emailConfirmation.confirmationCode": code}, {
            $set: {"emailConfirmation.isConfirmed": true}
        })

        return !!result.matchedCount
    },


    async updateCodeConfirmationAndExpirationDate(email: string, newCode: string, newDate: Date) {

        const result = await usersModel.updateOne({email}, {
            $set: {"emailConfirmation.confirmationCode": newCode, "emailConfirmation.expirationDate": newDate}
        })

        return !!result.matchedCount
    },


    async findUserWithAllPropetiesById(id: string) {
        const user = await usersModel.findOne({_id: new ObjectId(id)})
        if (!user) return null

        return user
    },

    async updateBlackListRefreshTokenForUser(email: string, token: string) {

        const result = await usersModel.updateOne({email},
            {$push: {blackListRefreshToken: token}})

        return !!result.matchedCount
    },


    async updatePasswordHash(newPasswordHash:string, code:string){

        await usersModel.updateOne({"emailConfirmation.confirmationCode": code}, {
            $set: { passwordHash:newPasswordHash}
        })


    }

}