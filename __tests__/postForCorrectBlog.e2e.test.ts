import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

const  req = supertest(app)

describe('/blogs',()=>{

    beforeAll(async ()=>{

        const mongoUri = process.env.MONGO_URL ;

        if(!mongoUri){
            throw new Error('URL not find(file mongoDb/1')
        }

        await mongoose.connect(mongoUri
            ,{ dbName:process.env.DB_NAME });

        await req
            .delete ('/testing/all-data')
    })

    afterAll(async () => {
        await mongoose.disconnect()
    });


    let idNewBlog:string

    let incorrectBlogId='63189b06003380064c4193be'

    const loginPasswordBasic64='YWRtaW46cXdlcnR5'

    it('POST create newBlog',async ()=>{
        const res =await req
            .post('/blogs')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ name: 'name',
                description: 'description',
                websiteUrl:'https://www.outue.com/'})
            .expect(STATUS_CODE.CREATED_201)

        idNewBlog=res.body.id

        expect(res.body.name).toEqual('name')
        expect(res.body.description).toEqual('description')
        expect(res.body.websiteUrl).toEqual('https://www.outue.com/')
    })

    it('Get posts for correct  blog',async ()=>{
        const res = await req
            .get(`/blogs/${idNewBlog}/posts`)
            .expect(STATUS_CODE.SUCCESS_200)

        expect(res.body).toEqual({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })

    })


    it('Get posts for incorrect  blog',async ()=>{
        const res = await req
            .get(`/blogs/${incorrectBlogId}/posts`)
            .expect(STATUS_CODE.NOT_FOUND_404)

    })


    it(' POST   create  newPost  for exits Blog)', async ()=> {
        const res =await req
            .post(`/blogs/${idNewBlog}/posts`)
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ title: 'title',
                shortDescription: 'shortDescription',
                content:'content' })
            .expect(STATUS_CODE.CREATED_201)

const createdPost = res.body
        //console.log(createdPost)
        expect(createdPost.title).toEqual('title')

    })


    it('Get posts for correct  blog',async ()=>{
        const res = await req
            .get(`/blogs/${idNewBlog}/posts`)
            .expect(STATUS_CODE.SUCCESS_200)
    })



})