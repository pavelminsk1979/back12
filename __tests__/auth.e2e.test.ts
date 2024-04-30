import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";
import * as dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config()

const  req = supertest(app)

describe('/auth',()=>{



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



    const loginPasswordBasic64='YWRtaW46cXdlcnR5'
    const loginNewUser ='300300'
    const passwordNewUser ='11111pasw'
    const emailNewUser ='palPel@mail.ru'

    it('POST create newUsers',async ()=>{
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



let ref = 2
let refreshTokenFIRST:string;
let jwtTokenFIRST:string=''
    it("input correct login and password and sign in (ok) and create FIRST  devace",async ()=>{
        const res =await req
            .post('/auth/login')
            .send({ loginOrEmail: loginNewUser,
                password: passwordNewUser})
            .set('user-agent', 'FIRSTLaptop')
            .expect(STATUS_CODE.SUCCESS_200)

            //console.log(res.body.accessToken)

                //console.log(res.headers['set-cookie']);

        const allCookies = res.headers['set-cookie'];
        refreshTokenFIRST = allCookies[0].split(';')[0].split('=')[1];

        //console.log('refreshTokenFIRST'+refreshTokenFIRST);

        jwtTokenFIRST=res.body.accessToken

        expect(res.body.accessToken).toEqual(jwtTokenFIRST)
    })




    it("missing  login ...400 ",async ()=>{
        const res =await req
            .post('/auth/login')
            .send({ loginOrEmail: '',
                password: passwordNewUser})

            .expect(STATUS_CODE.BAD_REQUEST_400)

    })


    it("incorrect  login ...401 ",async ()=>{
        const res =await req
            .post('/auth/login')
            .send({ loginOrEmail: '11',
                password: passwordNewUser})

            .expect(STATUS_CODE.UNAUTHORIZED_401)

    })






    it("me  request  (ok)",async ()=>{
        const res =await req
            .get('/auth/me')
            .set('Authorization', `Bearer ${jwtTokenFIRST}`)
            .expect(STATUS_CODE.SUCCESS_200)

    })


    let refreshTokenSECOND:string;
    let jwtTokenSECOND:string=''
    it("input correct login and password and sign in (ok) and create SECOND  devace",async ()=>{
        const res =await req
            .post('/auth/login')
            .send({ loginOrEmail: loginNewUser,
                password: passwordNewUser})
            .set('user-agent', 'SECONDPhone')
            .expect(STATUS_CODE.SUCCESS_200)

        //console.log(res.body.accessToken)

        //console.log(res.headers['set-cookie']);

        const allCookies = res.headers['set-cookie'];
        refreshTokenSECOND = allCookies[0].split(';')[0].split('=')[1];

        //console.log(refreshTokenSECOND);

        jwtTokenSECOND=res.body.accessToken

        expect(res.body.accessToken).toBeTruthy()
    })

    it("ОК ",async ()=>{
        const res =await req
            .post('/auth/login')
            .send({ loginOrEmail: loginNewUser,
                password: passwordNewUser})

            .expect(STATUS_CODE.SUCCESS_200)

    })


    it("too many request...429 ",async ()=>{
        const res =await req
            .post('/auth/login')
            .send({ loginOrEmail: loginNewUser,
                password: passwordNewUser})

            .expect(STATUS_CODE.TOO_MANY_REQUESTS_429)

    })



    it("get devides one user",async ()=>{
        const res =await req
            .get('/security/devices')
            .set('Cookie', `refreshToken=${refreshTokenFIRST}`)

            .expect(STATUS_CODE.SUCCESS_200)

        //console.log(res.body)

    })



    it("logout",async ()=>{
        const res =await req
            .post('/auth/logout')
            .set('Cookie', `refreshToken=${refreshTokenFIRST}`)

            .expect(STATUS_CODE.NO_CONTENT_204)

    })

/*    it("logout befor 20sec",async ()=>{
        const res =await req
            .post('/auth/logout')
            .set('Cookie', `refreshToken=${refreshTokenFIRST}`)

            .expect(STATUS_CODE.UNAUTHORIZED_401)

    })*/



/*    it("should return two token (accessToken and refreshToken",async ()=>{
        const res =await req
            .post('/auth/refresh-token')
            .set('Cookie', `refreshToken=${refreshTokenFIRST}`)
            .expect(STATUS_CODE.SUCCESS_200)
        console.log(res.body)
        console.log(res.headers['set-cookie']);


    })*/

})