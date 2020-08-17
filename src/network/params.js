import {
    get,
    post,
    Delete,
    PUT
} from './request'


export const getAttrList = (id, sel) => get(`/categories/${id}/attributes`, {
    sel
})

export const addAttr = (id, attr_name, attr_sel, attr_vals) => post(`/categories/${id}/attributes`, {
    attr_name,
    attr_sel,
    attr_vals
})

export const delAttr = (id, attrid) => Delete(`/categories/${id}/attributes/${attrid}`)

export const getAttrById = (id, attrId, attr_sel, attr_vals) => get(`/categories/${id}/attributes/${attrId}`, {
    attr_sel,
    attr_vals
})

export const editAttr = (id,attrId,attr_name,attr_sel,attr_vals) => PUT(`/categories/${id}/attributes/${attrId}`,{
    attr_name,
    attr_sel,
    attr_vals
})