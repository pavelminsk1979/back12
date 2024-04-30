import { Request, Response} from "express";
import {Router} from "express";
import { IdNumberGetAndDeleteModel} from "../models/IdNumberGetAndDeleteModel";
import {CreateVideo} from "../models/CreateVideoModel";
import { videosRepository} from "../repositories/videos-repository";
import {titleValidation} from "../middlewares/videoMiddlewares/titleValidation";
import {authorValidation} from "../middlewares/videoMiddlewares/authorValidation";
import {errorValidation} from "../middlewares/videoMiddlewares/errorValidation";
import {minAgeRestrictionValidation} from "../middlewares/videoMiddlewares/minAgeRestrictionValidation";
import {canBeDownloadedValidation} from "../middlewares/videoMiddlewares/canBeDownloadedValidation";
import {publicationDateValidation} from "../middlewares/videoMiddlewares/publicationDateValidation";
import {availableResolutionsValidation} from "../middlewares/videoMiddlewares/availableResolutionsValidation";
import {RequestWithParams} from "../allTypes/RequestWithParams";
import {RequestWithBody} from "../allTypes/RequestWithBody";
import {STATUS_CODE} from "../common/constant-status-code";



export const videosRoute = Router({})



videosRoute.get('/', (req: Request, res: Response) => {
    const videos = videosRepository.getVideos()
    res.status(STATUS_CODE.SUCCESS_200).send(videos)
})


videosRoute.get('/:id', (req: RequestWithParams<IdNumberGetAndDeleteModel>, res: Response) => {
    let video = videosRepository.findVideoById(+req.params.id)
    if (video) {
        res.status(STATUS_CODE.SUCCESS_200).send(video)
    } else {
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})


videosRoute.post('/', titleValidation, authorValidation, errorValidation,
    (req: RequestWithBody<CreateVideo>, res: Response) => {
        let newVideo = videosRepository.createVideo(req.body)
        res.status(STATUS_CODE.CREATED_201).send(newVideo)
    })


//RequestWithParamsWithBody<IdNumberGetAndDeleteModel, UpdateVideoModel>
videosRoute.put('/:id', titleValidation, authorValidation,
    minAgeRestrictionValidation,
    canBeDownloadedValidation,
    publicationDateValidation,
    availableResolutionsValidation, errorValidation,
    (req: Request, res: Response) => {
        let isUpdateVideo = videosRepository.updateVideo(+req.params.id, req.body)
        if (isUpdateVideo) {
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    })


videosRoute.delete('/:id', (req: RequestWithParams<IdNumberGetAndDeleteModel>, res: Response) => {
    let video = videosRepository.deletVideoById(+req.params.id)
    if (video) {
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    } else {
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})


