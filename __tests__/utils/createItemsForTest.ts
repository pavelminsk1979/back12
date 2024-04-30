import {v4 as randomCode} from "uuid";
import {add} from "date-fns";
import { usersModel} from "../../src/db/mongoDb";

export const createItemsForTest = {
    createOneItem() {
        return {
            login: '7763377',
            email: 'pa77velminsk7777@mail.ru',
            password: '77177pasw'
        }
    },

    createManyItems(count: number) {
        const arrayItems = []
        for (let i = 0; i < count; i++) {
            arrayItems.push({
                login: 'kljaf' + i,
                email: `lkajf${i}@ru`,
                password: `76545987${i}`
            })
        }
        return arrayItems
    },

    async registerUserForTest(login:any, email:any, passwordHash:any, code:any, expirationDate:any, isConfirmed:any) {
        const newUserForTest = {
            login,
            email,
            passwordHash,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: code ?? randomCode(),
                expirationDate: expirationDate ?? add(new Date(), {hours: 1, minutes: 2}),
                isConfirmed:isConfirmed ?? false
            },
            blackListRefreshToken:[]
        }

        const result = await usersModel.create(newUserForTest)
        return result
    }
}