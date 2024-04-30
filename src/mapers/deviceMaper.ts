import {OutputDevice, UsersDevices} from "../allTypes/usersDevicesTypes";
import {WithId} from "mongodb";


export const deviceMaper=(device:WithId<UsersDevices>):OutputDevice=>{

    return{
        ip: device.ip,
        title: device.nameDevice,
        lastActiveDate: device.expDate,
        deviceId:device.deviceId
    }
}