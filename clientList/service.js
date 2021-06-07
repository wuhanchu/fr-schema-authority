import { createApi } from '@/outter/fr-schema/src/service';
import schema from './schema';

// 用户
const service = createApi('user_auth/oauth2_client', schema, null, 'eq.');
service.get = async (params) => {

    const res = await createApi(`user_auth/oauth2_client`).get({
        ...params,
        select: 'id,client_id,client_name,grant_type,scope,response_type, client_metadata',
    });
    const list = res.list.map((item) => {
        return { ...item, grant_type: item.grant_type ? item.grant_type.split('\n') : undefined };
    });
    return { ...res, list };
};
export default service;
