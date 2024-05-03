import {ExtendedLikesInfo, NewestLikes, OutputPostWithLikeInfo, Post} from "../allTypes/postTypes";
import {LikesPostsType} from "../allTypes/LikesPostsType";
import {WithId} from "mongodb";
import {StatusLike} from "../allTypes/LikesCommentsTypes";


export const newPostMapper=(
    postDocument:WithId<Post>,
    documentLikePostAuthorisationUser:LikesPostsType|null,
    likesCount:number,
    dislikesCount:number,
    threeLatestDocumentWithStatusLike: LikesPostsType[],
):OutputPostWithLikeInfo=>{

    /*1 ЭТАП  создаю массив newestLikes type NewestLikes[]
     для возвращаемого на фронт документа type OutputPostWithLikeInfo */
    const  newestLikes=[]

    for(let i=0;i<threeLatestDocumentWithStatusLike.length; i++){
        const obj:LikesPostsType = threeLatestDocumentWithStatusLike[i]
        const entity : NewestLikes = {
            addedAt:obj.addedAt ,
            userId:obj.userId ,
            login:obj.login
        }
        newestLikes.push(entity)
    }
/*    if(threeLatestDocumentWithStatusLike.length===0){
        newestLikes.push({
            addedAt:'',
            userId:'',
            login:''})
    } else {
        for(let i=0;i<threeLatestDocumentWithStatusLike.length; i++){
            const obj:LikesPostsType = threeLatestDocumentWithStatusLike[i]
            const entity : NewestLikes = {
                addedAt:obj.addedAt ,
                userId:obj.userId ,
                login:obj.login
            }
            newestLikes.push(entity)
        }
    }*/

/*2 ЭТАП  -создаю обьект  extendedLikesInfo type ExtendedLikesInfo
    для возвращаемого на фронт документа type OutputPostWithLikeInfo*/

    const extendedLikesInfo:ExtendedLikesInfo={
        likesCount,
        dislikesCount,
        myStatus:documentLikePostAuthorisationUser
        ?documentLikePostAuthorisationUser.statusLike
            :StatusLike.None,
        newestLikes
    }



    /*3 ЭТАП СОЗДАЮ И возвращаю на фронт документ
    согластно Swager  type OutputPostWithLikeInfo*/

    return{
        title: postDocument.title,
        shortDescription: postDocument.shortDescription,
        content: postDocument.content,
        blogId: postDocument.blogId,
        blogName: postDocument.blogName,
        createdAt: postDocument.createdAt,
        id: postDocument._id.toString(),
        extendedLikesInfo
    }
}