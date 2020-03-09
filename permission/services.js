import schemas from "./schemas"

import frSchema from "@/outter/fr-schema/src"
import { createBasicApi } from "@/outter/fr-schema/src/service"

const { createApi, oauth, utils } = frSchema

const { request } = utils

// user function
let permissions = createApi("flask_user_auth/permission", schemas.permission)
let functions = createApi("flask_user_auth/permission/scope", schemas.function)

// 证书
const license = {}

// 判断系统是否注册
license.getIsRegistered = createApi("flask_user_auth/license/check", null, {
    skipOauth: true
}).getBasic

// 返回注册码
license.getMachieCode = createApi("flask_user_auth/license", null, {
    skipOauth: true
}).getBasic

// 上传注册文件
license.post = async args => {
    const response = await createBasicApi("flask_user_auth/license", null, {
        skipOauth: true
    }).post(args)

    return response.data
}

license.get = createBasicApi("flask_user_auth/license", null, {
    skipOauth: true
}).get

// return
export default {
    permissions,
    functions,
    license
}
