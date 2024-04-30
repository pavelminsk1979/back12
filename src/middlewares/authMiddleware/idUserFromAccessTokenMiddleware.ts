import {NextFunction, Response} from "express";
import {tokenJwtServise} from "../../servisces/token-jwt-service";


//верну userId или null чтоб в myStatus было или значение
// авторизованого пользователя или None

export const idUserFromAccessTokenMiddleware = async (req: any, res: Response, next: NextFunction) => {

    const accessToken = req.headers.authorization

    if (accessToken) {
        const titleAndAccessToken = accessToken!.split(' ')
        //'Bearer lkdjflksdfjlj889765akljfklaj'

        const userId = await tokenJwtServise.getUserIdByToken(titleAndAccessToken[1])

        req.userId = userId
        return next()
    } else {
        req.userId = null
        return next()
    }

}