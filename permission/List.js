import schema from "./schema"
import service from "./service"
import { Form } from "@ant-design/compatible"
import "@ant-design/compatible/assets/index.css"

import { Fragment } from "react"
import frSchemaUtils from '@/outter/fr-schema-antd-utils/src';
const { Authorized } = frSchemaUtils.components;
import frSchemaUtils from '@/outter/fr-schema-antd-utils/src';
const { ListPage } = frSchemaUtils.components;
/**
 * 通话记录
 */
class List extends ListPage {
    constructor(props) {
        super(props, {
            schema: schema,
            service: service,
            authorityKey: "permission",
        })
    }

    renderOperationButtons() {
        return null
    }

    renderOperateColumn(props = []) {
        const { scroll } = this.meta
        const { showEdit = true, showDelete = true } = props

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
                                        this.handleVisibleModal(
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
                ),
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

export default List
