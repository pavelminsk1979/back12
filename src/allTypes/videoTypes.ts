import {AvailableResolutions} from "../db/db";

export type Video = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean ;
    minAgeRestriction: number ;
    createdAt: string;
    publicationDate: string;
    availableResolutions: AvailableResolutions[];
}

