import clone from 'clone';
import frSchemaUtils from '@/outter/fr-schema-antd-utils/src';
import { message } from 'antd';
import frSchema from '@/outter/fr-schema/src';

import schema from './schema';
import service from './service';
import '@ant-design/compatible/assets/index.css';

const { decorateItem, getPrimaryKey } = frSchema;

const { DataList } = frSchemaUtils.components;

export class List extends DataList {
    constructor(props) {
        super(props, {
            schema: clone(schema),
            queryArgs: {
                // pageSize: 9999,
                order: 'client_id.asc',
            },
            infoProps: {
                offline: true,
            },
            service,
            // addHide: true,
            showDelete: false,
        });
    }

    /**
     * 处理数据更新
     * @param data
     * @returns {Promise<void>}
     */
    handleUpdate = async (data, schema, method = 'patch') => {
        // 更新
        let response;
        let grant_type = JSON.stringify(data.grant_type);
        const client_metadata = {
            grant_types: data.grant_type,
            scope: data.scope,
            response_types: data.response_type,
        };

        if (!this.props.offline) {
            response = await this.service[method]({ ...data, grant_type, client_metadata }, schema);
        }

        // 修改当前数据
        const idKey = getPrimaryKey(this.schema);

        this.state.data &&
            this.state.data.list.some((item, index) => {
                if (data[idKey] === item[idKey]) {
                    this.state.data.list[index] = decorateItem(data, this.schema);
                    return true;
                }
            });

        //
        this.setState({
            data: this.state.data,
        });
        this.refreshList();
        message.success('修改成功');

        //
        this.handleVisibleModal();
        this.handleChangeCallback && this.handleChangeCallback();
        this.props.handleChangeCallback && this.props.handleChangeCallback();

        return response;
    };
}

export default List;
