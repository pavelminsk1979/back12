import {OutputPost, PaginationWithOutputPosts, Post, SortDataPost} from "../allTypes/postTypes";
import { postssModel} from "../db/mongoDb";
import {postMaper} from "../mapers/postMaper";
import {ObjectId} from "mongodb";


export const postQueryRepository = {

    async getPosts(sortDataPost: SortDataPost): Promise<PaginationWithOutputPosts<OutputPost>> {

        const {sortBy, sortDirection, pageNumber, pageSize} = sortDataPost

        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

        const posts = await postssModel
            .find({})
            .sort({ [sortBy]: sortDirectionValue } )
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec()

        const totalCount = await postssModel.countDocuments({})

        const pagesCount = Math.ceil(totalCount / pageSize)


        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMaper)
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
}