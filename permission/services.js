import schemas from "./schemas"

import { frSchema } from "@/outter"
import { createBasicApi } from "@/outter/fr-schema/src/service"

const { createApi, oauth, utils } = frSchema

const { request } = utils

// 用户
let permissions = createApi("v1/permissions", schemas)

// 证书
const license = {}
license.getIsRegistered = createApi("api/admin/registe/checkRegister", null, {
    skipOauth: true
}).getBasic // 判断系统是否注册
license.getMachieCode = createApi("api/admin/registe/getMachineCode", null, {
    skipOauth: true
}).getBasic // 返回注册码

/**
 *
 * @param args
 * @returns {Promise<void>}
 */
license.post = async args => {
    const response = await createBasicApi("v1/register/file", null, {
        skipOauth: true
    }).post(args)

    return response.data
}

license.get = createBasicApi("v1/register/license", null, {
    skipOauth: true
}).get // 上传注册文件

export default {
    permissions,
    license
}
