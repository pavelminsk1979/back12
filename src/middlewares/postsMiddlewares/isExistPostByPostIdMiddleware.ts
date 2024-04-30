import {NextFunction, Response} from "express";
import {STATUS_CODE} from "../../common/constant-status-code";
import {postQueryRepository} from "../../repositories/post-query-repository";


export const isExistPostByPostIdMiddleware = async (req: any, res: Response, next: NextFunction) => {

    const id = req.params.postId.trim()

    const isExistPost = await postQueryRepository.findPostById(id)

    if (!isExistPost) {
        return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }

    return next()

}