import {
    get,
    PUT,
    post,
    Delete
} from "./request"


// export function getUsersList(query,pagenum,pagesize) {
//     return request({
//         url: '/users',
//         params: {
//             query,
//             pagenum,
//             pagesize
//         }
//     })
// }

export const getUsersList = (query, pagenum = 1, pagesize = 2) => get('/users', {
    query,
    pagenum,
    pagesize
})

export const putMgState = (id, mg_state) => PUT(`/users/${id}/state/${mg_state}`)


export const addUsers = (username,password,email,mobile) => post('/users',{
    username,
    password,
    email,
    mobile
})

export const delUser = (id) => Delete(`/users/${id}`)

export const getUser = ( id ) => get(`/users/${id}`)

export const editUser = ( id,email,mobile ) => PUT(`/users/${id}`,{
    email,
    mobile
})