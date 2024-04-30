import dotenv from 'dotenv'
import {Blog} from "../allTypes/blogTypes";
import {Post} from "../allTypes/postTypes";
import {User} from "../allTypes/userTypes";
import {Comment} from "../allTypes/commentTypes";
import {Visit} from "../allTypes/visitTypes";
import {UsersDevices} from "../allTypes/usersDevicesTypes";
import mongoose from 'mongoose'
import {LikeComment, StatusLike} from "../allTypes/LikesCommentsTypes";


dotenv.config()


const mongoUri = process.env.MONGO_URL;


const userScheme = new mongoose.Schema<User>({
    passwordHash: String,
    login: String,
    email: String,
    createdAt: Date,
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean
    },
    blackListRefreshToken: [String]
})


export const usersModel = mongoose.model<User>('users', userScheme);


const postScheme = new mongoose.Schema<Post>({
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
})
export const postssModel = mongoose.model<Post>('posts', postScheme);


const blogScheme = new mongoose.Schema<Blog>({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean,
})
export const blogsModel = mongoose.model<Blog>('blogs', blogScheme);


const commentScheme = new mongoose.Schema<Comment>({
    content: String,
    createdAt: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    postId: String,

})
export const commentsModel = mongoose.model<Comment>('comments', commentScheme);


const visitScheme = new mongoose.Schema<Visit>({
    IP: String,
    URL: String,
    date: Date,

})
export const visitsModel = mongoose.model<Visit>('visits', visitScheme);


const usersDeviceScheme = new mongoose.Schema<UsersDevices>({
    issuedAt: Date,
    expDate: Date,
    deviceId: String,
    nameDevice: String,
    userId: String,
    ip: String,
})
export const usersDevicesModel = mongoose.model<UsersDevices>('users_devices', usersDeviceScheme);


const LikesCommentsScheme = new mongoose.Schema({
    commentId: String,
    userId: String,
    statusLike: {
        type: String,
        enum: Object.values(StatusLike)
    },
});

export const LikesCommentsModel = mongoose.model<LikeComment>('likes_comments', LikesCommentsScheme);


export async function runDb() {
    try {
        if (!mongoUri) {
            throw new Error('URL not find(file mongoDb')
        }
        await mongoose.connect(mongoUri, {dbName: process.env.DB_NAME});

        console.log('Connected successful with mongoDB')

    } catch (e) {
        console.log(e + 'Connected ERROR with mongoDB')

        await mongoose.disconnect()
    }
}