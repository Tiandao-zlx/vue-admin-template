import { post } from './request'

export const login = ( username,password ) => post('/login',{
    username,
    password
})