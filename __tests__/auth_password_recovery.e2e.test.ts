import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";
import * as dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config()

const  req = supertest(app)

const emailNewUser ='pavelminsk1979@mail.ru'

/*Тэсты запускать поочереди и открыть базу данных
ПЕРВЫЙ ТЭСТ ВЫПОЛНИТСЯ--- в базе посмотреть что юзер
создан и запомнить  confirmationCode---после второго тэста
он должен быть изменен

 ПОСЛЕ ВТОРОГО ТЕСТА ОТПРАВИТСЯ ПИСЬМО НА ПОЧТУ

ДЛЯ ТРЕЙТЕГО ТЕСТА ИЗ БАЗЫ ДАННЫХ СКОПИРОВАТЬ  confirmationCode
И ВСТАВИТЬ В ТЕСТ
Также запомнить passwordHash и после трейтего теста
passwordHash должен быть изменен*/

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
    const loginNewUser ='2222299'
    const passwordNewUser ='222222pasw'


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


})






describe('/auth/password-recovery',()=>{

    beforeAll(async ()=>{
        const mongoUri = process.env.MONGO_URL ;
        if(!mongoUri){
            throw new Error('URL not find(file mongoDb/1')
        }
        await mongoose.connect(mongoUri
            ,{ dbName:process.env.DB_NAME });
    })

    afterAll(async () => {
        await mongoose.disconnect()
    });



    it(' send letter by  pavelminsk1979@mail.ru with new code ',async ()=>{
        const res =await req
            .post('/auth/password-recovery')
            .send({email:emailNewUser})
            .expect(STATUS_CODE.NO_CONTENT_204)

    })

})

/*

describe('/auth/new-password',()=>{

    beforeAll(async ()=>{
        const mongoUri = process.env.MONGO_URL ;
        if(!mongoUri){
            throw new Error('URL not find(file mongoDb/1')
        }
        await mongoose.connect(mongoUri
            ,{ dbName:process.env.DB_NAME });
    })

    afterAll(async () => {
        await mongoose.disconnect()
    });



    it(' send letter by  pavelminsk1979@mail.ru with new code ',async ()=>{
        const res =await req
            .post('/auth/new-password')
            .send({newPassword:'9898pasw',
                recoveryCode:'2743d1b5-ff60-487e-ba1a-e124d12b6db3'})
            .expect(STATUS_CODE.NO_CONTENT_204)

    })

})*/
