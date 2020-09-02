import {
    get,
    Delete,
    post,
    PUT
} from './request'

export const getGoodsList = (query, pagenum, pagesize) => get('/goods', {
    query,
    pagenum,
    pagesize
})

export const delGoods = (id) => Delete(`/goods/${id}`)


export const addGood = (
    goods_name,
    goods_cat,
    goods_price,
    goods_number,
    goods_weight,
    goods_introduce,
    pics,
    attrs
) => post('/goods', {
    goods_name,
    goods_cat,
    goods_price,
    goods_number,
    goods_weight,
    goods_introduce,
    pics,
    attrs
})

export const getGoodById = (id) => get(`/goods/${id}`)

export const editGood = (id,
    goods_name,
    goods_price,
    goods_number,
    goods_cat,

    goods_weight,
    goods_introduce,
    pics,
    attrs
) => PUT(`/goods/${id}`, {
    goods_name,
    goods_price,
    goods_number,
    goods_cat,

    goods_weight,
    goods_introduce,
    pics,
    attrs
})

