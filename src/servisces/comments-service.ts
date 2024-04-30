import {commentsRepository} from "../repositories/comments/comments-repository";
import {LikeComment, StatusLike} from "../allTypes/LikesCommentsTypes";
import {LikesCommentsRepository} from "../repositories/LikesCommentsRepository";


export const commentsSevrice = {

    async deleteComentById(idComent: string) {

        return commentsRepository.deleteComentById(idComent)

    },


    async updateComment(commentId: string, content: string) {
        return commentsRepository.updateComment(commentId, content)
    },


    async setOrUpdateLikeStatus(
        commentId: string,
        statusLike: StatusLike,
        userId: string) {


        /*    ищу в базе Лайков  один документ   по
         двум полям userId и commentId---*/
        const documentByUserId = await LikesCommentsRepository.findDocumentByUserIdAndCommentId(userId,commentId)

        /*Если документа  нет тогда надо добавить
   newDocumentForCollectionLikesComments в базу*/


        if (!documentByUserId) {
            const newDocumentForCollectionLikesComments: LikeComment = {
                commentId, userId, statusLike}

            return LikesCommentsRepository.addNewDocumentForLikeCommentCollention(newDocumentForCollectionLikesComments)
        }

        /*Если документ есть тогда надо изменить
        statusLike на приходящий */

            return LikesCommentsRepository.setNewStatusLike(userId,commentId,  statusLike)

    },
}