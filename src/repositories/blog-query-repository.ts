import {blogsModel, LikesPostsModel, postssModel} from "../db/mongoDb";
import {blogMaper} from "../mapers/blogMaper";
import {ObjectId, WithId} from "mongodb";
import {OutputBlog, PaginationWithOutputBlog, SortData} from "../allTypes/blogTypes";
import {postMaper} from "../mapers/postMaper";
import {OutputPostWithLikeInfo, Post} from "../allTypes/postTypes";
import {LikesPostsType} from "../allTypes/LikesPostsType";
import {arrayPostsWithLikeInfoMapper} from "../mapers/arrayPostsWithLikeInfoMapper";


export const blogQueryRepository = {
    async getBlogs(sortData: SortData): Promise<PaginationWithOutputBlog<OutputBlog>> {
        const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = sortData

        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

        let filter = {}

        if (searchNameTerm) {
            filter = {
                name: {
                    $regex: searchNameTerm,
                    $options: 'i'
                }
            }
        }


        const blogs = await blogsModel
            .find(filter)
            .sort({[sortBy]: sortDirectionValue})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec()
        const totalCount = await blogsModel.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount / pageSize)


        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs.map(blogMaper)
        }
    },


    async getPostsForCorrectBlog(
        sortDataGetPostsForBlogs: any,
        blogId: string,
        userId: string | null) {

        const {sortBy,
            sortDirection,
            pageNumber,
            pageSize} = sortDataGetPostsForBlogs


        const blog = await blogQueryRepository.findBlogById(blogId)

        if (!blog) {
            return null
        }

        const filter = {blogId}

        const arrayDocumentsPosts : WithId<Post> [] = await postssModel
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec()

        const totalCount = await postssModel.countDocuments(filter)

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


    async findBlogById(id: string) {

        const blog = await blogsModel.findOne({_id: new ObjectId(id)})

        if (blog) {
            return blogMaper(blog)
        } else {
            return null
        }
    },
}