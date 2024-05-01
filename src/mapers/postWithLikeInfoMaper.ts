import {WithId} from "mongodb";
import {OutputPostWithLikeInfo, Post} from "../allTypes/postTypes";
import {StatusLike} from "../allTypes/LikesCommentsTypes";

export const postWithLikeInfoMaper=(post:WithId<Post>):OutputPostWithLikeInfo=>{
    return{
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        id: post._id.toString(),
        extendedLikesInfo:{
            likesCount:0,
            dislikesCount:0,
            myStatus:StatusLike.None,
            newestLikes:[
                {
                    addedAt:'',
                    userId:'',
                    login:''
                }
            ]
        }
    }
}