import { antdUtils, frSchema } from "@/outter"
import schemas from "./schemas"
import services from "./services"
import { Divider, Modal, Tree, Icon, Card, Input, message, Form } from "antd"
import { Fragment } from "react"
import { async } from "q"
import Authorized from "@/outter/fr-schema-antd-utils/src/components/Authorized/Authorized"
import FunctionTree from "../permission/components/FunctionTree"

const { ListPage } = antdUtils.components
const { utils, getPrimaryKey, actions } = frSchema
const { TreeNode } = Tree

/**
 * 通话记录
 */

@Form.create()
class Role extends ListPage {
    constructor(props) {
        super(props, {
            schema: schemas.role,
            service: services.roles,
            infoProps: {
                offline: true
            },
            authorityKey: "sys_role"
        })
        this.state.roleList = []
        this.state.showData = []
        this.state.permissionDict = []
    }

    componentDidMount() {
        super.componentDidMount()
        this.getPermissionList()
    }

    onSelect = (selectedKeys, info) => {
        console.log("selected", selectedKeys, info)
    }

    onCheck = (checkedKeys, info) => {
        this.setState({ permissionDict: checkedKeys })
        console.log("onCheck", checkedKeys, info)
    }

    renderOperateColumn(props = {}) {
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
                                        this.handleModalVisible(
                                            true,
                                            record,
                                            actions.edit
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

    handleOk = async () => {
        if (this.state.functionIdList) {
            await this.service.putFunctions({
                role_id: this.state.record.id,
                role_permission_group_ids: this.state.functionIdList
            })

            this.refreshList()
            message.success("修改成功")
        }

        this.setState({ editPermissionVisible: false })
    }

    getPermissionList = async () => {
        const permissionList = await this.service.queryPermissionList()
        this.setState({
            roleList: permissionList.list,
            showData: permissionList.list
        })
    }

    handleSetPermission = async record => {
        let permissionList = await this.service.getPermission(record.id)
        let permissionDict = []
        for (let i = 0; i < permissionList.data.length; i++) {
            permissionDict.push(permissionList.data[i].id.toString())
        }
        this.setState({
            editPermissionVisible: true,
            record: record,
            permissionDict: permissionDict
        })
    }

    renderOperateColumnExtend(record) {
        return (
            <Fragment>
                <Authorized
                    authority={"sys_role_permission_put"}
                    noMatch={null}
                >
                    <Divider type="vertical" />
                    <a
                        onClick={() => {
                            this.handleSetPermission(record)
                        }}
                    >
                        权限分配
                    </a>
                </Authorized>
                <Authorized noMatch={null}>
                    <Divider type="vertical" />
                    <a
                        onClick={() => {
                            this.handleSetPermission(record)
                        }}
                    >
                        功能分配
                    </a>
                </Authorized>
            </Fragment>
        )
    }

    onChangeinput = value => {
        let teacherList = this.state.roleList.filter(val => {
            try {
                return val.name.match(value.target.value)
            } catch {
                return val
            }
        })
        this.setState({
            showData: teacherList
        })
    }

    renderExtend() {
        return (
            this.state.editPermissionVisible && (
                <Modal
                    title="功能分配"
                    visible={true}
                    onOk={this.handleOk}
                    okText={"授权"}
                    onCancel={() => {
                        this.setState({ editPermissionVisible: false })
                    }}
                >
                    <FunctionTree
                        onChange={functionIdList => {
                            this.setState({
                                functionIdList
                            })
                        }}
                        record={this.state.record}
                    ></FunctionTree>
                </Modal>
            )
        )
    }

    // 搜索
    renderSearchBar() {
        const { name } = this.schema
        const filters = this.createFilters({ name }, 5)
        return this.createSearchBar(filters)
    }
}

export default Role
