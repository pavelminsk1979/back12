import {LikeComment} from "../allTypes/LikesCommentsTypes";

export const newCommentMapper = (
    documenComment:any,
    documentLikeComentAuthorisationUser: LikeComment | null,
    likesCount:number,
    dislikesCount:number) => {

    if (!documentLikeComentAuthorisationUser) {
        return {
            id: documenComment._id.toString(),
            content: documenComment.content,
            createdAt: documenComment.createdAt,
            commentatorInfo: {
                userId: documenComment.commentatorInfo.userId,
                userLogin: documenComment.commentatorInfo.userLogin
            },
            likesInfo: {
                likesCount,
                dislikesCount,
                myStatus: "None"
            }
        }
    }


    const myStatus=documentLikeComentAuthorisationUser.statusLike


    return {
        id: documenComment._id.toString(),
        content: documenComment.content,
        createdAt: documenComment.createdAt,
        commentatorInfo: {
            userId: documenComment.commentatorInfo.userId,
            userLogin: documenComment.commentatorInfo.userLogin
        },
        likesInfo: {
            likesCount,
            dislikesCount,
            myStatus
        }
    }

}