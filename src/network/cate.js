import { get,post,Delete,PUT } from './request'

export const getCategoriesList = ( type,pagenum,pagesize ) => get('/categories',{
    type,
    pagenum,
    pagesize
})


export const addCatergory = (cat_pid,cat_name,cat_level) => post(`/categories`,{
    cat_pid,
    cat_name,
    cat_level
})

export const delCatergory = (id) => Delete(`/categories/${id}`)

export const editCategory = (id,cat_name) => PUT(`/categories/${id}`,{
    cat_name
})

export const getCateById = (id) => get(`/categories/${id}`)