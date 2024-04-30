import {tokenJwtServise} from "./token-jwt-service";
import {ContentRefreshToken, UsersDevices} from "../allTypes/usersDevicesTypes";
import {usersDevicesRepository} from "../repositories/usersDevices/usersDevices-repository";
import {WithId} from "mongodb";


export const updateRefreshTokenService = {

    async updateRefreshToken(oldRefreshToken:string){

        const result :ContentRefreshToken|null =  await tokenJwtServise.getDataFromRefreshToken(oldRefreshToken)

        if(!result) return null

        const device:WithId<UsersDevices>|null = await usersDevicesRepository.findDeviceByIdAndDate(result)

        if(!device) return null


        const {
            refreshToken,
            issuedAtRefreshToken,
            expirationRefreshToken
        } = await tokenJwtServise.createRefreshTokenJwt(device.deviceId)


         await usersDevicesRepository.updateDevice(device.deviceId,issuedAtRefreshToken,expirationRefreshToken)

        const accessToken = await tokenJwtServise.createAccessTokenJwt(device.userId)

        return {accessToken,refreshToken}
    }
}



