import {Response, Router} from "express";
import {RequestWithBody} from "../allTypes/RequestWithBody";
import {CreateUserModel, IdUserModel, QueryUsersInputModal} from "../allTypes/userTypes";
import {authMiddleware} from "../middlewares/authMiddleware/authMiddleware";
import {loginValidationUsers} from "../middlewares/usersMiddlewares/loginValidationUsers";
import {passwordValidationUsers} from "../middlewares/usersMiddlewares/passwordValidationUsers";
import {emailValidationUsers} from "../middlewares/usersMiddlewares/emailValidationUsers";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";
import {usersService} from "../servisces/users-service";
import {STATUS_CODE} from "../common/constant-status-code";
import {RequestWithQuery} from "../allTypes/RequestWithQuery";
import {userQueryRepository} from "../repositories/users/user-query-repository";
import {RequestWithParams} from "../allTypes/RequestWithParams";


export const usersRoute = Router({})

const postValidationUsers = () => [loginValidationUsers, passwordValidationUsers, emailValidationUsers]


usersRoute.get('/', authMiddleware,async(req: RequestWithQuery<QueryUsersInputModal>, res: Response)=> {

const users = await userQueryRepository.getUsers(req.query)

     res.status(STATUS_CODE.SUCCESS_200).send(users)

})



usersRoute.post('/', authMiddleware, postValidationUsers(), errorValidationBlogs, async (req: RequestWithBody<CreateUserModel>, res: Response) => {

    try{

        const newUser = await usersService.createUser(req.body)

        if (newUser) {

            res.status(STATUS_CODE.CREATED_201).send(newUser)

        } else {
            res.sendStatus(STATUS_CODE.BAD_REQUEST_400)
        }
    } catch (error) {
        console.log('users-route.ts post /users' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }



})


usersRoute.delete('/:id', authMiddleware,async(req: RequestWithParams<IdUserModel>, res: Response) => {

    const isUserDelete = await usersService.deleteUserById(req.params.id)

    if(isUserDelete){
        return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    } else {
        return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }

})