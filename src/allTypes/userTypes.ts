
export type CreateUserModel = {
    login: string
    password: string
    email: string
}


 type EmailConfirmation = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed:boolean
}


export type User = {
    passwordHash: string,
    login: string,
    email: string,
    createdAt: Date,
    emailConfirmation:EmailConfirmation
    blackListRefreshToken:string[]
}

export type OutputUser = {
    id: string,
    login: string,
    email: string,
    createdAt: Date
}

export type PaginationWithOutputUser<I> = {
    pagesCount:number,
    page:number,
    pageSize:number,
    totalCount:number,
    items:I[]
}

type SortDirection="asc" | "desc"

export type QueryUsersInputModal = {
    searchLoginTerm?: string
    searchEmailTerm?: string
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: number
    pageSize?: number
}

export type QueryParamsUsers = {
    searchLoginTerm: string | null
    searchEmailTerm: string | null
    sortBy: string
    sortDirection: SortDirection
    pageNumber: number
    pageSize: number
}

export type IdUserModel = {
    id : string
}


export type OutputUserMeRequest = {
    userId: string,
    login: string,
    email: string,
}