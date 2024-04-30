export type AuthModel={
    loginOrEmail:string
    password:string
}

export type AuthRegistrationModel={
    login:string
    password:string
    email:string
}

export type AuthCodeConfirmationModel={
    code:string
}

export type AuthEmailModel={
    email:string
}


export type NewPasswordModel={
    newPassword:string
    recoveryCode:string
}