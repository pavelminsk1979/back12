import {OutputPost, OutputPostWithLikeInfo, PaginationWithOutputPosts, Post, SortDataPost} from "../allTypes/postTypes";
import {LikesPostsModel, postssModel} from "../db/mongoDb";
import {postMaper} from "../mapers/postMaper";
import {ObjectId, WithId} from "mongodb";
import {postWithLikeInfoMaper} from "../mapers/postWithLikeInfoMaper";
import {StatusLike} from "../allTypes/LikesCommentsTypes";
import {LikesPostsType} from "../allTypes/LikesPostsType";
import {newPostMapper} from "../mapers/newPostMapper";
import {arrayPostsWithLikeInfoMapper} from "../mapers/arrayPostsWithLikeInfoMapper";


export const postQueryRepository = {

    async getPosts(
        sortDataPost: SortDataPost,
        userId: string | null
    ): Promise<PaginationWithOutputPosts<OutputPost>> {

        const {sortBy,
            sortDirection,
            pageNumber,
            pageSize} = sortDataPost

        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

        const arrayDocumentsPosts : WithId<Post> [] = await postssModel
            .find({})
            .sort({[sortBy]: sortDirectionValue})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec()

        const totalCount = await postssModel.countDocuments({})

        const pagesCount = Math.ceil(totalCount / pageSize)


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

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: arrayPosts
        }

    },


    async findPostById(id: string) {
        const post = await postssModel.findOne({_id: new ObjectId(id)})
        if (post) {
            return postMaper(post)
        } else {
            return null
        }
    },

    async getPostByIdWithLikeInfo(postId: string) {

        const post = await postssModel.findOne({_id: new ObjectId(postId)})

        if (!post) return null

        return postWithLikeInfoMaper(post)
    },


    async findPostByIdWithLikeInfo(id: string, userId: string | null) {
        const postId = new ObjectId(id);

        /*данные поста  из колекцииПостов  достану ,
        и чтоб ответ для фронта  мапером собрать
        (согластно Swager) нужны  также  данные
         из колекции likePost*/

        const postDocument: WithId<Post> | null = await postssModel.findOne({_id: postId})

        if (!postDocument) return null


        /* в колекцииЛайков много документов с одинаковыми
         postId -разные юзеры лайкают один документ.
          Ищу документ по двум полям
      postId  и userId. Конкретный юзер может в конкретном
      документе поставить только один likeStatus.
      данные понадобятся для поля  myStatus
      (в ответе на фронтенд   type OutputPostWithLikeInfo)*/

        const documentLikePostAuthorisationUser: LikesPostsType | null = await LikesPostsModel.findOne({postId, userId})


        //из базы достаю число   - сколько документов в базе
        //есть у которых postId определенная и StatusLike.Like
        const likesCount: number = await LikesPostsModel.countDocuments({
            postId,
            statusLike: StatusLike.Like
        });

        const dislikesCount: number = await LikesPostsModel.countDocuments({
            postId,
            statusLike: StatusLike.Dislike
        })


        /* из базы из колекции likePost достаю 3(три) документа
         с новейшими датами и статусами именно LIKE--
         -- далее из них сделаю обьекты type NewestLikes...
         внутри threeLatestDocumentWithStatusLike будет
         массив из 3 документов*/

        const threeLatestDocumentWithStatusLike: LikesPostsType[] = await LikesPostsModel.find({
            postId, statusLike: StatusLike.Like
        }).sort({addedAt: -1}).limit(3)

        /*sort({ addedAt: -1 }) используется для
        сортировки результатов запроса базы данных
        по полю addedAt в убывающем порядке.
         то есть от наибольшего значения к наименьшему*/

        /*limit(3)  последние добавленные записи в коллекцию,
            где дата addedAt у них самая новая*/

        return newPostMapper(
            postDocument,
            documentLikePostAuthorisationUser,
            likesCount,
            dislikesCount,
            threeLatestDocumentWithStatusLike
        )

    }
}