import { antdUtils } from "@/outter"
import schemas from "./schemas"
import services from "./services"
import { Form } from "antd"

import { Fragment } from "react"
import Authorized from "@/outter/fr-schema-antd-utils/src/components/Authorized/Authorized"

const { ListPage } = antdUtils.components

/**
 * 通话记录
 */
@Form.create()
class Permission extends ListPage {
    constructor(props) {
        super(props, {
            schema: schemas.permission,
            service: services.permissions,
            authorityKey: "sys_permission"
        })
    }

    renderOperationButtons() {
        return null
    }

    renderOperateColumn(props = []) {
        const { scroll } = this.meta
        const { showEdit = true, showDelete = true } = props

        console.debug("authorityKey", this.meta.authority)

        return (
            !this.meta.readOnly &&
            !this.props.readOnly && {
                title: "操作",
                fixed: scroll && "right",
                render: (text, record) => (
                    <Fragment>
                        {showEdit && (
                            <Authorized
                                authority={
                                    this.meta.authority &&
                                    this.meta.authority.update
                                }
                                noMatch={null}
                            >
                                <a
                                    onClick={() =>
                                        this.handleModalVisible(
                                            true,
                                            record,
                                            "edit"
                                        )
                                    }
                                >
                                    修改
                                </a>
                            </Authorized>
                        )}
                        {this.renderOperateColumnExtend(record)}
                    </Fragment>
                )
            }
        )
    }

    // 搜索
    renderSearchBar() {
        const { name } = this.schema
        const filters = this.createFilters({ name }, 5)
        return this.createSearchBar(filters)
    }
}

export default Permission
