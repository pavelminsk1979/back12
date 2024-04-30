import { usersModel} from "../../db/mongoDb";
import {ObjectId} from "mongodb";
import {userMaper} from "../../mapers/userMaper";
import {OutputUser, PaginationWithOutputUser, QueryUsersInputModal} from "../../allTypes/userTypes";
import {queryParamsValidationUsers} from "../../middlewares/usersMiddlewares/queryParamsValidationUsers";


export const userQueryRepository = {

    async findUserByLoginOrEmail(loginOrEmail: string) {

        const user = await usersModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        return user
    },


    async findUserById(id: string): Promise<OutputUser | null> {

        const user = await usersModel.findOne({_id: new ObjectId(id)})
        if (!user) return null

        return userMaper(user)
    },


    async getUsers(queryParams: QueryUsersInputModal): Promise<PaginationWithOutputUser<OutputUser>> {

        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        } = queryParamsValidationUsers(queryParams)

        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

        let filter: {/*it's type*/ $or: object[] } = {$or: []}

        if (searchLoginTerm) {
            filter.$or.push({
                login: {
                    $regex: searchLoginTerm,
                    $options: 'i'
                }
            })
        }

        if (searchEmailTerm) {
            filter.$or.push({
                email: {
                    $regex: searchEmailTerm,
                    $options: 'i',
                }
            })
        }

        const users = await usersModel
            .find(filter.$or.length ? filter : {})

            .sort({ [sortBy]: sortDirectionValue } )
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec()

        const totalCount = await usersModel.countDocuments(filter.$or.length ? filter : {})

        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(userMaper)
        }
    }
}


