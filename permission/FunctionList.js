import schemas from "./schemas"
import services from "./services"
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import ListPage from "@/outter/fr-schema-antd-utils/src/components/Page/ListPage";


/**
 * function list contonerl front page show
 */
@Form.create()
class FunctionList extends ListPage {
    constructor(props) {
        super(props, {
            schema: schemas.func,
            service: services.funcs,
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
