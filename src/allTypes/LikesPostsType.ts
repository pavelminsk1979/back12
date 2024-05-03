import {StatusLike} from "./LikesCommentsTypes";

export type LikesPostsType={
    postId:string,//из url адреса
    userId: string,// из AccessToken
    login: string,// из AccessToken
    addedAt:string,
    statusLike:StatusLike //из body адреса
}



