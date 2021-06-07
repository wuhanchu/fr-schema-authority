import { createApi } from '@/outter/fr-schema/src/service';
import schema from './schema';

// 用户
const service = createApi('user_auth/oauth2_client', schema, null, 'eq.');
service.get = async (params) => {

    const res = await createApi(`user_auth/oauth2_client`).get({
        ...params,
        select: 'id,client_id,client_name,grant_type,scope,response_type, client_metadata, client_secret',
    });
    const list = res.list.map((item) => {
        try {
            JSON.parse(item.grant_type);
            return { ...item, grant_type: item.grant_type ? JSON.parse(item.grant_type) : undefined };
        } catch(e) {
            console.log(e);
            return { ...item, grant_type: item.grant_type ? item.grant_type : undefined };
        }

    });
    return { ...res, list };
};
service.post = async (params) => {

    const res = await createApi('user_auth/oauth2_client', schema, null, 'eq.').post({...params, grant_type: JSON.stringify(params.grant_type)});
};
export default service;
