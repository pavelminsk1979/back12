import {commentsModel, LikesCommentsModel} from "../../db/mongoDb";
import {ObjectId} from "mongodb";
import {commentMaper} from "../../mapers/commentMaper";
import { SortDataGetCoomentsForCorrectPost} from "../../allTypes/commentTypes";
import {commentsMaperWithInfoLikeComment} from "../../mapers/commentsMaperWithInfoLikeComment";




export const commentsQueryRepository = {

    async findCommentById(id: string) {

        const comment = await commentsModel.findOne({_id: new ObjectId(id)})

        if(!comment) return null

        return commentMaper(comment)
    },


    async getCommentsForCorrectPost(
        postId:string,
        sortData:SortDataGetCoomentsForCorrectPost,
        userId:string|null){


        const {sortBy,
            sortDirection,
            pageNumber,
            pageSize} = sortData


        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

        const arrayDocumentsComments = await commentsModel
            .find({postId})
            .sort({ [sortBy]: sortDirectionValue } )
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec()

        const totalCount = await commentsModel.countDocuments({postId})

        const pagesCount = Math.ceil(totalCount / pageSize)



        //arrayDocumentsComments - это массив коментариев для одного
        // корректного поста и в каждом документе
        //уникальная _id new ObjectId-это айдишка коментария
            //получу массив айдишек  - [ '6628d4bcb6ea72bda3f934e8', '6628d4bcb6ea72bda3f934d9' ]

        const arrayIdComents = arrayDocumentsComments.map(e=>e._id.toString())

        //console.log(arrayIdComents)


        /* из базы из колекции лайковКоментариев достаю только те документы
         у которых commentId совпадает с
         айдишками из  массиве arrayIdComents*/
        const arrayDocumentsFromLikeCollection = await LikesCommentsModel.find({ commentId: { $in: arrayIdComents } });

            //console.log(arrayDocumentsFromLikeCollection)



        // массив со всеми свойствами согласно SWAGER
        const arrayComments = commentsMaperWithInfoLikeComment(
            arrayDocumentsComments
            ,userId,
            arrayDocumentsFromLikeCollection)
        //console.log(arrayComments)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: arrayComments
        }
    }
}