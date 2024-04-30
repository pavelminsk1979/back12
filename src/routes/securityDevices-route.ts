import {Request, Response, Router} from "express";
import {STATUS_CODE} from "../common/constant-status-code";
import {securityDevicesService} from "../servisces/securityDevices-service";
import {RequestWithParams} from "../allTypes/RequestWithParams";
import {IdDeviceModel} from "../models/IdDeviceModel";
import {ResultCode} from "../common/object-result";


export const securityDevicesRoute = Router({})

securityDevicesRoute.get('/devices', async (req: Request, res: Response) => {
    try {

        const refreshToken = req.cookies.refreshToken

        const devices = await securityDevicesService.getActiveDevices(refreshToken)

        if (devices) {

            res.status(STATUS_CODE.SUCCESS_200).send(devices)

        } else {
            res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        }

    } catch (error) {
        console.log('securityDevices-route.ts /devices' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }

})


securityDevicesRoute.delete('/devices', async (req: Request, res: Response) => {
    try {

        const refreshToken = req.cookies.refreshToken

        const isDelete = await securityDevicesService.deleteNotActiveDevices(refreshToken)

        if (isDelete) {

            return res.sendStatus(STATUS_CODE.NO_CONTENT_204)

        } else {
            return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        }

    } catch (error) {
        console.log('securityDevices-route.ts delete /devices' + error)
        return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }

})


securityDevicesRoute.delete('/devices/:deviceId', async (req: RequestWithParams<IdDeviceModel>, res: Response) => {

    try {

        const refreshToken = req.cookies.refreshToken

        const resultObject = await securityDevicesService.deleteDeviceById(req.params.deviceId, refreshToken)


        if (resultObject.code === ResultCode.Success) {
            return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        }

        if (resultObject.code === ResultCode.NotFound) {
            return res.sendStatus(STATUS_CODE.FORBIDDEN_403)
        }
        if (resultObject.code === ResultCode.Incorrect) {
            return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        }
        if (resultObject.code === ResultCode.Failure) {
            return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
        return

    } catch (error) {
        console.log('securityDevices-route.ts delete /devices' + error)
        return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }

})