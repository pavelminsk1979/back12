import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";
import mongoose from "mongoose";
import * as dotenv from "dotenv";


dotenv.config()

const  req = supertest(app)

describe('/posts',()=>{

    const loginPasswordBasic64='YWRtaW46cXdlcnR5'

    let idNewBlog:string

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

    it('get content posts',async ()=>{
        const res = await req
            .get('/posts')
            .expect(STATUS_CODE.SUCCESS_200)

        expect(res.body).toEqual({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })

    })



    it('- POST does not create the newPost with incorrect data', async ()=> {
        const res =await req
            .post('/posts')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({title:'titletitletitletitletitletitletitletitle',
                shortDescription:'length_101-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxJyQgGnlX5sP3aW3RlaRSQx',
                content:'222content',
                blogId:'65d3bad29d85d6c63bd01a86'})
            .expect(STATUS_CODE.BAD_REQUEST_400)

        expect(res.body).toEqual({  errorsMessages: [
                { message: 'Incorrect title', field: 'title' },
                { message: 'Incorrect shortDescription', field: 'shortDescription' },
                { message: 'Incorrect blogId', field: 'blogId' },
            ]})


        const getRes = await req.get('/posts/')
        expect(getRes.body).toEqual({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })



    let idNewPost:string

    it('POST create newPost',async ()=>{
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



    it('Get post bu incorrect id',async ()=>{
        const res =await req
            .get('/posts/65d3bad29d85d6c63bd01a86')
        .expect(STATUS_CODE.NOT_FOUND_404)

    })


    it('get content posts',async ()=>{
        const res = await req
            .get('/posts')
            .expect(STATUS_CODE.SUCCESS_200)
    })

    it('Get post bu correct id',async ()=>{
        const res =await req
            .get('/posts/'+idNewPost)
             .expect(STATUS_CODE.SUCCESS_200)

        expect(res.body.title).toEqual('title')
        expect(res.body.shortDescription).toEqual('shortDescription')
        expect(res.body.content).toEqual('content')

    })


    it('- PUT post by incorrect ID ', async () => {

        await req
            .put('/posts/65d3bad29d85d6c63bd01a86')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ title: 'updateTitle',
                shortDescription: 'updateShortDescription',
                content:'updateContent',
                blogId:idNewBlog})
            .expect(STATUS_CODE.NOT_FOUND_404)

        const getRes =await req
            .get('/posts/')
        expect(getRes.body.items.length).toBe(1)
        expect(getRes.body.items[0].title).toEqual('title')
        expect(getRes.body.items[0].shortDescription)
            .toEqual('shortDescription')
        expect(getRes.body.items[0].content).toEqual('content')
        expect(getRes.body.items[0].blogId).toEqual(idNewBlog)
    })


    it('+ PUT post by correct ID ', async () => {

        await req
            .put('/posts/'+idNewPost)
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ title: 'updateTitle',
                shortDescription: 'updateShortDescription',
                content:'updateContent',
                blogId:idNewBlog})
            .expect(STATUS_CODE.NO_CONTENT_204)

        const getRes =await req
            .get('/posts/')
        expect(getRes.body.items.length).toBe(1)
        expect(getRes.body.items[0].title).toEqual('updateTitle')
        expect(getRes.body.items[0].shortDescription)
            .toEqual('updateShortDescription')
        expect(getRes.body.items[0].content).toEqual('updateContent')
        expect(getRes.body.items[0].blogId).toEqual(idNewBlog)
    })


    it(' Incorrect data -create post by correct ID   ', async () => {

        const res=await req
            .put('/posts/'+idNewPost)
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({title:'titletitletitletitletitletitletitletitle',
                shortDescription:'length_101-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx',
                content:'222content',
                blogId:'65d3bad29d85d6c63bd01a86'})
            .expect(STATUS_CODE.BAD_REQUEST_400)
        expect(res.body).toEqual({  errorsMessages: [
                { message: 'Incorrect title', field: 'title' },
                { message: 'Incorrect shortDescription', field: 'shortDescription' },
                { message: 'Incorrect blogId', field: 'blogId' },
            ]})

        const getRes =await req
            .get('/posts/')
        expect(getRes.body.items.length).toBe(1)
        expect(getRes.body.items[0].title).toEqual('updateTitle')
        expect(getRes.body.items[0].shortDescription)
            .toEqual('updateShortDescription')
        expect(getRes.body.items[0].content).toEqual('updateContent')
        expect(getRes.body.items[0].blogId).toEqual(idNewBlog)
    })



    it('- DELETE post by incorrect ID', async () => {
        await req
            .delete('/posts/65d3bad29d85d6c63bd01a86')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .expect(STATUS_CODE.NOT_FOUND_404)

        const getRes =  await req
            .get('/posts')
        expect(getRes.body.items.length).toBe(1)
        expect(getRes.body.items[0].title).toEqual('updateTitle')
        expect(getRes.body.items[0].shortDescription)
            .toEqual('updateShortDescription')
        expect(getRes.body.items[0].content).toEqual('updateContent')
        expect(getRes.body.items[0].blogId).toEqual(idNewBlog)

    })


    it('+ DELETE post by correct ID', async () => {
        await req
            .delete('/posts/'+idNewPost)
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .expect(STATUS_CODE.NO_CONTENT_204)

        const getRes =  await req
            .get('/posts')
        expect(getRes.body.items.length).toBe(0)
    })


})