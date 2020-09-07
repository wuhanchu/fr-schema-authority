import frSchema from '@/outter/fr-schema/src';
import schema from './schema';
import service from './service';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Divider, message, Modal, Popconfirm } from 'antd';
import { Fragment } from 'react';

import frSchemaUtils from '@/outter/fr-schema-antd-utils/src';

const { Authorized } = frSchemaUtils.components;
import FunctionTree from '../permission/components/FunctionTree';

const { ListPage } = frSchemaUtils.components;
const { actions } = frSchema;

/**
 * 通话记录
 */

class Role extends ListPage {
    constructor(props) {
        super(props, {
            schema,
            service,
            infoProps: {
                offline: true,
            },
            authorityKey: 'role',
        });
        this.state.roleList = [];
        this.state.showData = [];
        this.state.permissionDict = [];
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    onCheck = (checkedKeys, info) => {
        this.setState({ permissionDict: checkedKeys });
        console.log('onCheck', checkedKeys, info);
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
                    record.name != 'superadmin' && (
                        <Fragment>
                            {showEdit && record.name != 'superadmin' && (
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
                                        title="是否要删除此行？"
                                        onConfirm={async (e) => {
                                            this.handleDelete(record);
                                            e.stopPropagation();
                                        }}
                                    >
                                        <a>删除</a>
                                    </Popconfirm>
                                </Authorized>
                            )}
                            {this.renderOperateColumnExtend(record)}
                        </Fragment>
                    ),
            }
        );
    }

    handleOk = async () => {
        try {
            await this.service.putFunctions({
                id: this.state.record.id,
                role_permission_scope: this.state.permissionScopeList,
            });
        } catch (error) {
            message.error('权限相同');
        }

        this.refreshList();
        this.setState({ editPermissionVisible: false });
    };

    handleSetPermission = async (record) => {
        // let permissionList = await this.service.getPermission(record.id);
        // let permissionDict = [];
        // for (let i = 0; i < permissionList.list.length; i++) {
        //   permissionDict.push(permissionList.list[i].id.toString());
        // }
        this.setState({
            editPermissionVisible: true,
            record: record,
        });
    };

    renderOperateColumnExtend(record) {
        if (record.name == 'superadmin') {
            return null;
        }
        console.log(record.name == 'superadmin');
        return (
            <Fragment>
                <Authorized authority={'role_permission_put'} noMatch={null}>
                    <Divider type="vertical"/>
                    <a
                        onClick={() => {
                            this.handleSetPermission(record);
                        }}
                    >
                        权限分配
                    </a>
                </Authorized>
                <Authorized authority={'role_permission_scope_put'}>
                    <Divider type="vertical"/>
                    <a
                        onClick={() => {
                            this.handleSetPermission(record);
                        }}
                    >
                        功能分配
                    </a>
                </Authorized>
            </Fragment>
        );
    }

    onChangeinput = (value) => {
        let teacherList = this.state.roleList.filter((val) => {
            try {
                return val.name.match(value.target.value);
            } catch {
                return val;
            }
        });
        this.setState({
            showData: teacherList,
        });
    };

    renderExtend() {
        return (
            this.state.editPermissionVisible && (
                <Modal
                    title="功能分配"
                    visible={true}
                    onOk={this.handleOk}
                    okText={'授权'}
                    onCancel={() => {
                        this.setState({ editPermissionVisible: false });
                    }}
                >
                    <FunctionTree
                        onChange={(permissionScopeList) => {
                            this.setState({
                                permissionScopeList,
                            });
                        }}
                        record={this.state.record}
                    ></FunctionTree>
                </Modal>
            )
        );
    }

    // 搜索
    renderSearchBar() {
        const { name } = this.schema;
        const filters = this.createFilters({ name }, 5);
        return this.createSearchBar(filters);
    }
}

export default Role;
