

export enum AvailableResolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
}

export const DB = {
    videos:[    {
        "id": 1234,
        "title": "video interesting",
        "author": "man",
        "canBeDownloaded": true,
        "minAgeRestriction": 0,
        "createdAt": "2024-02-01T18:57:08.689Z",
        "publicationDate": "2024-02-01T18:57:08.689Z",
        "availableResolutions": [AvailableResolutions.P144]
    }],
}



