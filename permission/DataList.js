import schema from "./schema"
import service from "./service"
import "@ant-design/compatible/assets/index.css"
import frSchemaUtils from '@/outter/fr-schema-antd-utils/src';

const { DataList, ListPage, Authorized } = frSchemaUtils.components;
/**
 * 通话记录
 */
class List extends DataList {
    constructor(props) {
        super(props, {
            schema,
            service,
            authorityKey: "permission",
        })
    }

    renderOperationButtons() {
        return null
    }

    renderOperateColumn(props = []) {
        const { scroll } = this.meta;
        const { showEdit = true } = props;

        return (
            !this.meta.readOnly &&
            !this.props.readOnly && {
                title: "操作",
                fixed: scroll && "right",
                render: (text, record) => (
                    <>
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
                    </>
                ),
            }
        )
    }

    // 搜索
    renderSearchBar() {
        const { name } = this.schema;
        const filters = this.createFilters({ name }, 5);
        return this.createSearchBar(filters)
    }
}

export default List
