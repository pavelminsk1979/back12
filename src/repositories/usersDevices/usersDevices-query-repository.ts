import { usersDevicesModel} from "../../db/mongoDb";
import {deviceMaper} from "../../mapers/deviceMaper";


export const usersDevicesQueryRepository = {

    async getDevices(userId: string) {

        const devices = await usersDevicesModel.find({userId})


        return devices.map(deviceMaper)
    }


}