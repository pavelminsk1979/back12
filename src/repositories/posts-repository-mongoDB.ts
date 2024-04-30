import {CreateAndUpdatePostModel} from "../models/CreateAndUpdatePostModel";
import { postssModel} from "../db/mongoDb";
import {Post} from "../allTypes/postTypes";
import {ObjectId} from "mongodb";




export const postsRepository = {


    async createPost(newPost: Post) {
        const result = await postssModel.create(newPost)
        return result

    },


    async updatePost(id: string, requestBodyPost: CreateAndUpdatePostModel) {

        const {title, blogId, content, shortDescription} = requestBodyPost

        const result = await postssModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: title,
                blogId: blogId,
                content: content,
                shortDescription: shortDescription
            }
        })

        return !!result.matchedCount
    },


    async deletePostById(id: string) {

        const result = await postssModel.deleteOne({_id: new ObjectId(id)})

        return !!result.deletedCount
    }

}