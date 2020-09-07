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
    password: {
        title: "密码",
        required: true,
        listHide: true,
        editHide: true,
        type: schemaFieldType.Password,
    },
    department_key: {
        title: "部门",
        type: schemaFieldType.Select,
        props: {
            mode: "multiple",
        },
        // addHide: true
    },
    roles: {
        title: "角色",
        addHide: true,
        infoHide: true,
        editHide: true,
        type: schemaFieldType.MultiSelect,
        dictFunc: (dict) => {
            return dict.role
        },
    },
    telephone: {
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
