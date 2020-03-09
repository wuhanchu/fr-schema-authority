import React, { Fragment, PureComponent } from "react"
import { Button, Card, Col, Divider, Form, Row, Skeleton } from "antd"
import InfoForm from "@/outter/fr-schema-antd-utils/src/components/Page/InfoForm"
import PageHeaderWrapper from "@ant-design/pro-layout/lib/PageHeaderWrapper"
import LicenseUpload from "@/pages/authority/permission/components/LicenseUpload"
import services from "./services"
import schemas from "./schemas"

import frSchema from "@/outter/fr-schema/src"
const { actions } = frSchema
import config from "@/config"
/**
 * 注册信息界面
 */
@Form.create()
class License extends PureComponent {
    state = {
        loading: true, // 是否加载中
        data: null // 证书数据
    }

    componentDidMount() {
        this.setData()
    }

    setData = async () => {
        const { product_key } = config
        const res = await services.license.get({ product_key })
        const { machine_info } = res.data

        this.setState({
            loading: false,
            data: { machineCode: machine_info, ...res.data }
        })
    }

    renderLicenseUpload() {
        const { showLicenseUpload } = this.state
        return (
            showLicenseUpload && (
                <LicenseUpload
                    onCancel={() =>
                        this.setState({
                            showLicenseUpload: false
                        })
                    }
                    handleAdd={this.setData}
                />
            )
        )
    }

    render() {
        const { data, loading } = this.state

        return (
            <PageHeaderWrapper title={"注册信息"}>
                <Card bordered={false} style={{ width: "100%" }}>
                    {loading ? (
                        <Skeleton />
                    ) : (
                        <Fragment>
                            <Row justify="start" type="flex">
                                <Col>
                                    <Button
                                        onClick={() => {
                                            this.setState({
                                                showLicenseUpload: true
                                            })
                                        }}
                                    >
                                        上传证书
                                    </Button>
                                </Col>
                            </Row>
                            <Divider />
                            <Row justify="start" type="flex">
                                <Col>
                                    <InfoForm
                                        action={actions.show}
                                        values={data}
                                        schema={schemas.license}
                                        form={this.props.form}
                                    />
                                </Col>
                            </Row>
                        </Fragment>
                    )}
                    {this.renderLicenseUpload()}
                </Card>
            </PageHeaderWrapper>
        )
    }
}

export default License
