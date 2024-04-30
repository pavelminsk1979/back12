import { blogsModel, postssModel} from "../db/mongoDb";
import {blogMaper} from "../mapers/blogMaper";
import {ObjectId} from "mongodb";
import {OutputBlog, PaginationWithOutputBlog, SortData} from "../allTypes/blogTypes";
import {postMaper} from "../mapers/postMaper";


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
            .sort({ [sortBy]: sortDirectionValue } )
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


    async getPostsForCorrectBlog(sortDataGetPostsForBlogs: any, blogId: string) {

        const {sortBy, sortDirection, pageNumber, pageSize} = sortDataGetPostsForBlogs


        const blog = await blogQueryRepository.findBlogById(blogId)

        if (!blog) {
            return null
        }

        const filter = {blogId}

        const posts = await postssModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec()

        const totalCount = await postssModel.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount / pageSize)


        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMaper)
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