import frSchema from '@/outter/fr-schema/src';
import schema from './schema';
import service from './service';
import { Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Divider, message, Popconfirm, Select, Button } from 'antd';
import InfoModal from '@/outter/fr-schema-antd-utils/src/components/Page/InfoModal';
import Authorized from '@/outter/fr-schema-antd-utils/src/components/Authorized/Authorized';
import roleservice from '../role/service';
import clone from 'clone';

import departmentService from '../department/service';
import DataList from '@/outter/fr-schema-antd-utils/src/components/Page/DataList';

const { utils, actions, schemaFieldType } = frSchema;

/**
 * 通话记录
 */
export class User extends DataList {
    constructor(props) {
        super(props, {
            schema: clone(schema),
            authorityKey: 'user',
            infoProps: {
                offline: true,
            },
            service: service,
        });
    }

    componentDidMount = async () => {
        await this.handleGetRoleList();
        await this.handleGetDepartmentList();
        super.componentDidMount();
    };

    handleRoleVisibleModal = (flag, record, action) => {
        this.setState({
            editRoleVisible: !!flag,
            infoData: record,
            action,
        });
    };

    handleRoleUpdate = async (data, schema) => {
        // 修改当前数据
        let rolelist = [];
        for (let i = 0; i < data.roles.length; i++) {
            rolelist.push(this.state.roleList[data.roles[i]].id);
        }
        await this.service.editRole({ id: data.id, role_ids: rolelist });
        // 更新
        this.refreshList();
        message.success('修改成功');
        this.handleRoleVisibleModal();
    };

    handleGetDepartmentList = async () => {
        const response = await departmentService.get();
        let data = utils.dict.listToDict(response.list, null, 'key', 'name');

        this.schema.department_key.dict = data;
    };

    handleGetRoleList = async () => {
        const roleList = await roleservice.get();
        let data = utils.dict.listToDict(roleList.list, null, 'id', 'chinese_name');
        this.schema.roles.dict = data;
        this.setState({
            roleList: data,
        });
    };
    handleVisiblePwdModal = (flag, record, action) => {
        this.setState({
            visiblePwdModal: !!flag,
            infoData: record,
            action,
        })
    }

    async handleEditPwd(data, schema) {
        // 更新
        let response
        if (!this.props.offline) {
            response = await this.service.editPwd(data, schema)
        } else {
            // 修改当前数据
            this.state.data.list.push(decorateItem(data, this.schema))
            this.setState({
                data: this.state.data,
            })
        }

        this.refreshList()
        message.success("修改成功")
        this.handleVisiblePwdModal()
        this.handleChangeCallback && this.handleChangeCallback()
        this.props.handleChangeCallback && this.props.handleChangeCallback()

        return response
    }

    renderOperateColumn(props = {}) {
        const { scroll } = this.meta;
        const { showEdit = true, showDelete = true } = props;
        return (
            !this.meta.readOnly &&
            !this.props.readOnly && {
                title: '操作',
                fixed: scroll && 'right',
                render: (text, record) =>
                    record.name != 'admin' && (
                        <Fragment>
                            {showEdit && (
                                <Authorized
                                    authority={this.meta.authority && this.meta.authority.update}
                                    noMatch={null}
                                >
                                    <a onClick={() => this.handleVisibleModal(true, record, actions.edit)}>修改</a>
                                </Authorized>
                            )}


                            {showDelete && (
                                <Authorized
                                    authority={this.meta.authority && this.meta.authority.delete}
                                    noMatch={null}
                                >
                                    <Divider type="vertical"/>
                                    <Popconfirm
                                        title="删除用户会影响相关数据的显示，确认删除？"
                                        onConfirm={(e) => {
                                            this.handleDelete(record);
                                            e.stopPropagation();
                                        }}
                                    >
                                        <a>删除</a>
                                    </Popconfirm>
                                </Authorized>
                            )}
                            <Divider type="vertical"/>
                            <Authorized
                                authority={this.meta.authority && this.meta.authority.update}
                                noMatch={null}
                            >
                                <a onClick={() => this.handleVisiblePwdModal(true, record, actions.edit)}>修改密码</a>
                            </Authorized>
                            {this.renderOperateColumnExtend(record)}
                        </Fragment>
                    ),
            }
        );
    }

    renderOperationButtons() {
        return <Button
            type="primary"
            onClick={async () => {
                await this.service.sync()
                message.info("任务已创建，请等待几分钟以后,刷新数据")
            }}
        >
            同步数据
        </Button>

    }

    // 扩展栏拨号按钮
    renderOperateColumnExtend(record) {
        if (record.name == 'admin') return null;
        let roles = record.roles && record.roles.split(',').map((item, index)=>{
            return parseInt(item)
        })
        return (
            <Authorized authority={'user_role_put'} noMatch={null}>
                <Divider type="vertical"/>
                <a
                    onClick={() => {
                        this.setState({ editRoleVisible: true, record: {...record, roles: roles} });
                    }}
                >
                    分配角色
                </a>
            </Authorized>
        );
    }

    /**
     * 渲染信息弹出框
     * @param customProps 定制的属性
     * @returns {*}
     */
    renderPwdModal(customProps = {}) {
        const { form } = this.props
        const renderForm = this.props.renderForm || this.renderForm
        const { resource, title, addArgs } = this.meta
        const { visiblePwdModal, infoData, action } = this.state
        const updateMethods = {
            handleVisibleModal: this.handleVisiblePwdModal.bind(this),
            handleUpdate: this.handleUpdate.bind(this),
            handleAdd: this.handleEditPwd.bind(this),
        }

        return (
            visiblePwdModal && (
                <InfoModal
                    renderForm={renderForm}
                    title={title}
                    action={"add"}
                    resource={resource}
                    {...updateMethods}
                    visible={visiblePwdModal}
                    values={infoData}
                    addArgs={addArgs}
                    meta={this.meta}
                    service={this.service}
                    schema={{password: {
                            title: "密码",
                            required: true,
                            listHide: true,
                            editHide: true,
                            type: schemaFieldType.Password,
                        }}}
                    {...this.meta.infoProps}
                    {...customProps}
                />
            )
        )
    }



    renderExtend() {
        const renderForm = this.renderForm;
        const { resource, title, addArgs } = this.meta;
        const { editRoleVisible, record } = this.state;
        const updateMethods = {
            handleVisibleModal: this.handleRoleVisibleModal,
            handleUpdate: this.handleRoleUpdate,
        };
        const { id, name, roles } = this.schema;

        return (
            <>{
                editRoleVisible && (
                    <InfoModal
                        renderForm={renderForm}
                        // form={this.props.from}
                        title={'用户角色分配'}
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
                                title: 'id',
                                editHide: true,
                                readOnly: true,
                            },
                            name: {
                                ...name,
                                required: false,
                                // editHide: true,
                                readOnly: true,
                            },
                            roles: {
                                ...roles,
                                dict: this.state.roleList,
                                required: true,
                                editHide: false,
                                infoHide: false,
                            },
                        }}
                    />
                )}
                {this.renderPwdModal()}
            </>
        );
    }

    // 搜索
    renderSearchBar() {
        const { name } = this.schema;
        const filters = this.createFilters({ name }, 5);
        return this.createSearchBar(filters);
    }
}

export default Form.create()(User);
