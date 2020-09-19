import frSchema from "@/outter/fr-schema/src"

const { schemaFieldType } = frSchema

export default {
    loginid: {
        title: "用户名",
        required: true,
        readOnly: true,
        searchPrefix: "like"
    },
    name: {
        title: "姓名",
        required: true,
        searchPrefix: "like"
    },
    enable: {
        sorter: true,
        title: "是否启用",
        type: schemaFieldType.Select,
        dict: frSchema.dict.yesOrNo
    },
    password: {
        title: "密码",
        required: true,
        listHide: true,
        editHide: true,
        type: schemaFieldType.Password,
    },
    department_key: {
        title: "部门",
        sorter: true,
        searchPrefix: "cs",
        type: schemaFieldType.Select,
        props: {
            mode: "multiple",
        },
    },
    roles: {
        sorter: true,
        title: "角色",
        addHide: true,
        infoHide: true,
        editHide: true,
        type: schemaFieldType.MultiSelect,
        dictFunc: (dict) => {
            return dict.role
        },
    },
    mobile_phone: {
        title: "电话",
    },
    email: {
        title: "邮件",
    },
    address: {
        title: "地址",
        listHide: true
    },
}
