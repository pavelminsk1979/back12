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

/*
export type OutputUser = {
    id: string,
    login: string,
    email: string,
    createdAt: Date
}*/
