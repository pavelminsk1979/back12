
export type Post = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt:string
}

export type OutputPost = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt:string
}

export type CreatePostInputModel = {
    title: string
    shortDescription: string
    content: string
}

type SortDirection="asc" | "desc"

export type QueryBlogInputModal={
    sortBy?:string
    sortDirection?:SortDirection
    pageNumber?:number
    pageSize?:number
}

export type SortDataPost = {
    sortBy:string
    sortDirection:SortDirection
    pageNumber:number
    pageSize:number
}

export type PaginationWithOutputPosts<I> = {
    pagesCount:number,
    page:number,
    pageSize:number,
    totalCount:number,
    items:I[]
}

