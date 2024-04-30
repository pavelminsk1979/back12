

export const emailLetterForRegistration=(confirmationCode:string)=>{

    const letter = `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
 </p>`

    return letter
}