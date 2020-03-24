import frSchema from "@/outter/fr-schema/src"
import antdUtils from "@/outter/fr-schema-antd-utils/src"

import schemas from "./schemas"
import services from "./services"
import { Fragment } from "react"
import { Divider, Form, message, Select } from "antd"
import InfoModal from "@/outter/fr-schema-antd-utils/src/components/Page/InfoModal"
import Authorized from "@/outter/fr-schema-antd-utils/src/components/Authorized/Authorized"
import roleServices from "../role/services"
import clone from "clone"

const { utils, actions } = frSchema

const { Option } = Select
const { ListPage } = antdUtils.components

/**
 * 通话记录
 */
export class User extends ListPage {
    constructor(props) {
        super(props, {
            schema: clone(schemas.user),
            authorityKey: "user",
            infoProps: {
                offline: true
            },
            service: services.users
        })
    }

    componentDidMount = () => {
        this.handleGetRoleList()
        super.componentDidMount()
    }

    handleRoleBisibleModal = (flag, record, action) => {
        this.setState({
            editRoleVisible: !!flag,
            infoData: record,
            action
        })
    }

    handleRoleUpdate = async (data, schema) => {
        // 修改当前数据
        let rolelist = []
        for (let i = 0; i < data.roles.length; i++) {
            rolelist.push(this.state.roleList[data.roles[i]].id)
        }
        await this.service.editRole({ id: data.id, role_ids: rolelist })
        // 更新
        this.refreshList()
        message.success("修改成功")
        this.handleRoleBisibleModal()
    }

    handleGetRoleList = async () => {
        const roleList = await roleServices.roles.get()
        let data = utils.dict.listToDict(
            roleList.list,
            null,
            "id",
            "chinese_name"
        )
        this.schema.roles.dict = data
        this.setState({
            roleList: data
        })
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
                        {showEdit && !(record.name == "admin") && (
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

    // 扩展栏拨号按钮
    renderOperateColumnExtend(record) {
        if (record.name == "admin") return null
        return (
            <Authorized authority={"user_role_put"} noMatch={null}>
                <Divider type="vertical" />
                <a
                    onClick={() => {
                        this.setState({ editRoleVisible: true, record: record })
                    }}
                >
                    分配角色
                </a>
            </Authorized>
        )
    }

    renderExtend() {
        const renderForm = this.renderForm
        const { resource, title, addArgs } = this.meta
        const { editRoleVisible, record } = this.state
        const updateMethods = {
            handleVisibleModal: this.handleRoleBisibleModal,
            handleUpdate: this.handleRoleUpdate
        }
        const { id, name, roles } = this.schema

        return (
            editRoleVisible && (
                <InfoModal
                    renderForm={renderForm}
                    // form={this.props.from}
                    title={"用户角色分配"}
                    action={frSchema.actions.edit}
                    resource={resource}
                    {...updateMethods}
                    values={record}
                    visible={editRoleVisible}
                    addArgs={addArgs}
                    meta={this.meta}
                    schema={{
                        id: {
                            ...id,
                            title: "id",
                            editHide: true,
                            readOnly: true
                        },
                        name: {
                            ...name,
                            required: false,
                            // editHide: true,
                            readOnly: true
                        },
                        roles: {
                            ...roles,
                            dict: this.state.roleList,
                            required: true,
                            editHide: false,
                            infoHide: false
                        }
                    }}
                />
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

export default Form.create()(User)
