import express, {Request, Response} from 'express'
import { videosRoute} from "./routes/videos-route";
import {blogsRoute} from "./routes/blogs-route";
import {postsRoute} from "./routes/posts-route";
import {DB} from "./db/db";
import {
    blogsModel, commentsModel, LikesCommentsModel,
    postssModel, usersDevicesModel,
    usersModel, visitsModel

} from "./db/mongoDb";
import {STATUS_CODE} from "./common/constant-status-code";
import {usersRoute} from "./routes/users-route";
import {authRoute} from "./routes/auth-route";
import {commentsRoute} from "./routes/comments-route";
import cookieParser from "cookie-parser";
import {securityDevicesRoute} from "./routes/securityDevices-route";


export const app = express()


app.use(express.json())

app.use(cookieParser())

app.use('/videos', videosRoute)
app.use('/blogs', blogsRoute)
app.use('/posts', postsRoute)
app.use('/users', usersRoute)
app.use('/auth', authRoute)
app.use('/comments',commentsRoute)
app.use('/security',securityDevicesRoute)


app.delete('/testing/all-data', async (req: Request, res: Response) => {
    DB.videos.length = 0
   await postssModel.deleteMany({})
   await blogsModel.deleteMany({})
    await usersModel.deleteMany({})
    await commentsModel.deleteMany({})
    await visitsModel.deleteMany({})
    await usersDevicesModel.deleteMany({})
    await LikesCommentsModel.deleteMany({})
    res.sendStatus(STATUS_CODE.NO_CONTENT_204)
})