import frSchema from "@/outter/fr-schema/src"

const { schemaFieldType } = frSchema

export default {
    user: {
        loginid: {
            title: "用户名",
            required: true,
            readOnly: true
        },
        name: {
            title: "姓名",
            required: true
        },
        password: {
            title: "密码",
            required: true,
            listHide: true,
            editHide: true,
            type: schemaFieldType.Password
        },
        address: {
            title: "地址"
            // addHide: true
        },
        roles: {
            title: "角色",
            addHide: true,
            infoHide: true,
            editHide: true,
            type: schemaFieldType.MultiSelect,
            dictFunc: dict => {
                return dict.role
            }
        },
        telephone: {
            title: "电话"
        }
    }
}
