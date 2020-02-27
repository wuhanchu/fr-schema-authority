import schemas from "./schemas"

import frSchema from "@/outter/fr-schema/src"
import { async } from "q"

const { createApi, oauth, utils } = frSchema

const { request } = utils

// 用户
let roles = createApi("flask_user_auth/role", schemas)

const convertRole = item => {
    return {
        ...item
    }
}
roles.queryPermissionList = async params => {
    const res = await createApi(
        `flask_user_auth/role/permission`,
        schemas
    ).getBasic({
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
    const res = await createApi(`flask_user_auth/role/permission`).put(params)
    // const { list, ...others } = data.data
    return res
}

roles.getPermission = async params => {
    const res = await createApi(`flask_user_auth/role/permission`).getBasic()
    return res
}

roles.putFunctions = async args => {
    return createApi("flask_user_auth/role/permission_scope").put(others)
}

roles.getFunctions = async args => {
    const { data: list } = await createApi(
        "flask_user_auth/user/role/permission_scope"
    ).getBasic(others)

    return { list }
}

export default {
    roles
}
