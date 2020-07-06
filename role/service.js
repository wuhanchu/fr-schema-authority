import schema from "./schema"

import frSchema from "@/outter/fr-schema/src"

const { createApi } = frSchema

// 用户
let service = createApi("user_auth/role", schema)

const convertRole = (item) => {
    return {
        ...item,
    }
}
service.queryPermissionList = async (params) => {
    return await createApi(`user_auth/role/permission`, schema).getBasic({
        limit: 100,
        offset: 0,
        sort: "-id",
    })
}

service.editPermission = async (params) => {
    return await createApi(`user_auth/role/permission`).patch(params)
}

service.getPermission = async (params) => {
    return await createApi(`user_auth/role/permission`).get()
}

service.putFunctions = async (args) => {
    return createApi("user_auth/role/permission_scope").put(args)
}

service.getFunctions = async (args) => {
    return await createApi("user_auth/role/permission_scope").get(args)
}

export default service
