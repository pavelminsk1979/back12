import {AvailableResolutions} from "../db/db";

export type CreateVideo = {
           title: string,
           author: string,
           availableResolutions?: AvailableResolutions[]
       }