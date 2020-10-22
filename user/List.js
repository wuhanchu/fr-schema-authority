import frSchema from '@/outter/fr-schema/src';

import schema from './schema';
import service from './service';
import { Fragment } from 'react';
import '@ant-design/compatible/assets/index.css';
import frSchemaUtils from '@/outter/fr-schema-antd-utils/src';

import { Divider, message, Popconfirm, Button } from 'antd';
import roleService from '../role/service';
import clone from 'clone';

import departmentService from '../department/service';

const { Authorized } = frSchemaUtils.components;
const { InfoModal } = frSchemaUtils.components;

const { ListPage } = frSchemaUtils.components;
const { utils, actions } = frSchema;

/**
 * 通话记录
 */
export class User extends ListPage {
    constructor(props) {
        super(props, {
            schema: clone(schema),
            showSelect: true,
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
        this.setState({ init: true });
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
        await this.service.editRole({
            id: data.id || this.state.selectedRows.map((item) => item.id),
            role_ids: rolelist,
        });
        // 更新
        this.refreshList();
        message.success('修改成功');
        this.handleRoleVisibleModal();
    };

    handleGetDepartmentList = async () => {
        const response = await departmentService.get({ pageSize: 9999 });
        let data = utils.dict.listToDict(response.list, null, 'key', 'name');

        this.schema.department_key.dict = data;
    };

    handleGetRoleList = async () => {
        const roleList = await roleService.get({ pageSize: 9999 });
        let data = utils.dict.listToDict(roleList.list, null, 'id', 'chinese_name');
        this.schema.roles.dict = data;
        this.setState({
            roleList: data,
        });
    };

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
                                    <a
                                        onClick={() =>
                                            this.handleVisibleModal(true, record, actions.edit)
                                        }
                                    >
                                        修改
                                    </a>
                                </Authorized>
                            )}
                            {showDelete && (
                                <Authorized
                                    authority={this.meta.authority && this.meta.authority.delete}
                                    noMatch={null}
                                >
                                    <Divider type="vertical" />
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
                            <Authorized authority={'user_role_put'} noMatch={null}>
                                <Divider type="vertical" />
                                <a
                                    onClick={() => {
                                        this.setState({ editRoleVisible: true, record: record });
                                    }}
                                >
                                    分配角色
                                </a>
                            </Authorized>
                            {this.renderOperateColumnExtend(record)}
                        </Fragment>
                    ),
            }
        );
    }

    renderOperationMulit() {
        return (
            <span>
                <Button
                    onClick={(e) => {
                        this.setState({
                            editRoleVisible: true,
                        });
                    }}
                >
                    批量分配角色
                </Button>
            </span>
        );
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

        let schema = {
            id: {
                ...id,
                title: 'id',
                editHide: true,
                readOnly: true,
            },
            name: {
                ...name,
                required: false,
                readOnly: true,
            },
            roles: {
                ...roles,
                dict: this.state.roleList,
                required: true,
                editHide: false,
                infoHide: false,
            },
        };
        if (!record) {
            delete schema.name;
        }

        return (
            editRoleVisible && (
                <InfoModal
                    renderForm={renderForm}
                    title={'用户角色分配'}
                    action={frSchema.actions.edit}
                    resource={resource}
                    {...updateMethods}
                    values={record}
                    visible={editRoleVisible}
                    addArgs={addArgs}
                    meta={this.meta}
                    schema={schema}
                />
            )
        );
    }

    /**
     * 处理数据新增
     * @param data
     * @returns {Promise<void>}
     */
    async handleAdd(data, schema) {
        // 更新
        let response;
        if (!this.props.offline) {
            try {
                response = await this.service.post(data, schema);
                message.success('添加成功');
            } catch (error) {
                message.error(error.message);
            }
        } else {
            // 修改当前数据
            this.state.data.list.push(decorateItem(data, this.schema));
            this.setState({
                data: this.state.data,
            });
        }

        this.refreshList();
        this.handleVisibleModal();
        this.handleChangeCallback && this.handleChangeCallback();
        this.props.handleChangeCallback && this.props.handleChangeCallback();

        return response;
    }

    // 搜索
    renderSearchBar() {
        if (!this.state.init) {
            return null;
        }
        const { name, department_key } = this.schema;
        const filters = this.createFilters({ name, department_key }, 4);
        return this.createSearchBar(filters);
    }
}

export default User;
