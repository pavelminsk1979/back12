import {CreateVideo} from "../models/CreateVideoModel";
import {UpdateVideoModel} from "../models/UpdateVideoModel";
import {DB} from "../db/db";
import {Video} from "../allTypes/videoTypes";


export const videosRepository = {
    getVideos() {
        return DB.videos
    },


    findVideoById(id: number) {
        let video = DB.videos.find(e => e.id === id)
        return video
    },


    deletVideoById(id: number) {
        for (let i = 0; i < DB.videos.length; i++) {
            if (DB.videos[i].id === id) {
                DB.videos.splice(i, 1)
                return true
            }
        }
        return false
    },

    createVideo(requestBody: CreateVideo) {
        let {title, author, availableResolutions} = requestBody
        const createdAt = new Date()
        const publicationDate = new Date(createdAt);
        publicationDate.setDate(publicationDate.getDate() + 1);

        const newVideo: Video = {
            id: +(new Date()),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: 6,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate.toISOString(),
            availableResolutions:[]
        }

        DB.videos.push(newVideo)
        return newVideo
    },

    updateVideo(id:number,requestBody:UpdateVideoModel){
        let {title, author, availableResolutions, minAgeRestriction, canBeDownloaded, publicationDate} = requestBody

        let video = DB.videos.find(e => e.id === id)
        if (video) {
            video.title = title
            video.author = author
            if (availableResolutions) {
                video.availableResolutions = availableResolutions
            }
            if (canBeDownloaded) {
                video.canBeDownloaded = canBeDownloaded
            }
            if (minAgeRestriction) {
                video.minAgeRestriction = minAgeRestriction
            }
            if (publicationDate) {
                video.publicationDate = publicationDate
            }
            return true

        } else {
            return false

        }
    }
}
