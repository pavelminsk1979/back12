export type UsersDevices = {
    issuedAt: Date        //date create RefreshToken
    deviceId: string     //uuid
    nameDevice: string    //from headers
    userId: string
    expDate: Date        // expiration date RefreshToken
    ip: string
}

export type AccessAndRefreshToken = {
    accessToken: string,
    refreshToken: string
}

export type ContentRefreshToken = {
    deviceId: string,
    issuedAtRefreshToken: Date
}

export type OutputDevice = {
    ip: string
    title: string
    lastActiveDate: Date
    deviceId: string

}