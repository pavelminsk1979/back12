import {WithId} from "mongodb";
import {OutputPostWithLikeInfo, Post} from "../allTypes/postTypes";
import {LikesPostsType} from "../allTypes/LikesPostsType";
import {LikesPostsModel} from "../db/mongoDb";
import {arrayPostsWithLikeInfoMapper} from "../mapers/arrayPostsWithLikeInfoMapper";

export const createArrayPostsWithInfoLikeService = {
    async createArrayPosts(
        arrayDocumentsPosts : WithId<Post> [],
        userId: string | null,
    ){

        /*arrayDocumentsPosts это массив постов type WithId<Post> ,
        далее достану из каждого обьекта _id(aйдишка поста)
        буду иметь массив айдишек постов*/
        const arrayIdPosts = arrayDocumentsPosts.map(e=>e._id.toString())


        /*далее из коллекции like_post:LikesPostsType
      достану все документы у которых postId такиеже
       как в массиве айдишек arrayIdPosts*/
        const arrayDocumentsFromLikePostCollection : LikesPostsType[] = await LikesPostsModel.find({
            postId:{$in:arrayIdPosts}
        })


        /*создаю массив постов с информацией о лайках и буду его
   отправлять на фронтенд
   Создаю items  из  типа
  PaginationWithOutputPosts<OutputPostWithLikeInfo>
   */

        const arrayPosts:OutputPostWithLikeInfo[] = arrayPostsWithLikeInfoMapper(
            userId, // для myStatus
            arrayDocumentsPosts,
            arrayDocumentsFromLikePostCollection,
        )

        return arrayPosts
    }
}