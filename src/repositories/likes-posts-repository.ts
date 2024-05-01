import {LikesPostsModel} from "../db/mongoDb";
import {LikesPostsType} from "../allTypes/LikesPostsType";
import {StatusLike} from "../allTypes/LikesCommentsTypes";


export const LikesPostsRepository = {

    async findDocumentByUserIdAndPostId(postId: string, userId: string) {
        return LikesPostsModel.findOne({postId, userId})
    },

    async addNewDocument(documentForLikePostCollection:LikesPostsType){
        return LikesPostsModel.create(documentForLikePostCollection)
    },

    async setNewAddedAtNewStatusLike(
        userId:string,
        postId:string,
        date:string,
        statusLike:StatusLike){
        return LikesPostsModel.findOneAndUpdate(
            {userId,postId},
            {$set: {statusLike,addedAt:date}}
        )
    },

}