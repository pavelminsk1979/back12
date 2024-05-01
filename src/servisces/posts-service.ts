import {Post} from "../allTypes/postTypes";
import {CreateAndUpdatePostModel} from "../models/CreateAndUpdatePostModel";
import {postsRepository} from "../repositories/posts-repository-mongoDB";
import {blogQueryRepository} from "../repositories/blog-query-repository";
import {postQueryRepository} from "../repositories/post-query-repository";
import {Comment, CommentatorInfo} from "../allTypes/commentTypes";
import {commentsRepository} from "../repositories/comments/comments-repository";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {ResultCode} from "../common/object-result";
import {StatusLike} from "../allTypes/LikesCommentsTypes";
import {OutputUser} from "../allTypes/userTypes";
import {LikesPostsRepository} from "../repositories/likes-posts-repository";
import {LikesPostsType} from "../allTypes/LikesPostsType";




export const postsSevrice = {


    async createPost(requestBodyPost: CreateAndUpdatePostModel) {
        const {title, shortDescription, content, blogId} = requestBodyPost

        const blog = await blogQueryRepository.findBlogById(blogId)

        let blogName

        if (blog) {
            blogName = blog.name
        }


        const newPost: Post = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogName ? blogName : 'someBlogName',
            createdAt: new Date().toISOString()
        }
        const result = await postsRepository.createPost(newPost)


        if (result._id.toString()) {
            return {
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt,
                id: result._id.toString()
            }
        } else {
            return null
        }

    },


    async updatePost(id: string, requestBodyPost: CreateAndUpdatePostModel) {

        return postsRepository.updatePost(id, requestBodyPost)

    },


    async deletePostById(id: string) {

        return postsRepository.deletePostById(id)
    },


    async createCommentForPostByPostId(
        postId: string,
        content: string,
        userId: string,
        userLogin: string) {


//эту проверку можно в мидлвеер перенести
        const post = await postQueryRepository.findPostById(postId)
        if (!post) return {
            code:ResultCode.NotFound,
            errorMessage:`Not found postId: ${postId}`,
            data:null
        }

            //создается структура одного документа-коментария
        // ее  буду в базу  Коментариев помещать
        const commentatorInfo: CommentatorInfo = {
            userId,
            userLogin
        }

        const newCommentForPost: Comment = {
            content,
            commentatorInfo,
            createdAt: new Date().toISOString(),
            postId
        }


        const result = await commentsRepository.createComment(newCommentForPost)

        const idComment = result._id.toString()

        if(!idComment) return {
            code:ResultCode.NotFound,
            errorMessage:`Not found idComment: ${idComment} `,
            data:null
        }

        const newComment = await commentsQueryRepository.findCommentById(idComment)


        return {
            code:ResultCode.Success,
            errorMessage:'',
            data:newComment
        }
    },


    async setOrUpdateLikeStatus(
        postId: string,
        statusLike: StatusLike,
        userData:OutputUser) {

        const userId = userData.id
        const date = new Date().toISOString()

        /*    ищу в базе Лайков  один документ   по
                двум полям userData.userId и postId---*/
        const document = await LikesPostsRepository.findDocumentByUserIdAndPostId(
            postId,
            userId
        )

        /*Если документа  нет тогда надо cоздать
         новый документ и добавить в базу*/

        if(!document){
            const documentForLikePostCollection:LikesPostsType = {
                postId,
                userId: userId,
                login: userData.login,
                addedAt:date,
                statusLike
            }
            return LikesPostsRepository.addNewDocument(documentForLikePostCollection)
        }

        /*Если документ есть тогда надо изменить
      statusLike на приходящий и установить теперещнюю дату
       установки статуса лайка*/
return LikesPostsRepository.setNewAddedAtNewStatusLike(userId,postId,date,statusLike)
    },

}