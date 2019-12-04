import schemas from "./schemas"

import { frSchema } from "@/outter"
import { createBasicApi } from "@/outter/fr-schema/src/service"

const { createApi, oauth, utils } = frSchema

const { request } = utils

// user function
let permissions = createApi("permissions", schemas.permission)
let functions = createApi("permission_group", schemas.function)

// 证书
const license = {}
license.getIsRegistered = createApi("api/admin/registe/checkRegister", null, {
    skipOauth: true
}).getBasic // 判断系统是否注册
license.getMachieCode = createApi("api/admin/registe/getMachineCode", null, {
    skipOauth: true
}).getBasic // 返回注册码

license.post = async args => {
    const response = await createBasicApi("register/file", null, {
        skipOauth: true
    }).post(args)

    return response.data
}

license.get = createBasicApi("register/license", null, {
    skipOauth: true
}).get // 上传注册文件

// return
export default {
    permissions,
    functions,
    license
}
