import {ContentRefreshToken, UsersDevices} from "../allTypes/usersDevicesTypes";
import {tokenJwtServise} from "./token-jwt-service";
import {WithId} from "mongodb";
import {usersDevicesRepository} from "../repositories/usersDevices/usersDevices-repository";
import {usersDevicesQueryRepository} from "../repositories/usersDevices/usersDevices-query-repository";
import {ResultCode} from "../common/object-result";


export const securityDevicesService = {

    async getActiveDevices(refreshToken: string) {

        const result: ContentRefreshToken | null = await tokenJwtServise.getDataFromRefreshToken(refreshToken)

        if (!result) return null

        const device: WithId<UsersDevices> | null = await usersDevicesRepository.findDeviceByIdAndDate(result)

        if (!device) return null

        const devicesOneUser = await usersDevicesQueryRepository.getDevices(device.userId)


        return devicesOneUser
    },


    async deleteNotActiveDevices(refreshToken: string) {

        const result: ContentRefreshToken | null = await tokenJwtServise.getDataFromRefreshToken(refreshToken)

        if (!result) return null

        const device: WithId<UsersDevices> | null = await usersDevicesRepository.findDeviceByIdAndDate(result)

        if (!device) return null

        await usersDevicesRepository.deleteDevicesExeptCurrentDevice(device.userId, device.deviceId)


        return true
    },

    async deleteDeviceById(deviceId: string, refreshToken: string) {

        const isExistDeviceInCollection = await usersDevicesRepository.findDeviceById(deviceId)

        if (!isExistDeviceInCollection) return {
            code: ResultCode.Failure
        }

        const dataFromRefreshToken: ContentRefreshToken | null = await tokenJwtServise.getDataFromRefreshToken(refreshToken)

        if (!dataFromRefreshToken) return {
            code: ResultCode.Incorrect
        }

        const dataSession = await usersDevicesRepository.findDeviceByIdAndDate(dataFromRefreshToken)

        if (!dataSession) return {
            code: ResultCode.Incorrect
        }

        const userId = dataSession.userId

        const isDeleteSessionCorrectUser= await usersDevicesRepository.deleteDeviceCorrectUser(userId,deviceId)


        if (!isDeleteSessionCorrectUser) return {
            code: ResultCode.NotFound
        }



        return {code: ResultCode.Success}

    }

}