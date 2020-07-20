// 证书
import { createApi, createBasicApi } from '@/outter/fr-schema/src/service';

const license = {};

// 判断系统是否注册
license.getIsRegistered = createApi('user_auth/license/check', null, {
    skipOauth: true,
}).getBasic;

// 返回注册码
license.getMachieCode = createApi('user_auth/license', null, {
    skipOauth: true,
}).getBasic;

// 上传注册文件
license.post = async (args) => {
    const response = await createBasicApi('user_auth/license', null, {
        skipOauth: true,
    }).post(args);

    return response.data;
};

license.get = createBasicApi('user_auth/license', null, {
    skipOauth: true,
}).get;

export default license;
