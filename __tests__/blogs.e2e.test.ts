import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

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

    it('get content blogs',async ()=>{
        const res = await req
            .get('/blogs')
            .expect(STATUS_CODE.SUCCESS_200)
        //console.log(res.body)
        expect(res.body).toEqual({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })

    })


    const loginPasswordBasic64='YWRtaW46cXdlcnR5'

    it('- POST does not create the newBlog with incorrect data (no name, no description, no websiteUrl)', async ()=> {
        const res =await req
            .post('/blogs')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ name: '', description: '',websiteUrl:'' })
            .expect(STATUS_CODE.BAD_REQUEST_400)

        expect(res.body).toEqual({  errorsMessages: [
                { message: 'Incorrect name', field: 'name' },
                { message: 'Incorrect description', field: 'description' },
                { message: 'Incorrect websiteUrl', field: 'websiteUrl' },
            ]})


        const getRes = await req.get('/blogs/')
        expect(getRes.body).toEqual({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    let idNewBlog:string

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

    it('Get blog bu incorrect id',async ()=>{
        const res =await req
            .get('/blogs/65d3bad29d85d6c63bd81a86')
        .expect(STATUS_CODE.NOT_FOUND_404)

    })


    it('get content blogs',async ()=>{
        const res = await req
            .get('/blogs')
            .expect(STATUS_CODE.SUCCESS_200)
       // console.log(res.body)

    })

    it('Get blog bu correct id',async ()=>{
        const res =await req
            .get('/blogs/'+idNewBlog)
             .expect(STATUS_CODE.SUCCESS_200)
        //console.log(idNewBlog)
        //console.log(res.body)
         expect(res.body.name).toEqual('name')
         expect(res.body.description).toEqual('description')
         expect(res.body.websiteUrl).toEqual('https://www.outue.com/')
        expect(res.body.isMembership).toEqual(false)

    })


    it('- PUT blog by incorrect ID ', async () => {

        await req
            .put('/blogs/65d3bad29d85d6c63bd81a86')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ name: 'updateName',
                description: 'updateDescription',
                websiteUrl:'https://www.outue.updateCom/'})
            .expect(STATUS_CODE.NOT_FOUND_404)

        const getRes =await req
            .get('/blogs/')
       //console.log(getRes.body)
        expect(getRes.body.items.length).toBe(1)
        expect(getRes.body.items[0].name).toEqual('name')
        expect(getRes.body.items[0].description).toEqual('description')
        expect(getRes.body.items[0].id).toEqual(idNewBlog)
    })


    it('+ PUT blog by correct ID ', async () => {

        await req
            .put('/blogs/'+idNewBlog)
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ name: 'updateName',
                description: 'updateDescription',
                websiteUrl:'https://www.outue.updateCom/'})
            .expect(STATUS_CODE.NO_CONTENT_204)

        const getRes =await req
            .get('/blogs/')
        expect(getRes.body.items.length).toBe(1)
        expect(getRes.body.items[0].name).toEqual('updateName')
        expect(getRes.body.items[0].description).toEqual('updateDescription')
        expect(getRes.body.items[0].websiteUrl)
            .toEqual('https://www.outue.updateCom/')
    })


    it('- PUT blog by correct ID and incorrect data ', async () => {

        const res=await req
            .put('/blogs/'+idNewBlog)
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ name: 'updateNameupdateNameupdateNameupdateName',
                description: '',
                websiteUrl:'htt-updateCom'})
            .expect(STATUS_CODE.BAD_REQUEST_400)
        expect(res.body).toEqual({  errorsMessages: [
                { message: 'Incorrect name', field: 'name' },
                { message: 'Incorrect description', field: 'description' },
                { message: 'Incorrect websiteUrl', field: 'websiteUrl' },
            ]})

        const getRes =await req
            .get('/blogs/')
        expect(getRes.body.items[0].name).toEqual('updateName')
        expect(getRes.body.items[0].description).toEqual('updateDescription')
        expect(getRes.body.items[0].websiteUrl)
            .toEqual('https://www.outue.updateCom/')
    })



    it('- DELETE blog by incorrect ID', async () => {
        await req
            .delete('/blogs/65d3bad29d85d6c63bd81a86')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .expect(STATUS_CODE.NOT_FOUND_404)

        const getRes =  await req
            .get('/blogs')
        expect(getRes.body.items[0].name).toEqual('updateName')
        expect(getRes.body.items[0].description).toEqual('updateDescription')
        expect(getRes.body.items[0].websiteUrl)
            .toEqual('https://www.outue.updateCom/')

    })


    it('+ DELETE blog by correct ID', async () => {
        await req
            .delete('/blogs/'+idNewBlog)
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .expect(STATUS_CODE.NO_CONTENT_204)

        const getRes =  await req
            .get('/blogs')
        expect(getRes.body.items.length).toBe(0)
    })


})