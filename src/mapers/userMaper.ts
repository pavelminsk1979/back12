import {WithId} from "mongodb";
import {OutputUser, User} from "../allTypes/userTypes";




export const userMaper = (user:WithId<User>):OutputUser => {
    return {
        id:user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}