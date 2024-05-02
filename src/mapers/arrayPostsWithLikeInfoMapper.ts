import {WithId} from "mongodb";
import {OutputPostWithLikeInfo, Post} from "../allTypes/postTypes";
import {LikesPostsType} from "../allTypes/LikesPostsType";
import {StatusLike} from "../allTypes/LikesCommentsTypes";

export const arrayPostsWithLikeInfoMapper = (
    userId: string | null,  // для myStatus
    arrayDocumentsPosts: WithId<Post> [],  //массив постов(МП)
    arrayDocumentsFromLikePostCollection: LikesPostsType[] // массив лайков относящихся к постам из МАССИВА ПОСТОВ(МП)
): OutputPostWithLikeInfo[] => {

    /*   создавать массив который буду возвращать на
       фронтент БУДУ НА ОСНОВАНИИ МАСИВА ПОСТОВ(МП)*/


    /*  В методе МАР на каждой итерации будет создаватся
      один обьект и в итоге будет массив обьектов*/

    const arrayPostsWithLikeInfo = arrayDocumentsPosts.map((postDocument: WithId<Post>) => {

        /* 1 нахожу все документы Лайков для текущего
        ВНУТРИ МЕТОДА МАП postDocument*/
        const allDocumentsLikePostCollectionByPostId = arrayDocumentsFromLikePostCollection.filter(e => e.postId === postDocument._id.toString())


        /*  2 ПОЛЬЗователь который делает данный ГЕТ запрос
          если он авторизован тогда из параметра
          userId:(string | null,  // для myStatus)
          НАЙДУ ДОКУМЕНТ ИЗ ВСЕХ ЛАЙКПОСТ ДОКУМЕНТОВ
           из allDocumentsLikePostCollectionByPostId
           И из него достану myStatus*/
        const likePostDocumentCurrentUser: LikesPostsType | undefined = allDocumentsLikePostCollectionByPostId.find(
            e => e.userId === userId)
        const myStatus = likePostDocumentCurrentUser
            ? likePostDocumentCurrentUser.statusLike
            : StatusLike.None
      ///////////////
        /////////////////////


        /* каждый элемент будет модифицирован и  ретурном будет
         возвращен в переменную в которой будет массив */
        return {}
    })

}