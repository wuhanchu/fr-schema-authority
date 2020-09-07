import frSchema from "@/outter/fr-schema/src"

const { schemaFieldType } = frSchema

export default {
    name: {
        title: "名称",
        required: true,
        searchPrefix: "like",
    },
    key: {
        title: "编号",
        required: true,
    },
}
