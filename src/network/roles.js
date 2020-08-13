import {
    get,
    post,
    Delete,
    PUT
} from './request'

export const getRolesList = () => get('/roles')

export const addRoles = (roleName, roleDesc) => post('/roles', {
    roleName,
    roleDesc
})
//删除角色
export const delRoles = (id) => Delete(`/roles/${id}`)

export const editRole = (id, roleName, roleDesc) => PUT(`/roles/${id}`, {
    roleName,
    roleDesc
})

export const getRole = (id) => get(`/roles/${id}`)
//删除角色权限
export const removeRole = (roleId, rightId) => Delete(`/roles/${roleId}/rights/${rightId}`)

//角色授权
export const allotRights = (roleId,rids) => post(`/roles/${roleId}/rights`,{
    rids
})