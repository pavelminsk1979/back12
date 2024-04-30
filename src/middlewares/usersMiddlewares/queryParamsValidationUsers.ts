import {QueryParamsUsers, QueryUsersInputModal} from "../../allTypes/userTypes";


export const queryParamsValidationUsers = (queryParams: QueryUsersInputModal): QueryParamsUsers => {
    return {
        pageNumber:  isNaN(Number(queryParams.pageNumber))
            ? 1
            : Number(queryParams.pageNumber),

        pageSize: isNaN(Number(queryParams.pageSize))
            ? 10
            : Number(queryParams.pageSize),

        sortBy: queryParams.sortBy ?? 'createdAt',
        sortDirection: queryParams.sortDirection ?? 'desc',
        searchLoginTerm: queryParams.searchLoginTerm ?? null,
        searchEmailTerm: queryParams.searchEmailTerm ?? null,
    }
}
