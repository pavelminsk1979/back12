import {body} from "express-validator";
import {blogQueryRepository} from "../../repositories/blog-query-repository";

const findValue=async (value:string)=>{
   let blog = await blogQueryRepository.findBlogById(value)
    if(blog){return blog.id}
    return null
}
export const blogIdValidationPosts = body('blogId')
    .exists()
    .trim()
    .custom(async (value) => {
        const result = await findValue(value)
        if (result === null) {
            throw new Error('Incorrect blogId');
        }
        return true;
    })
    .withMessage('Incorrect blogId')


