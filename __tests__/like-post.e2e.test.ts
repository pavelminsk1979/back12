import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";
import mongoose from "mongoose";
import * as dotenv from "dotenv";


dotenv.config()

const req = supertest(app)

describe('/like_posts', () => {


    beforeAll(async () => {

        const mongoUri = process.env.MONGO_URL;

        if (!mongoUri) {
            throw new Error('URL not find(file mongoDb/like_post_test')
        }

        await mongoose.connect(mongoUri
            , {dbName: process.env.DB_NAME});

        await req
            .delete('/testing/all-data')

    })


    afterAll(async () => {
        await mongoose.disconnect()
    });


    const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5'
    const loginUser1 = 'post1111'
    const passwordUser1 = 'post1pasw'
    const emailUser1 = 'palPel11@mail.ru'
    let jwtToken1 = ''

  /*  const loginSecondUser = '22222222'
    const passwordSecondUser = '2222pasw'
    const emailSecondUser = 'palPel22@mail.ru'
    let jwtToken2 = ''
    const loginUser3 = '33333333'
    const passwordUser3 = '33333pasw'
    const emailUser3 = 'palPel33@mail.ru'
    let jwtToken3=''*/
    let idBlog: string
    let idPost: string
    let idComent: string

    ////////////////////////////////////////////////////////////
    // запустить тест, потом закоментировать
    //создание юзера и блога и поста

    it(' create users1', async () => {
        const res = await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                login: loginUser1,
                password: passwordUser1,
                email: emailUser1
            })
            .expect(STATUS_CODE.CREATED_201)

    })


    it(" login user1", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginUser1,
                password: passwordUser1
            })
            .expect(STATUS_CODE.SUCCESS_200)

        // console.log(res.body.accessToken)
        jwtToken1 = res.body.accessToken
    })


    it('create blog', async () => {
        const res = await req
            .post('/blogs')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                name: 'nameBlog1',
                description: 'descriptionBlog1',
                websiteUrl: 'https://www.blog1.com/'
            })
            .expect(STATUS_CODE.CREATED_201)

        idBlog = res.body.id
    })


    it(' create newPost', async () => {
        const res = await req
            .post('/posts')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                title: 'titlePost1',
                shortDescription: 'shortDescriptionPost1',
                content: 'contentPost1',
                blogId: idBlog
            })
            .expect(STATUS_CODE.CREATED_201)

        idPost = res.body.id

        console.log(res.body)


    })


    //Досюда можно коментировать и потом работать с лайками только
    /////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////

    it(" set Like ", async () => {
        await req
            .put(`/posts/${idPost}/like-status`)
            .set('Authorization', `Bearer ${jwtToken1}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Dislike ", async () => {
        await req
            .put(`/posts/${idPost}/like-status`)
            .set('Authorization', `Bearer ${jwtToken1}`)
            .send({likeStatus: 'Dislike'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })



    /* it(' create secondUsers', async () => {
         const res = await req
             .post('/users')
             .set('Authorization', `Basic ${loginPasswordBasic64}`)
             .send({
                 login: loginSecondUser,
                 password: passwordSecondUser,
                 email: emailSecondUser
             })
             .expect(STATUS_CODE.CREATED_201)

         expect(res.body.login).toEqual(loginSecondUser)
     })


     it(" login secondUsers", async () => {
         const res = await req
             .post('/auth/login')
             .send({
                 loginOrEmail: loginSecondUser,
                 password: passwordSecondUser
             })
             .expect(STATUS_CODE.SUCCESS_200)

         // console.log(res.body.accessToken)
         jwtToken2 = res.body.accessToken

         expect(res.body.accessToken).toBeTruthy()
     })

     it(' create users3', async () => {
         const res = await req
             .post('/users')
             .set('Authorization', `Basic ${loginPasswordBasic64}`)
             .send({
                 login: loginUser3,
                 password: passwordUser3,
                 email: emailUser3
             })
             .expect(STATUS_CODE.CREATED_201)

         //expect(res.body.login).toEqual(loginUser1)

     })


     it(" login user3", async () => {
         const res = await req
             .post('/auth/login')
             .send({
                 loginOrEmail: loginUser3,
                 password: passwordUser3
             })
             .expect(STATUS_CODE.SUCCESS_200)

         // console.log(res.body.accessToken)
         jwtToken3 = res.body.accessToken

         //expect(res.body.accessToken).toBeTruthy()
     })*/






/*

    it("  Dislike from user1", async () => {
        await req
            .put(`/comments/${idComent}/like-status`)
            .set('Authorization', `Bearer ${jwtToken1}`)
            .send({likeStatus: 'Dislike'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })



    it(" get comment from authorization user", async () => {
        const res = await req
            .get(`/comments/${idComent}`)
            .set('Authorization', `Bearer ${jwtToken1}`)

            .expect(STATUS_CODE.SUCCESS_200)

            //console.log(res.body)
    })


    it("  Dislike from user1", async () => {
        await req
            .put(`/comments/${idComent}/like-status`)
            .set('Authorization', `Bearer ${jwtToken1}`)
            .send({likeStatus: 'None'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })



    it(" get comment from authorization user", async () => {
        const res = await req
            .get(`/comments/${idComent}`)
            .set('Authorization', `Bearer ${jwtToken1}`)

            .expect(STATUS_CODE.SUCCESS_200)

        //console.log(res.body)
    })




    it("  Like from user1", async () => {
        await req
            .put(`/comments/${idComent}/like-status`)
            .set('Authorization', `Bearer ${jwtToken1}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })



    it(" get comment from authorization user", async () => {
        const res = await req
            .get(`/comments/${idComent}`)
            .set('Authorization', `Bearer ${jwtToken1}`)

            .expect(STATUS_CODE.SUCCESS_200)

        //console.log(res.body)
    })


    it(" get comment from authorization user", async () => {
        const res = await req
            .get(`/comments/${idComent}`)


            .expect(STATUS_CODE.SUCCESS_200)

       // console.log(res.body)
    })










        it("  Dislike from user2", async () => {
            await req
                .put(`/comments/${idComent}/like-status`)
                .set('Authorization', `Bearer ${jwtToken2}`)
                .send({likeStatus: 'Dislike'})
                .expect(STATUS_CODE.NO_CONTENT_204)
        })



        it(" get comment from authorization user", async () => {
            const res = await req
                .get(`/comments/${idComent}`)
                .set('Authorization', `Bearer ${jwtToken1}`)

                .expect(STATUS_CODE.SUCCESS_200)

            //console.log(res.body)
        })

        it("  Like from user3", async () => {
            await req
                .put(`/comments/${idComent}/like-status`)
                .set('Authorization', `Bearer ${jwtToken3}`)
                .send({likeStatus: 'Like'})
                .expect(STATUS_CODE.NO_CONTENT_204)
        })


        it(" get comment from authorization user", async () => {
            const res = await req
                .get(`/comments/${idComent}`)
                .set('Authorization', `Bearer ${jwtToken1}`)

                .expect(STATUS_CODE.SUCCESS_200)

            //console.log(res.body)
        })



        it(" get comment from authorization user", async () => {
            const res = await req
                .get(`/comments/${idComent}`)


                .expect(STATUS_CODE.SUCCESS_200)

            //console.log(res.body)
        })



        ///////////////////////////////////////////////////










        ////////////////////////////////////////

        it(" get coment from NOT authorization user", async () => {
            const res = await req
                .get(`/comments/${idComent}`)

                .expect(STATUS_CODE.SUCCESS_200)

            //console.log(res.body)
        })

        it(" create comment", async () => {
            const res = await req
                .post(`/posts/${idPost}/comments`)
                .set('Authorization', `Bearer ${jwtToken2}`)
                .send({content: 'content1 for1 comments1 for1 post1'})

                .expect(STATUS_CODE.CREATED_201)

            //console.log(res.body)
        })

        it(" get all comments(array) from correct post", async () => {
            const res = await req
                .get(`/posts/${idPost}/comments`)
                .set('Authorization', `Bearer ${jwtToken2}`)


                .expect(STATUS_CODE.SUCCESS_200)


            //console.log(res.body)

        })*/


})