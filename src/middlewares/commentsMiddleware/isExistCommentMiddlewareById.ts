import {NextFunction, Response} from "express";
import {commentsQueryRepository} from "../../repositories/comments/comments-query-repository";
import {STATUS_CODE} from "../../common/constant-status-code";


export const isExistCommentMiddlewareById= async (req: any, res: Response, next: NextFunction) => {

    const id = req.params.id.trim()

    const isExistComment= await commentsQueryRepository.findCommentById(id)

    if(isExistComment){
        return  next()
    } else {
        return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }

}