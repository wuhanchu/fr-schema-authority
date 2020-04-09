import schemas from "./schemas"

import frSchema from "@/outter/fr-schema/src"

const { createApi, createBasicApi, oauth, utils } = frSchema

const { request } = utils

// 用户
let users = createApi("user_auth/user", schemas, {}, "eq.")

const convertRole = item => {
    return {
        ...item
    }
}
/**
 * 登录
 * @param params
 * @returns {Promise<ClientOAuth2.Token>}
 */
users.login = params => {
    const client = oauth()
    return client.owner.getToken(params.userName, params.password).catch(e => {
        throw new Error("登录出错")
    })
}

/**
 * 查询当前用户
 * @returns {Promise<void>}
 */
users.queryCurrent = async () => {
    const response = await createBasicApi("user_auth/user/current").get()

    return response
}

/**
 * 查询角色信息
 * @returns {Promise<void>}
 */

users.queryRoleList = async params => {
    const { list, ...others } = await createApi(
        `user_auth/user/role`,
        schemas
    ).get(params)
    return {
        list: list.map(item => convertRole(item)),
        ...others
    }
}

users.editRole = async params => {
    const res = await createApi(`user_auth/user/role`).put(params)
    return res
}

export default { users }
