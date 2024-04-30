import jwt from "jsonwebtoken"
import {settings} from "../common/settings";
import {ContentRefreshToken} from "../allTypes/usersDevicesTypes";


export const tokenJwtServise = {

    async createAccessTokenJwt(userId: string): Promise<string> {

        const accessToken = await jwt.sign({userId: userId}, settings.JWT_SECRET_AccessTOKEN, {expiresIn: settings.TIME_LIFE_AccessTOKEN})

        return accessToken
    },


    async createRefreshTokenJwt(deviceId: string) {

        const issuedAtRefreshToken = new Date();
        // date create refreshToken

        const timeLifeRefreshToken = settings.TIME_LIFE_RefreshTOKEN //'20s' string

        const numberTimeLifeRefreshToken: number = parseInt(settings.TIME_LIFE_RefreshTOKEN, 10);

        const expirationRefreshToken = new Date((issuedAtRefreshToken.getTime() + numberTimeLifeRefreshToken * 1000));


        const refreshToken = await jwt.sign({
            deviceId,
            issuedAtRefreshToken
        }, settings.JWT_SECRET_RefreshTOKEN, {expiresIn: timeLifeRefreshToken})

        return {refreshToken, issuedAtRefreshToken, expirationRefreshToken}
    },


    async getUserIdByToken(token: string) {
        try {
            const result = await jwt.verify(token, settings.JWT_SECRET_AccessTOKEN) as { userId: string }

            return result.userId
        } catch (error) {
            console.log(' FILE token-jwt-service.ts' + error)
            return null
        }
    },


    async getDataFromRefreshToken(refreshToken: string) {
        try {
            const result = await jwt.verify(refreshToken, settings.JWT_SECRET_RefreshTOKEN) as ContentRefreshToken

            return result

        } catch (error) {
            console.log(' FILE token-jwt-service.ts' + error)
            return null
        }
    },
}