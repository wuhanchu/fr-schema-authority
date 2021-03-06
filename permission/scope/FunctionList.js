import schema from "./schema"
import service from "./service"
import { Form } from "@ant-design/compatible"
import "@ant-design/compatible/assets/index.css"
import frSchemaUtils from '@/outter/fr-schema-antd-utils/src';
const { ListPage } = frSchemaUtils.components;
/**
 * function list contonerl front page show
 */
class FunctionList extends ListPage {
    constructor(props) {
        super(props, {
            schema: schema,
            service: service,
            authorityKey: "permission_scope",
        })
    }

    renderOperationButtons() {
        return null
    }

    renderOperateColumn(props = []) {
        return null
    }

    // 搜索
    renderSearchBar() {
        const { name } = this.schema
        const filters = this.createFilters({ name }, 5)
        return this.createSearchBar(filters)
    }
}

export default FunctionList
