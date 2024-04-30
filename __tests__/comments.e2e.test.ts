import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";
import mongoose from "mongoose";
import * as dotenv from "dotenv";


dotenv.config()

const  req = supertest(app)

describe('/comments',()=>{

    let idNewBlog:string

    const loginPasswordBasic64='YWRtaW46cXdlcnR5'


    beforeAll(async ()=>{

        const mongoUri = process.env.MONGO_URL ;

        if(!mongoUri){
            throw new Error('URL not find(file mongoDb/1')
        }

        await mongoose.connect(mongoUri
            ,{ dbName:process.env.DB_NAME });

        await req
            .delete ('/testing/all-data')

        const createRes =await req
            .post('/blogs')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ name: 'nameBlog',
                description: 'descriptionBlog',
                websiteUrl:'https://www.outue.Blog/'})
            .expect(STATUS_CODE.CREATED_201)
        idNewBlog=createRes.body.id
        //console.log(idNewBlog)
    })


    afterAll(async () => {
        await mongoose.disconnect()
    });




    const loginNewUser ='300300'
    const passwordNewUser ='11111pasw'
    const emailNewUser ='palPel@mail.ru'

    it(' create newUsers',async ()=>{
        const res =await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ login: loginNewUser,
                password: passwordNewUser,
                email:emailNewUser})
            .expect(STATUS_CODE.CREATED_201)

        expect(res.body.login).toEqual(loginNewUser)
        expect(res.body.email).toEqual(emailNewUser)
    })


let jwtToken=''
    it("input correct login and password and sign in (ok)",async ()=>{
        const res =await req
            .post('/auth/login')
            .send({ loginOrEmail: loginNewUser,
                password: passwordNewUser})
            .expect(STATUS_CODE.SUCCESS_200)

            // console.log(res.body.accessToken)
        jwtToken=res.body.accessToken

        expect(res.body.accessToken).toBeTruthy()
    })


    const loginSecondUser ='100100'
    const passwordSecondUser ='55555pasw'
    const emailSecondUser ='SecondUs@mail.ru'

    it(' create secondUsers',async ()=>{
        const res =await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ login: loginSecondUser,
                password: passwordSecondUser,
                email:emailSecondUser})
            .expect(STATUS_CODE.CREATED_201)

        expect(res.body.login).toEqual(loginSecondUser)
        expect(res.body.email).toEqual(emailSecondUser)
    })



    let jwtTokenSecond=''
    it("input correct login and password and sign in (ok)",async ()=>{
        const res =await req
            .post('/auth/login')
            .send({ loginOrEmail: loginSecondUser,
                password: passwordSecondUser})
            .expect(STATUS_CODE.SUCCESS_200)

        // console.log(res.body.accessToken)
        jwtTokenSecond=res.body.accessToken

        expect(res.body.accessToken).toBeTruthy()
    })



    it("me  request  (ok)",async ()=>{
        const res =await req
            .get('/auth/me')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(STATUS_CODE.SUCCESS_200)

    })


    let idNewPost:string

    it(' create newPost',async ()=>{
        const res =await req
            .post('/posts')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ title: 'title',
                shortDescription: 'shortDescription',
                content:'content',
                blogId:idNewBlog})
            .expect(STATUS_CODE.CREATED_201)

        idNewPost=res.body.id

        expect(res.body.title).toEqual('title')
        expect(res.body.shortDescription).toEqual('shortDescription')
        expect(res.body.content).toEqual('content')
    })


    it(" create newComment for exist  post",async ()=>{
        const res =await req
            .post(`/posts/${idNewPost}/comments`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({content:'content for comments for post'})
            .expect(STATUS_CODE.CREATED_201)
        //console.log(res.body)

    })



    it("  incorrect postId - create newComment for exist  post ",async ()=>{
        const res =await req
            .post(`/posts/1/comments`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({content:'content for comments for post'})
            .expect(STATUS_CODE.NOT_FOUND_404)
        //console.log(res.body)
    })


    it("  incorrect content - create newComment for exist  post ",async ()=>{
        const res =await req
            .post(`/posts/${idNewPost}/comments`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({content:''})
            .expect(STATUS_CODE.BAD_REQUEST_400)
        //console.log(res.body)


        expect(res.body).toEqual({  errorsMessages: [
                { message: 'Incorrect content for comment', field: 'content' }]})
    })



    it("  incorrect jwtToken - create newComment for exist  post ",async ()=>{
        const res =await req
            .post(`/posts/${idNewPost}/comments`)
            .set('Authorization', `Bearer 123`)
            .send({content:'yttuyt fghg65 gjitytrfyt ty6565'})
            .expect(STATUS_CODE.UNAUTHORIZED_401)
        //console.log(res.body)
    })

let commentId=''

    it(" create secondNewComment for exist  post",async ()=>{
        const res =await req
            .post(`/posts/${idNewPost}/comments`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({content:'secondNewComment secondNewComment'})
            .expect(STATUS_CODE.CREATED_201)
        //console.log(res.body)
        commentId=res.body.id

    })



    it(" get  all comment for exist  post",async ()=>{
        const res =await req
            .get(`/posts/${idNewPost}/comments`)
            .expect(STATUS_CODE.SUCCESS_200)

       // console.log(res.body.items)

        expect(res.body.items.length).toEqual(2)

    })


    it(" Incorrect PostId - get all comment ",async ()=>{
        const res =await req
            .get(`/posts/2/comments`)
            .expect(STATUS_CODE.NOT_FOUND_404)
    })




    it(" get  comment by correct  idComment",async ()=>{
        const res =await req
            .get(`/comments/${commentId}`)
            .expect(STATUS_CODE.SUCCESS_200)

         //console.log(res.body)
         //console.log(commentId)
         //console.log(jwtToken)

        expect(res.body.id).toEqual(commentId)
    })



    it(" incorrect idComment - get comment",async ()=>{
        await req
            .get(`/comments/6`)
            .expect(STATUS_CODE.NOT_FOUND_404)
    })




const updateContent = 'updateContent-updateContent'
    it(" Update content for comment. All data correct",async ()=>{
        await req
            .put(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({content:updateContent})
            .expect(STATUS_CODE.NO_CONTENT_204)

        const getRes =await req
            .get(`/comments/${commentId}`)
            .expect(STATUS_CODE.SUCCESS_200)

        //console.log(res.body)


        expect(getRes.body.content).toEqual(updateContent)

    })








    it("inValid idComment - delete comment ",async ()=>{
        const res =await req
            .delete(`/comments/6`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(STATUS_CODE.NOT_FOUND_404)

    })


    it("Not exist  idComment - delete comment ",async ()=>{
        const res =await req
            .delete(`/comments/63189b06003380064c4193be`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(STATUS_CODE.NOT_FOUND_404)

    })




    it("jwtTokenSecond - delete comment inpossible because comment don't belong this user ",async ()=>{
        const res =await req
            .delete(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${jwtTokenSecond}`)
            .expect(STATUS_CODE.FORBIDDEN_403)

    })



    it(" delete  comment by correct idComment",async ()=>{
        const res =await req
            .delete(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(STATUS_CODE.NO_CONTENT_204)

    })





})