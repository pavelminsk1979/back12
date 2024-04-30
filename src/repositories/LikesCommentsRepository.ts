import {LikesCommentsModel} from "../db/mongoDb";
import {LikeComment, StatusLike} from "../allTypes/LikesCommentsTypes";

export const LikesCommentsRepository = {


    async findDocumentByUserIdAndCommentId(userId: string,commentId: string) {

        return LikesCommentsModel.findOne({ userId , commentId});

    },

    async setNewStatusLike(userId: string, commentId: string, statusLike: StatusLike) {

        return  LikesCommentsModel.findOneAndUpdate(
            { userId, commentId},
            {$set: {statusLike}});
        },


    async addNewDocumentForLikeCommentCollention(newDocumentForCollectionLikesComments:LikeComment) {

        return  LikesCommentsModel.create(
            newDocumentForCollectionLikesComments)
    }


}