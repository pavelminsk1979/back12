import {OutputUserMeRequest} from "../allTypes/userTypes";


export const userMaperForMeRequest = (user:any):OutputUserMeRequest => {
    return {
        userId:user.id,
        login: user.login,
        email: user.email,
    }
}