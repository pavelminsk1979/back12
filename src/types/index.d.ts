import {OutputUser} from "./allTypes/userTypes";

export {};

declare global {
    namespace Express {
        export interface Request {
            userIdLoginEmail:OutputUser | null
            userId:string | null
        }
    }
}