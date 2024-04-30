

export enum StatusLike {
    None = 'None',
    Like = 'Like',
    Dislike  = 'Dislike'
}

export type LikeComment = {
    commentId:string //  из url адреса
    userId: string // из AccessToken
    statusLike:StatusLike  // из url адреса
}