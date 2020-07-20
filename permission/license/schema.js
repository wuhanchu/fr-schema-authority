import { schemaFieldType } from "@/outter/fr-schema/src/schema";

export default {
    machine_info: {
        title: '机器码',
        type: schemaFieldType.TextArea,
        readOnly: true,
        props: {
            minRows: 3,
            autoSize: true,
        },
    },
    custom_name: {
        title: '客户名称',
    },
    registered_time: {
        title: '注册时间',
    },
    due_time: {
        title: '失效时间',
    },
    file: {
        title: '证书',
        type: 'Upload',
        showHide: true,
        required: true,
    },
};
