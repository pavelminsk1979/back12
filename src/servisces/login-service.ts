import {RequestWithBody} from "../allTypes/RequestWithBody";
import {AuthModel} from "../allTypes/authTypes";
import {authService} from "./auth-service";
import {tokenJwtServise} from "./token-jwt-service";
import {v4 as randomDeviceId} from "uuid";
import {AccessAndRefreshToken, UsersDevices} from "../allTypes/usersDevicesTypes";
import {usersDevicesRepository} from "../repositories/usersDevices/usersDevices-repository";


export const loginService = {

    async loginUser(req: RequestWithBody<AuthModel>):Promise<AccessAndRefreshToken|null> {

        const idUser = await authService.findUserInDataBase(req.body)

        if (!idUser) return null

        const deviceId = randomDeviceId() //uuid

        const {
            refreshToken,
            issuedAtRefreshToken,
            expirationRefreshToken
        } = await tokenJwtServise.createRefreshTokenJwt(deviceId)

        const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress as string

        const nameDevice: string = req.headers['user-agent'] || 'Some Device';

        const newDevice: UsersDevices = {
            issuedAt: issuedAtRefreshToken,//date create RefreshToken
            deviceId,    //uuid
            nameDevice,  //from headers
            userId: idUser,
            expDate: expirationRefreshToken,// expiration date RefreshToken
            ip
        }

        await usersDevicesRepository.createDevice(newDevice)


        const accessToken = await tokenJwtServise.createAccessTokenJwt(idUser)


        return {accessToken,refreshToken}
    }
}