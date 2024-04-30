import {body} from "express-validator";
import {StatusLike} from "../../allTypes/LikesCommentsTypes";



export const likeStatusValidation = body('likeStatus')
    .exists()
    .trim()
    .custom((value) => Object.values(StatusLike).includes(value))/*Object.values(StatusLike) для получения массива всех значений из enum StatusLike. Затем мы используем includes() для проверки, содержится ли значение likeStatus в этом массиве*/
    .withMessage('Incorrect content for likeStatus')