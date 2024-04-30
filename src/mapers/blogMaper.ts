import {WithId} from "mongodb";
import {Blog, OutputBlog} from "../allTypes/blogTypes";


export const blogMaper = (blog:WithId<Blog>):OutputBlog => {
    return {
        id:blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMembership:blog.isMembership,
        createdAt:blog.createdAt
    }
}