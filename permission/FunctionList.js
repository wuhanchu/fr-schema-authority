import { antdUtils } from "@/outter"
import schemas from "./schemas"
import services from "./services"
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

const { ListPage } = antdUtils.components

/**
 * function list contonerl front page show
 */
@Form.create()
class FunctionList extends ListPage {
    constructor(props) {
        super(props, {
            schema: schemas.function,
            service: services.functions,
            authorityKey: "permission_scope"
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
