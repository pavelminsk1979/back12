import nodemailer from 'nodemailer'


export const emailAdapter = {
    async sendEmail(email: string, letter: string) {
        let transport =  nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'pavvel.potapov@gmail.com',
                pass: 'cfas asrj bell izdi'
            }
        });

        let info = await transport.sendMail({
            from: 'Pavel',
            to: email,
            subject: 'ПОДТВЕРЖДЕНИЕ регистации',
            html: letter,
        })


        return !!info
    }
}