
import {NewOutputComment} from "../allTypes/commentTypes";




export const commentMaper = (comment:any):NewOutputComment => {
    return {
        id:comment._id.toString(),
        content: comment.content,
        createdAt: comment.createdAt,
        commentatorInfo: {
            userId:comment.commentatorInfo.userId,
            userLogin:comment.commentatorInfo.userLogin
        },
        "likesInfo": {
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": "None"
        }
    }
}