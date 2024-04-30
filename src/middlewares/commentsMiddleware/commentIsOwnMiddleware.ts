import {NextFunction, Response} from "express";
import {commentsQueryRepository} from "../../repositories/comments/comments-query-repository";
import {STATUS_CODE} from "../../common/constant-status-code";


export const commentIsOwnMiddleware = async (req: any, res: Response, next: NextFunction)=>{

    const comentId = req.params.commentId

    const userId = req.userIdLoginEmail.id

    const comment = await  commentsQueryRepository.findCommentById(comentId)

    if(comment && userId===comment.commentatorInfo.userId){
         next()
    } else {
        res.sendStatus(STATUS_CODE.FORBIDDEN_403)
    }

}