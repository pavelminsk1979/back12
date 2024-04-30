import {ObjectId} from "mongodb";
import {commentsModel, LikesCommentsModel} from "../../db/mongoDb";
import {newCommentMapper} from "../../mapers/newCommentMapper";
import {StatusLike} from "../../allTypes/LikesCommentsTypes";

export const newCommentsQueryRepository = {

    async findCommentById(id: string, userId: string | null) {

         /*данные коментария из колекцииКоментариев  достану , и чтоб ответ
        мапером собрать нужны  также  данные из
        колекции likeComment*/

        const documenComment = await commentsModel.findOne({_id: new ObjectId(id)})

        if (!documenComment) return null


       /* в колекцииЛайков много документов с одинаковыми commentId -разные
        юзеры лайкают один документ. Ищу документ по двум полям
        commentId  и userId. Конкретный юзер может в конкретном
        документе поставить только один likeStatus*/

        const documentLikeComentAuthorisationUser = await LikesCommentsModel.findOne({
            commentId: new ObjectId(id),userId})


            //из базы достаю число   - сколько документов в базе
        //есть у которых commentId определенная и StatusLike.Like
        const likesCount = await LikesCommentsModel.countDocuments({ commentId: new ObjectId(id), statusLike: StatusLike.Like });

        const dislikesCount = await LikesCommentsModel.countDocuments({ commentId: new ObjectId(id), statusLike: StatusLike.Dislike });


        return newCommentMapper(
            documenComment,
            documentLikeComentAuthorisationUser,
            likesCount,
            dislikesCount)

    }

}