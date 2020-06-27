import schemas from "./schemas"

import frSchema from "@/outter/fr-schema/src"
import { createBasicApi } from "@/outter/fr-schema/src/service"

const { createApi, oauth, utils } = frSchema

const { request } = utils

// user func
let permission = createApi("user_auth/permission", schemas.permission)
let func = createApi("user_auth/permission_scope", schemas.func)

// 证书
const license = {}

// 判断系统是否注册
license.getIsRegistered = createApi("user_auth/license/check", null, {
    skipOauth: true
}).getBasic

// 返回注册码
license.getMachieCode = createApi("user_auth/license", null, {
    skipOauth: true
}).getBasic

// 上传注册文件
license.post = async args => {
    const response = await createBasicApi("user_auth/license", null, {
        skipOauth: true
    }).post(args)

    return response.data
}

license.get = createBasicApi("user_auth/license", null, {
    skipOauth: true
}).get

// return
export default {
    permission,
    func,
    license
}
