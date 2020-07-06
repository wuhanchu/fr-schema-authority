import frSchema from "@/outter/fr-schema/src"

const { schemaFieldType } = frSchema

export default {
    name: {
        title: "权限名称",
        required: true,
    },
    description: {
        title: "权限描述",
    },
    key: {
        title: "菜单KEY",
    },
    url: {
        title: "路由匹配地址",
        readOnly: true,
    },
    method: {
        title: "类型",
        readOnly: true,
        type: schemaFieldType.Select,
        dict: {
            get: {
                value: "GET",
                remark: "GET",
            },
            post: {
                value: "POST",
                remark: "POST",
            },
            put: {
                value: "PUT",
                remark: "PUT",
            },
            delete: {
                value: "DELETE",
                remark: "DELETE",
            },
        },
    },

    opr_by: {
        title: "操作人",
        listHide: true,
        addHide: true,
        editHide: true,
    },
    opr_at: {
        title: "操作时间",
        type: schemaFieldType.DatePicker,
        props: {
            showTime: true,
        },
        listHide: true,
        addHide: true,
        editHide: true,
    },
}
