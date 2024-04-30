
export type Blog = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt:string,
    isMembership:boolean
}

export type OutputBlog = {
    id:string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt:string,
    isMembership:boolean
}

export type PaginationWithOutputBlog<I> = {
    pagesCount:number,
    page:number,
    pageSize:number,
    totalCount:number,
    items:I[]
}

type SortDirection="asc" | "desc"

export type QueryBlogInputModal = {
    searchNameTerm?:string
    sortBy?:string
    sortDirection?:SortDirection
    pageNumber?:number
    pageSize?:number
}

export type GetQueryBlogInputModal = {
    sortBy?:string
    sortDirection?:SortDirection
    pageNumber?:number
    pageSize?:number
}

export type SortData = {
    searchNameTerm:string | null
    sortBy:string
    sortDirection:SortDirection
    pageNumber:number
    pageSize:number
}

export type CreatePostFromCorrectBlogInputModel={
    title:string
    shortDescription:string
    content:string
}