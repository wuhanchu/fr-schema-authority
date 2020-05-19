import React, { PureComponent } from "react"
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { message, Modal, Spin } from "antd";
import services from "../services"
import schemas from "../schemas"
import InfoModal from "@/outter/fr-schema-antd-utils/src/components/Page/InfoModal"
import frSchema from "@/outter/fr-schema/src/index"

/**
 * handleAdd 提交后回调
 * onCancel 取消时回调
 */
@Form.create()
class LicenseUpload extends PureComponent {
    state = {
        loading: true,
        machine_info: null,
        file: null
    }

    async componentDidMount() {
        this.setState({ loading: true }, async () => {
            const res = await services.license.get()
            this.setState({
                loading: false,
                data: {
                    machine_info:
                        res.machine_info || (res.data && res.data.machine_info)
                }
            })
        })
    }

    handleSubmit = async args => {
        console.log("args", args)
        const formData = new FormData()
        formData.append("license", args.file.file)
        const res = await services.license.post(formData)
        message.success("上传成功")
        this.props.onCancel && this.props.onCancel()
        this.props.handleAdd && this.props.handleAdd(formData)
    }

    getSchema() {
        const { file, machine_info } = schemas.license
        return { machine_info, file }
    }

    render() {
        const { data, loading } = this.state
        const { form } = this.props
        const component = loading ? (
            <Modal visible={true} footer={null} title={"机器码获取"}>
                <Spin />
            </Modal>
        ) : (
            <InfoModal
                title="证书提交"
                visible={true}
                form={form}
                schema={this.getSchema()}
                action={frSchema.actions.edit}
                values={data}
                handleUpdate={this.handleSubmit}
                {...this.props}
            />
        )
        return component
    }
}

export default LicenseUpload
