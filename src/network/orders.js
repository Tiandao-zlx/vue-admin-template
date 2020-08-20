import {
    get
} from './request'

export const getOrdersList = (
    query,
    pagenum,
    pagesize,
    user_id,
    pay_status,
    is_send,
    order_fapiao_title,
    order_fapiao_company,
    order_fapiao_content,
    consignee_addr
) => get('/orders', {
    query,
    pagenum,
    pagesize,
    user_id,
    pay_status,
    is_send,
    order_fapiao_title,
    order_fapiao_company,
    order_fapiao_content,
    consignee_addr
})

export const getProgress = () => get(`/kuaidi/1106975712662`)