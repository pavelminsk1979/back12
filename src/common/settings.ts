export const settings = {

    JWT_SECRET_AccessTOKEN: process.env.JWT_AccessTOKEN_SECRET || 'accessToken_secret' ,

    TIME_LIFE_AccessTOKEN: '1000000s',

    JWT_SECRET_RefreshTOKEN: process.env.JWT_RefreshTOKEN_SECRET || 'refreshToken' ,

    TIME_LIFE_RefreshTOKEN: '2000000s',
}