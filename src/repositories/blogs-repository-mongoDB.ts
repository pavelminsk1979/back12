import {CreateAndUpdateBlogModel} from "../models/CreateAndUpdateBlogModel";
import { blogsModel} from "../db/mongoDb";
import {ObjectId} from "mongodb";
import {Blog} from "../allTypes/blogTypes";


export const blogsRepository = {

    async createBlog(newBlog: Blog) {

        const result = await blogsModel.create(newBlog)
        return result
    },


    async updateBlog(id: string, requestBodyBlog: CreateAndUpdateBlogModel) {

        const {name, description, websiteUrl} = requestBodyBlog

        const result = await blogsModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })

        return !!result.matchedCount

    },


    async deleteBlogById(id: string) {

        const result = await blogsModel.deleteOne({_id: new ObjectId(id)})

        return !!result.deletedCount
    }
}

