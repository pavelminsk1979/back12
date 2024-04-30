import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";
import mongoose from "mongoose";


const req = supertest(app)

describe('securityDevices', () => {

    beforeAll(async () => {

        const mongoUri = process.env.MONGO_URL ;

        if(!mongoUri){
            throw new Error('URL not find(file mongoDb/1')
        }

        await mongoose.connect(mongoUri
            ,{ dbName:process.env.DB_NAME });

        await req
            .delete('/testing/all-data')
    })

    afterAll(async () => {
        await mongoose.disconnect()
    });


    const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5'
    const loginNewUser = '4321234'
    const passwordNewUser = '98766YUI'
    const emailNewUser = 'pavel@mail.ru'


    it('POST create newUsers', async () => {
        const res = await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                login: loginNewUser,
                password: passwordNewUser,
                email: emailNewUser
            })
            .expect(STATUS_CODE.CREATED_201)

        expect(res.body.login).toEqual(loginNewUser)
        expect(res.body.email).toEqual(emailNewUser)
    })


    let refreshTokenFIRSTLaptop: string;

    it("create device first", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginNewUser,
                password: passwordNewUser
            })
            .set('user-agent', 'FIRSTLaptop')
            .expect(STATUS_CODE.SUCCESS_200)


        const allCookies = res.headers['set-cookie'];
        refreshTokenFIRSTLaptop = allCookies[0].split(';')[0].split('=')[1];
        //console.log('refreshTokenFIRST'+refreshTokenFIRST);

    })


    let refreshTokenSecondLaptop: string;

    it("create device second", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginNewUser,
                password: passwordNewUser
            })
            .set('user-agent', 'SecondLaptop')
            .expect(STATUS_CODE.SUCCESS_200)


        const allCookies = res.headers['set-cookie'];
        refreshTokenSecondLaptop = allCookies[0].split(';')[0].split('=')[1];
    })


    let idDeviceFIRSTLaptop: string

    it("get devices one user", async () => {
        const res = await req
            .get('/security/devices')
            .set('Cookie', `refreshToken=${refreshTokenFIRSTLaptop}`)

            .expect(STATUS_CODE.SUCCESS_200)

        idDeviceFIRSTLaptop = res.body[0].deviceId

        //console.log(res.body)
       // console.log('idDeviceFIRSTLaptop' + ' ' + idDeviceFIRSTLaptop)

    })


    const loginUser = '55555555'
    const passwordUser = '555555YUI'
    const emailUser = 'potapov@mail.ru'


    it('POST create Users', async () => {
        const res = await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                login: loginUser,
                password: passwordUser,
                email: emailUser
            })
            .expect(STATUS_CODE.CREATED_201)

    })


    let refreshTokenPhone: string;

    it("create device FIRSTPhone", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginUser,
                password: passwordUser
            })
            .set('user-agent', 'Phone')
            .expect(STATUS_CODE.SUCCESS_200)


        const allCookies = res.headers['set-cookie'];
        refreshTokenPhone = allCookies[0].split(';')[0].split('=')[1];
        //console.log('refreshTokenFIRST'+refreshTokenFIRST);

    })

    let idDevicePhone: string

    it("get devices one user", async () => {
        const res = await req
            .get('/security/devices')
            .set('Cookie', `refreshToken=${refreshTokenPhone}`)

            .expect(STATUS_CODE.SUCCESS_200)

        idDevicePhone = res.body[0].deviceId

        //console.log(res.body)
        //console.log('idDevicePhone' + ' ' + idDevicePhone)

    })
//для проверки один из трех надо раскоментировать ИХ НЕ НАДО УДАЛЯТЬ

    it("correct id but not my session", async () => {
        await req
            .delete('/security/devices/' + idDeviceFIRSTLaptop)
            .set('Cookie', `refreshToken=${refreshTokenPhone}`)

            .expect(STATUS_CODE.FORBIDDEN_403)

    })


 /*      it("correct id but not my session", async () => {
           await req
               .delete('/security/devices/'+idDeviceFIRSTLaptop)
               .set('Cookie', `refreshToken=${refreshTokenFIRSTLaptop}`)

               .expect(STATUS_CODE.NO_CONTENT_204)
       })
*/

/*
    it("correct id but not my session", async () => {
        await req
            .delete('/security/devices/' + idDeviceFIRSTLaptop)
            .set('Cookie', `refreshToken=${refreshTokenSecondLaptop}`)

            .expect(STATUS_CODE.NO_CONTENT_204)
    })
*/


})