import frSchema  from "@/outter/fr-schema/src"

const { schemaFieldType } = frSchema

export default {
    role: {
        name: {
            title: "名称",
            required: true
        },
        chinese_name: {
            title: "中文名"
        },
        description: {
            title: "描述"
        },
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
            addHide: true,
            listHide: true,
            editHide: true
        }
        // del_fg: {
        //     title: "删除标识",
        //     addHide: true
        // }
    }
}
