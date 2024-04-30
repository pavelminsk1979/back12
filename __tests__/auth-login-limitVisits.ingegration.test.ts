import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {visitLimitService} from "../src/servisces/visitLimitService";
import mongoose from "mongoose";
import * as dotenv from "dotenv";


dotenv.config()

const  req = supertest(app)

describe('limit visits for login',()=>{

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




const visitLimitMethod = visitLimitService.checkLimitVisits;

const IP = '1111'
    const URL='12345'
    const date = new Date()

    it("limit visits for login",async ()=>{
        const result1 = await visitLimitMethod(IP, URL, date)
        const result2 = await visitLimitMethod(IP, URL, date)
        const result3 = await visitLimitMethod(IP, URL, date)
        const result4 = await visitLimitMethod(IP, URL, date)
        const result5 = await visitLimitMethod(IP, URL, date)
        const result6 = await visitLimitMethod(IP, URL, date)

        //return error 429 if  more than  5 request  during  10sec

        expect(result1).toEqual(false)
        expect(result5).toEqual(false)
        expect(result6).toEqual(true)
    })



})
