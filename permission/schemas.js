import frSchema from "@/outter/fr-schema/src"

const { schemaFieldType } = frSchema

export default {
    permission: {
        name: {
            title: "权限名称",
            required: true
        },
        description: {
            title: "权限描述"
        },
        key: {
            title: "菜单KEY"
        },
        url: {
            title: "路由匹配地址",
            readOnly: true
        },
        method: {
            title: "类型",
            readOnly: true,
            type: schemaFieldType.Select,
            dict: {
                get: {
                    value: "GET",
                    remark: "GET"
                },
                post: {
                    value: "POST",
                    remark: "POST"
                },
                put: {
                    value: "PUT",
                    remark: "PUT"
                },
                delete: {
                    value: "DELETE",
                    remark: "DELETE"
                }
            }
        },
        // key: {
        //     title: "关联菜单字段"
        //     // listHide: true
        //     // editHide: true
        // },
        opr_by: {
            title: "操作人",
            listHide: true,
            addHide: true,
            editHide: true
        },
        opr_at: {
            title: "操作时间",
            type: schemaFieldType.DatePicker,
            props: {
                showTime: true
            },
            listHide: true,
            addHide: true,
            editHide: true
        }
        // del_fg: {
        //     title: "删除标识",
        //     addHide: true,
        //     editHide: true
        // }
    },
    function: {
        group_name: {
            title: "名称",
            required: true
        },
        key: {
            title: "菜单KEY",
            required: true
        }
    },
    license: {
        machine_info: {
            title: "机器码",
            type: schemaFieldType.TextArea,
            readOnly: true,
            props: {
                minRows: 3,
                autoSize:true
            }
        },
        custom_name: {
            title: "客户名称"
        },
        registered_time: {
            title: "注册时间"
        },
        due_time: {
            title: "失效时间"
        },
        file: {
            title: "证书",
            type: "Upload",
            showHide: true,
            required: true
        }
    }
}
