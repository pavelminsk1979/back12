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


    let idBlog: string
    let idPost1: string
    let idPost2: string
    let idPost3: string
    let idPost4: string
    let idPost5: string
    let idPost6: string


    const loginUser1 = 'post1111'
    const passwordUser1 = 'post1pasw'
    const emailUser1 = 'palPel11@mail.ru'
    let jwtToken1 = ''

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

    const loginUser2 = 'post2222'
    const passwordUser2 = 'post2pasw'
    const emailUser2 = 'palPel22@mail.ru'
    let jwtToken2 = ''

    it(' create users2', async () => {
        const res = await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                login: loginUser2,
                password: passwordUser2,
                email: emailUser2
            })
            .expect(STATUS_CODE.CREATED_201)
    })


    it(" login user2", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginUser2,
                password: passwordUser2
            })
            .expect(STATUS_CODE.SUCCESS_200)

        // console.log(res.body.accessToken)
        jwtToken2 = res.body.accessToken
    })


    const loginUser3 = 'post3333'
    const passwordUser3 = 'post3pasw'
    const emailUser3 = 'palPel33@mail.ru'
    let jwtToken3 = ''

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
    })


    const loginUser4 = 'post4444'
    const passwordUser4 = 'post4pasw'
    const emailUser4 = 'palPel44@mail.ru'
    let jwtToken4 = ''

    it(' create users4', async () => {
        const res = await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                login: loginUser4,
                password: passwordUser4,
                email: emailUser4
            })
            .expect(STATUS_CODE.CREATED_201)
    })


    it(" login user4", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginUser4,
                password: passwordUser4
            })
            .expect(STATUS_CODE.SUCCESS_200)

        // console.log(res.body.accessToken)
        jwtToken4 = res.body.accessToken
    })

    /////////////////////////////////////////////////////////////////
    //////// СОЗДАЛ 4 ЮЗЕРА
    /////////////////////////////////////////////////////////////////


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


    it(' create newPost1', async () => {
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

        idPost1 = res.body.id
        //console.log(res.body.extendedLikesInfo)

    })

    it(' create newPost2', async () => {
        const res = await req
            .post('/posts')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                title: 'titlePost2',
                shortDescription: 'shortDescriptionPost2',
                content: 'contentPost2',
                blogId: idBlog
            })
            .expect(STATUS_CODE.CREATED_201)

        idPost2 = res.body.id
    })

    it(' create newPost3', async () => {
        const res = await req
            .post('/posts')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                title: 'titlePost3',
                shortDescription: 'shortDescriptionPost3',
                content: 'contentPost3',
                blogId: idBlog
            })
            .expect(STATUS_CODE.CREATED_201)

        idPost3 = res.body.id
    })

    it(' create newPost4', async () => {
        const res = await req
            .post('/posts')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                title: 'titlePost4',
                shortDescription: 'shortDescriptionPost4',
                content: 'contentPost4',
                blogId: idBlog
            })
            .expect(STATUS_CODE.CREATED_201)

        idPost4 = res.body.id
    })


    it(' create newPost5', async () => {
        const res = await req
            .post('/posts')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                title: 'titlePost5',
                shortDescription: 'shortDescriptionPost5',
                content: 'contentPost5',
                blogId: idBlog
            })
            .expect(STATUS_CODE.CREATED_201)

        idPost5 = res.body.id
    })


    it(' create newPost6', async () => {
        const res = await req
            .post('/posts')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                title: 'titlePost6',
                shortDescription: 'shortDescriptionPost6',
                content: 'contentPost6',
                blogId: idBlog
            })
            .expect(STATUS_CODE.CREATED_201)

        idPost6 = res.body.id
    })

    ////////////////////////////////////////////////////////////////
    ////  СОЗДАЛ 6 ПОСТОВ
    //////////////////////////////////////////////////////


    it(" set Like post1  user1 ", async () => {
        await req
            .put(`/posts/${idPost1}/like-status`)
            .set('Authorization', `Bearer ${jwtToken1}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Like post1  user2 ", async () => {
        await req
            .put(`/posts/${idPost1}/like-status`)
            .set('Authorization', `Bearer ${jwtToken2}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Like post2  user2 ", async () => {
        await req
            .put(`/posts/${idPost2}/like-status`)
            .set('Authorization', `Bearer ${jwtToken2}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Like post2  user3 ", async () => {
        await req
            .put(`/posts/${idPost2}/like-status`)
            .set('Authorization', `Bearer ${jwtToken3}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Dislike post3 user1", async () => {
        await req
            .put(`/posts/${idPost3}/like-status`)
            .set('Authorization', `Bearer ${jwtToken1}`)
            .send({likeStatus: 'Dislike'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Like post4  user1 ", async () => {
        await req
            .put(`/posts/${idPost4}/like-status`)
            .set('Authorization', `Bearer ${jwtToken1}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Like post4  user2 ", async () => {
        await req
            .put(`/posts/${idPost4}/like-status`)
            .set('Authorization', `Bearer ${jwtToken2}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Like post4  user3 ", async () => {
        await req
            .put(`/posts/${idPost4}/like-status`)
            .set('Authorization', `Bearer ${jwtToken3}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Like post4  user4 ", async () => {
        await req
            .put(`/posts/${idPost4}/like-status`)
            .set('Authorization', `Bearer ${jwtToken4}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Like post5  user2 ", async () => {
        await req
            .put(`/posts/${idPost5}/like-status`)
            .set('Authorization', `Bearer ${jwtToken2}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Dislike post5 user3", async () => {
        await req
            .put(`/posts/${idPost5}/like-status`)
            .set('Authorization', `Bearer ${jwtToken3}`)
            .send({likeStatus: 'Dislike'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Like post6  user1 ", async () => {
        await req
            .put(`/posts/${idPost6}/like-status`)
            .set('Authorization', `Bearer ${jwtToken1}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" set Dislike post6 user2", async () => {
        await req
            .put(`/posts/${idPost6}/like-status`)
            .set('Authorization', `Bearer ${jwtToken2}`)
            .send({likeStatus: 'Dislike'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" get  posts  user1", async () => {
        const res = await req
            .get(`/posts`)
            //.set('Authorization', `Bearer ${jwtToken1}`)
            .expect(STATUS_CODE.SUCCESS_200)

        console.log(res.body.extendedLikesInfo)
        console.log('+++++++++++++++++')
        console.log(res.body)
    })












    /*    it(" get correct post", async () => {
            const res = await req
                .get(`/posts/${idPost1}`)

                .expect(STATUS_CODE.SUCCESS_200)

                //console.log(res.body.extendedLikesInfo)
        })*/


    /*    it('create post for correct blog', async () => {
            const res = await req
                .post(`/blogs/${idBlog}/posts`)
                .set('Authorization', `Basic ${loginPasswordBasic64}`)
                .send({
                    title: 'postForBlog',
                    shortDescription: 'descriptionPostForBlog',
                    content: 'contentPostForBlog'
                })
                .expect(STATUS_CODE.CREATED_201)

            console.log(res.body)
            console.log(res.body.extendedLikesInfo.newestLikes)
        })*/


    //Досюда можно коментировать и потом работать с лайками только
    /////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////

    /*    it(" set Like ", async () => {
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
        })*/


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