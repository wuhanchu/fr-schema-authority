import schemas from "./schemas"

import { frSchema } from "@/outter"
import { async } from "q"

const { createApi, oauth, utils } = frSchema

const { request } = utils

// 用户
let roles = createApi("roles", schemas)

const convertRole = item => {
    return {
        ...item
    }
}
roles.queryPermissionList = async params => {
    const res = await createApi(`permissions`, schemas).getBasic({
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
    const res = await createApi(`role_permissions`).put(params)
    // const { list, ...others } = data.data
    return res
}

roles.getPermission = async params => {
    const res = await createApi(`role_permissions/${params}`).getBasic()
    return res
}

roles.putFunctions = async args => {
    const { role_id, ...others } = args
    return createApi("role_permission_groups/" + role_id).put(others)
}

roles.getFunctions = async args => {
    const { role_id, ...others } = args
    const { data: list } = await createApi(
        "role_permission_groups/" + role_id
    ).getBasic(others)

    return { list }
}

export default {
    roles
}
