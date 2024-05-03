import {WithId} from "mongodb";
import {OutputPostWithLikeInfo, Post} from "../allTypes/postTypes";
import { LikesPostsType} from "../allTypes/LikesPostsType";
import {StatusLike} from "../allTypes/LikesCommentsTypes";
import {newPostMapper} from "./newPostMapper";

export const arrayPostsWithLikeInfoMapper = (
    userId: string | null,  // для myStatus
    arrayDocumentsPosts: WithId<Post> [],  //массив постов(МП)
    arrayDocumentsFromLikePostCollection: LikesPostsType[] // массив лайков относящихся к постам
): OutputPostWithLikeInfo[] => {

    /*   создавать массив который буду возвращать на
       фронтент БУДУ НА ОСНОВАНИИ МАСИВА ПОСТОВ*/


    /*  В методе МАР на каждой итерации будет создаватся
      один обьект и в итоге будет массив обьектов*/

    const arrayPostsWithLikeInfo = arrayDocumentsPosts.map((postDocument: WithId<Post>) => {

        /* 1 нахожу все документы Лайков для текущего
        ВНУТРИ МЕТОДА МАП postDocument*/
        const allDocumentsLikePostCollectionByPostId = arrayDocumentsFromLikePostCollection.filter(e => e.postId === postDocument._id.toString())

        //чтобы количество Лайкнутых коментариев узнать
        const likesCount: number = allDocumentsLikePostCollectionByPostId.filter(e => e.statusLike === StatusLike.Like).length

        //чтобы количество ДизЛайкнутых коментариев узнать
        const dislikesCount: number = allDocumentsLikePostCollectionByPostId.filter(e => e.statusLike === StatusLike.Dislike).length


        /* 2 нахожу из всех документов лайков для данного поста
          3 новейших документа со статусом Like*/

        //только с статусом ЛАЙК
        const arrayOnlyLike = allDocumentsLikePostCollectionByPostId.filter(e => e.statusLike === StatusLike.Like)

        //преобразую addedAt:string  в addedAt:Date
        const updateDocumentsLikePost =
            arrayOnlyLike.map(document => {
                return {
                    ...document, addedAt: new Date(document.addedAt)
                }
            })

        // отсортирую по дате, чтобы самая новая дата была на первом месте
        const arraySort = updateDocumentsLikePost.sort((a, b) => {
            const dateA = a.addedAt.getTime();
            const dateB = b.addedAt.getTime();
            return dateB - dateA;
        });


        //только 3 элемента возму
        const arrayThreetDocumentWithStatusLike =
            arraySort.slice(0, 3)

        //преобразую addedAt:Date в addedAt:string

        const threeLatestDocumentWithStatusLike = arrayThreetDocumentWithStatusLike.map(document => {
            return {
                ...document, addedAt: document.addedAt.toISOString()
            }
        })


        /*  3 ПОЛЬЗователь который делает данный ГЕТ запрос
          если он авторизован тогда из параметра по
          userId:(string | null,  // для myStatus)
          НАЙДУ ДОКУМЕНТ(если он есть) ИЗ ВСЕХ ЛАЙКПОСТ ДОКУМЕНТОВ
           И из него достану myStatus*/
        const likePostDocumentCurrentUser: LikesPostsType | undefined = allDocumentsLikePostCollectionByPostId.find(
            e => e.userId === userId)

        /*  нужно чтоб в этой переменной или документ был
          авторизованого юзера или null--такая нужда потомучто
          далее передам эту переменную в переиспользуемую
          функцию и там ожидается именно такая структура */
        const documentLikePostAuthorisationUser: LikesPostsType | null =
            likePostDocumentCurrentUser
                ? likePostDocumentCurrentUser
                : null

        ///////////////
        /////////////////////


        /* каждый элемент будет модифицирован и  ретурном будет
         возвращен в переменную в которой будет массив */
        return newPostMapper(
            postDocument,
            documentLikePostAuthorisationUser,
            likesCount,
            dislikesCount,
            threeLatestDocumentWithStatusLike
        )
    })

    return arrayPostsWithLikeInfo

}