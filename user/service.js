import schema from "./schema"

import frSchema, { config } from "@/outter/fr-schema/src"

const { createApi, createBasicApi, oauth, utils } = frSchema

const { request } = utils

// 用户
let service = createApi("user_auth/user", schema, {}, "eq.")
service.get = createApi("user_auth/user_extend", schema, {}, "eq.").get

const convertRole = (item) => {
    return {
        ...item,
    }
}
/**
 * 登录
 * @param params
 * @returns {Promise<ClientOAuth2.Token>}
 */
service.login = (params) => {
    const client = oauth()
    console.debug("login params", params)

    return client.owner
        .getToken(params.userName, params.password)
        .catch((e) => {
            throw new Error("登录出错")
        })
}

service.logout = () => {
    return request(
        {
            method: "DELETE",
            url: (
                "/" +
                config.apiVersion + "token"
            ).replace("//", "/"),
        }
    )
}

/**
 * 查询当前用户
 * @returns {Promise<void>}
 */
service.queryCurrent = async () => {
    const response = await createBasicApi("user_auth/user/current").get()

    return response
}

/**
 * 查询角色信息
 * @returns {Promise<void>}
 */

service.queryRoleList = async (params) => {
    const { list, ...others } = await createApi(
        `user_auth/user/role`,
        schema
    ).get(params)
    return {
        list: list.map((item) => convertRole(item)),
        ...others,
    }
}

service.editRole = async (params) => {
    const res = await createApi(`user_auth/user/role`).put(params)
    return res
}

export default service
