import {CreateAndUpdateBlogModel} from "../models/CreateAndUpdateBlogModel";
import {Blog} from "../allTypes/blogTypes";
import {blogsRepository} from "../repositories/blogs-repository-mongoDB";
import {blogQueryRepository} from "../repositories/blog-query-repository";
import {CreatePostInputModel, Post} from "../allTypes/postTypes";
import {postsRepository} from "../repositories/posts-repository-mongoDB";
import {postQueryRepository} from "../repositories/post-query-repository";


export const blogsSevrice = {

    async createBlog(requestBodyBlog: CreateAndUpdateBlogModel) {
        const {name, description, websiteUrl} = requestBodyBlog

        const newBlog: Blog = {
            name,
            description,
            websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString()
        }

        const result = await blogsRepository.createBlog(newBlog)

        if (result._id.toString()) {
            return {
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
                isMembership: newBlog.isMembership,
                createdAt: newBlog.createdAt,
                id: result._id.toString()
            }
        } else {
            return null
        }
    },

    async createPostFromBlog(createPostModel: CreatePostInputModel, blogId: string) {

        const {title, shortDescription, content} = createPostModel

        const blog = await blogQueryRepository.findBlogById(blogId)

        if (!blog) {
            return null
        }

        const newPost: Post = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        const createdPost = await postsRepository.createPost(newPost)

        if (!createdPost) {
            return null
        }

        const post = await postQueryRepository.findPostById(createdPost._id.toString())

        if (!post) {
            return null
        }
        return post

    },


    async updateBlog(id: string, requestBodyBlog: CreateAndUpdateBlogModel) {
        return blogsRepository.updateBlog(id, requestBodyBlog)

    },


    async deleteBlogById(id: string) {

        return blogsRepository.deleteBlogById(id)
    }
}

