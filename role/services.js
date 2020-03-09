import schemas from "./schemas"

import frSchema from "@/outter/fr-schema/src"

const { createApi } = frSchema

// 用户
let roles = createApi("flask_user_auth/role", schemas)

const convertRole = item => {
    return {
        ...item
    }
}
roles.queryPermissionList = async params => {
    return await createApi(
        `flask_user_auth/role/permission`,
        schemas
    ).getBasic({
        limit: 100,
        offset: 0,
        sort: "-id"
    })
}

roles.editPermission = async params => {
    return await createApi(`flask_user_auth/role/permission`).patch(params)
}

roles.getPermission = async params => {
    return await createApi(`flask_user_auth/role/permission`).get()
}

roles.putFunctions = async args => {
    return createApi("flask_user_auth/role/permission_scope").put(args)
}

roles.getFunctions = async args => {
    return await createApi("flask_user_auth/role/permission_scope").get(
        args
    )
}

export default {
    roles
}
