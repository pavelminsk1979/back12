import { usersDevicesModel} from "../../db/mongoDb";
import {ContentRefreshToken, UsersDevices} from "../../allTypes/usersDevicesTypes";
import { WithId} from "mongodb";


export const usersDevicesRepository = {

    async createDevice(newDevice: UsersDevices) {

        return await usersDevicesModel.create(newDevice)
    },


    async findDeviceByIdAndDate(result: ContentRefreshToken): Promise<WithId<UsersDevices> | null> {

        const entity = await usersDevicesModel.findOne({
            deviceId: result.deviceId,
            issuedAt: new Date(result.issuedAtRefreshToken)
        })
        return entity
    },

    async findDeviceById(deviceId: string): Promise<WithId<UsersDevices> | null> {

        const entity = await usersDevicesModel.findOne({deviceId})
        return entity
    },


    async updateDevice(id: string, issuedAtRefreshToken: Date, expirationRefreshToken: Date) {

        await usersDevicesModel.updateOne({deviceId: id}, {
            $set: {
                issuedAt: issuedAtRefreshToken,
                expDate: expirationRefreshToken
            }
        })
    },

    async deleteDevicesExeptCurrentDevice(userId: string, deviceId: string) {

        await usersDevicesModel.deleteMany({
            userId: userId,
            deviceId: {$ne: deviceId}
        });

        return true
    },


    async deleteDevice(deviceId: string, issuedAt: Date) {
        const res = await usersDevicesModel.deleteOne({
            deviceId,
            issuedAt: new Date(issuedAt)
        })
        if (res.deletedCount > 0) {

            return true
        } else {
            return false
        }
    },


    async deleteDeviceCorrectUser(userId: string, deviceId: string) {
        const res = await usersDevicesModel.deleteOne({
            userId,
            deviceId
        })
        if (res.deletedCount > 0) {

            return true
        } else {
            return false
        }
    },


}