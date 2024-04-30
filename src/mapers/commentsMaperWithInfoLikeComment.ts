import {LikeComment, StatusLike} from "../allTypes/LikesCommentsTypes";


export const commentsMaperWithInfoLikeComment = (
    arrayDocumentsComments: any,
    userId: string | null,
    arrayDocumentsFromLikeCollection: LikeComment[]
) => {

    const arrayComments = arrayDocumentsComments.map((coment: any) => {

        //нахожу все документы из масива ЛайкКомент у которых
        //айдиКомент такаяже как у текущего коментари
        const likesCommentByIdComment = arrayDocumentsFromLikeCollection.filter(e => e.commentId === coment.id)


        // чтобы установить myStatus юзера который
        // делает данный запрос
        const likeComent = likesCommentByIdComment.find(el => el.userId === userId)

        //чтобы количество Лайкнутых коментариев узнать
        const likesCount = likesCommentByIdComment.filter(e => e.statusLike === StatusLike.Like).length

        //чтобы количество ДизЛайкнутых коментариев узнать
        const dislikesCount = likesCommentByIdComment.filter(e => e.statusLike === StatusLike.Dislike).length

        return {
            id: coment._id.toString(),
            content: coment.content,
            createdAt: coment.createdAt,
            commentatorInfo: {
                userId: coment.commentatorInfo.userId,
                userLogin: coment.commentatorInfo.userLogin
            },
            likesInfo: {
                likesCount: likesCount,
                dislikesCount: dislikesCount,
                myStatus: likeComent ? likeComent.statusLike : "None"
            }
        }
    })

    return arrayComments
}