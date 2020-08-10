// import {
//     request
// } from "./request"

// export function getMenuList() {
//     return request({
//         method: "get",
//         url: '/menus',
//     })
// }

import {get} from './request'

export const getMenuList = () => get('/menus')