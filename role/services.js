import schemas from "./schemas"

import { frSchema } from "@/outter"
import { async } from "q"

const { createApi, oauth, utils } = frSchema

const { request } = utils

// 用户
let roles = createApi("v1/roles", schemas)

const convertRole = item => {
    return {
        ...item
    }
}
roles.queryPermissionList = async params => {
    const res = await createApi(`v1/permissions`, schemas).getBasic({
        limit: 100,
        offset: 0,
        sort: "-id"
    })
    // const { list, ...others } = data.data
    return {
        list: res.data.list
        // ...others
    }
}

roles.editPermission = async params => {
    const res = await createApi(`v1/role_permissions`).put(params)
    // const { list, ...others } = data.data
    return res
}

roles.getPermission = async params => {
    const res = await createApi(`v1/role_permissions/${params}`).getBasic()
    return res
}

export default {
    roles
}
