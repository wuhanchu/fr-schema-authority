import React, { Fragment, PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, Divider, Row, Skeleton } from 'antd';
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import LicenseUpload from '@/pages/authority/permission/license/LicenseUpload';
import service from './service';
import schema from './schema';

import actions from '@/outter/fr-schema/src/actions';
import frSchemaUtils from '@/outter/fr-schema-antd-utils/src';

const {InfoForm} = frSchemaUtils
const config = SETTING

/**
 * 注册信息界面
 */
class License extends PureComponent {
    formRef = React.createRef();

    state = {
        loading: true, // 是否加载中
        data: null // 证书数据
    }

    componentDidMount() {
        this.setData()
    }

    setData = async () => {
        const { product_key } = config
        const res = await service.get({ product_key })

        this.setState({
            loading: false,
            data: {
                machineCode: res.data && res.data.machine_info,
                ...res.data,
                ...res
            }
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
                    {loading? (
                        <Skeleton/>
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
                            <Divider/>
                            <Row justify="start" type="flex">
                                <Col>
                                    <InfoForm
                                        action={actions.show}
                                        values={data}
                                        schema={schema}
                                        form={this.formRef}
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
