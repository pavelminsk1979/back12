import { Types } from 'mongoose';


export type Visit = {
    IP: string
    URL: string
    date: Date
}

export type VisitWithIdMongodb = {
    IP: string
    URL: string
    date: Date
    _id: Types.ObjectId
}