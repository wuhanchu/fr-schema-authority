import React, { PureComponent } from 'react';
import '@ant-design/compatible/assets/index.css';
import { message, Modal, Spin } from 'antd';
import service from './service';
import schema from './schema';
import frSchemaUtils from '@/outter/fr-schema-antd-utils/src';
import actions from '@/outter/fr-schema/src/actions';

const { InfoModal } = frSchemaUtils.components;

/**
 * handleAdd 提交后回调
 * onCancel 取消时回调
 */
class LicenseUpload extends PureComponent {
    state = {
        loading: true,
        machine_info: null,
        file: null,
    };

    componentDidMount() {
        this.setState({ loading: true }, async () => {
            const res = await service.get();
            this.setState({
                loading: false,
                data: {
                    machine_info:
                        res.machine_info || (res.data && res.data.machine_info),
                },
            });
        });
    }

    handleSubmit = async args => {
        console.log('args', args);
        const formData = new FormData();
        formData.append('license', args.file.file);
        await service.post(formData);
        message.success('上传成功');
        this.props.onCancel && this.props.onCancel();
        this.props.handleAdd && this.props.handleAdd(formData);
    };

    getSchema() {
        const { file, machine_info } = schema;
        return { machine_info, file };
    }

    render() {
        const { data, loading } = this.state;
        return loading? (
            <Modal visible={true} footer={null} title={'机器码获取'}>
                <Spin/>
            </Modal>
        ) : (
            <InfoModal
                title="证书提交"
                visible={true}
                schema={this.getSchema()}
                action={actions.edit}
                values={data}
                handleUpdate={this.handleSubmit}
                {...this.props}
            />
        );
    }
}

export default LicenseUpload;
