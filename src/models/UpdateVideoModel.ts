import {AvailableResolutions} from "../db/db";

export  type UpdateVideoModel = {
    title: string,
    author: string,
    availableResolutions?: AvailableResolutions[]
    canBeDownloaded?: boolean,
    minAgeRestriction?: number,//maximum: 18   minimum: 1
    publicationDate?: string
}