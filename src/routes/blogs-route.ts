import { Response, Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware/authMiddleware";
import {nameValidationBlogs} from "../middlewares/blogsMiddelwares/nameValidationBlogs";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";
import {descriptionValidationBlogs} from "../middlewares/blogsMiddelwares/descriptionValidationBlogs";
import {websiteUrlValidationBlog} from "../middlewares/blogsMiddelwares/websiteUrlValidationBlog";
import {RequestWithParams} from "../allTypes/RequestWithParams";
import {IdStringGetAndDeleteModel} from "../models/IdStringGetAndDeleteModel";
import {RequestWithBody} from "../allTypes/RequestWithBody";
import {CreateAndUpdateBlogModel} from "../models/CreateAndUpdateBlogModel";
import {STATUS_CODE} from "../common/constant-status-code";
import {RequestWithParamsWithBody} from "../allTypes/RequestWithParamsWithBody";
import {blogsSevrice} from "../servisces/blogs-service";
import {blogQueryRepository} from "../repositories/blog-query-repository";
import {RequestWithQuery} from "../allTypes/RequestWithQuery";
import {CreatePostFromCorrectBlogInputModel, GetQueryBlogInputModal, QueryBlogInputModal} from "../allTypes/blogTypes";
import {titleValidationPosts} from "../middlewares/postsMiddlewares/titleValidationPosts";
import {shortDescriptionValidationPosts} from "../middlewares/postsMiddlewares/shortDescriptionValidationPosts";
import {contentValidationPosts} from "../middlewares/postsMiddlewares/contentValidationPosts";
import {ParamBlogId} from "../allTypes/ParamBlogIdInputModel";
import {ObjectId} from "mongodb";
import {RequestWithParamsWithQuery} from "../allTypes/RequestWithParamsWithQuery";



export const blogsRoute = Router({})

const postValidationBlogs = () => [nameValidationBlogs, descriptionValidationBlogs, websiteUrlValidationBlog]

const validatorCreatePostForCorrectBlog = ()=>[titleValidationPosts,shortDescriptionValidationPosts,contentValidationPosts]


blogsRoute.get('/', async (req: RequestWithQuery<QueryBlogInputModal>, res: Response) => {
    const sortData = {
        searchNameTerm: req.query.searchNameTerm ?? null,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    }
    const blogs = await blogQueryRepository.getBlogs(sortData)
    res.status(STATUS_CODE.SUCCESS_200).send(blogs)
})


blogsRoute.get('/:id', async (req: RequestWithParams<IdStringGetAndDeleteModel>, res: Response) => {
    const blog = await blogQueryRepository.findBlogById(req.params.id)
    if (blog) {
        res.status(STATUS_CODE.SUCCESS_200).send(blog)
    } else {
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }

})


blogsRoute.get('/:blogId/posts', async (req: RequestWithParamsWithQuery<ParamBlogId,GetQueryBlogInputModal>, res: Response) => {

    const blogId = req.params.blogId

    if(!ObjectId.isValid(blogId)){
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        return
    }

    const sortDataGetPostsForBlogs = {
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    }

    const posts = await blogQueryRepository.getPostsForCorrectBlog(sortDataGetPostsForBlogs,blogId)


    if(!posts){
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        return
    }

    res.status(STATUS_CODE.SUCCESS_200).send(posts)

})



blogsRoute.post('/', authMiddleware, postValidationBlogs(), errorValidationBlogs, async (req: RequestWithBody<CreateAndUpdateBlogModel>, res: Response) => {
    const newBlog = await blogsSevrice.createBlog(req.body)
    if (newBlog) {
        res.status(STATUS_CODE.CREATED_201).send(newBlog)
    } else {
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})



blogsRoute.post('/:blogId/posts', authMiddleware, validatorCreatePostForCorrectBlog(), errorValidationBlogs, async (req: RequestWithParamsWithBody<ParamBlogId,CreatePostFromCorrectBlogInputModel>, res: Response) => {

    const blogId = req.params.blogId

    if(!ObjectId.isValid(blogId)){
        res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        return
    }

    const post = await blogsSevrice.createPostFromBlog(req.body,blogId)

    if(!post){
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        return
    }

    res.status(STATUS_CODE.CREATED_201).send(post)

})


blogsRoute.put('/:id', authMiddleware, postValidationBlogs(), errorValidationBlogs, async (req: RequestWithParamsWithBody<IdStringGetAndDeleteModel, CreateAndUpdateBlogModel>, res: Response) => {

    const isUpdateBlog = await blogsSevrice.updateBlog(req.params.id, req.body)

    if (isUpdateBlog) {
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    } else {
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})


blogsRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<IdStringGetAndDeleteModel>, res: Response) => {
    const isBlogDelete = await blogsSevrice.deleteBlogById(req.params.id)
    if (isBlogDelete) {
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    } else {
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})

