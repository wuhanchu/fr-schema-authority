import frSchema from '@/outter/fr-schema/src';

const { schemaFieldType } = frSchema;

export default {
    client_name: {
        title: '名称',
        required: true,
        searchPrefix: 'like',
    },
    client_id: {
        title: '编号',
        editHide:true,
        addHide: true,
        required: true,
    },
    scope: {
        title: '范围',
        required: true,
    },
    response_type: {
        title: '返回类型',
        required: true,
    },
    client_secret: {
        title: '密码',
        listHide: true,
        addHide: true,
        // editHide: true,
        readOnly: true,
        required: true,
    },
    grant_type: {
        title: '授权模式',
        required: true,
        // listHide: true,
        type: schemaFieldType.MultiSelect,
        dict: {
            authorization_code: {
                value: 'authorization_code',
                remark: '授权码模式',
            },
            password: {
                value: 'password',
                remark: '密码模式',
            },
            refresh_token: {
                value: 'refresh_token',
                remark: '刷新',
            },
            implicit: {
                value: 'implicit',
                remark: '简化模式',
            },
            client_credentials: {
                value: 'client_credentials',
                remark: '客户端模式',
            },
        },
    },
};
