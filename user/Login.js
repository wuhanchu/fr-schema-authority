import {Alert} from "antd"
import {formatMessage, FormattedMessage, injectIntl} from "umi"
import React, {Component} from "react"
import {connect} from "dva"
import LoginComponents from "./components/Login"
import styles from "./Login.less"
import LicenseUpload from "@/pages/authority/permission/license/LicenseUpload"

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents

@connect(({ login, loading }) => ({
    userLogin: login,
    submitting: loading.effects["login/login"],
}))
class Login extends Component {
    loginForm = undefined
    state = {
        type: "account",
        autoLogin: true,
    }

    changeAutoLogin = (e) => {
        this.setState({
            autoLogin: e.target.checked,
        })
    }
    handleSubmit = (values) => {
        const {type} = this.state
        const {dispatch} = this.props
        dispatch({
            type: "login/login",
            payload: {...values, type},
        })
    }
    onTabChange = (type) => {
        this.setState({
            type,
        })
    }
    onGetCaptcha = () =>
        new Promise((resolve, reject) => {
            if (!this.loginForm) {
                return
            }

            this.formRef.current
                .validateFields()
                .then(async values => {
                    const {dispatch} = this.props
                    try {
                        const success = await dispatch({
                            type: "login/getCaptcha",
                            payload: values.mobile,
                        })
                        resolve(!!success)
                    } catch (error) {
                        reject(error)
                    }
                })
                .catch(err => {
                    console.log("err", err)
                })
        })
    renderMessage = (content) => (
        <Alert
            style={{
                marginBottom: 24,
            }}
            message={content}
            type="error"
            showIcon
        />
    )

    renderLicenseUpload() {
        const { showLicenseUpload } = this.state
        return (
            showLicenseUpload && (
                <LicenseUpload
                    onCancel={() =>
                        this.setState({
                            showLicenseUpload: false,
                        })
                    }
                />
            )
        )
    }

    render() {
        const { userLogin, submitting } = this.props
        const { status, type: loginType } = userLogin
        const { type, autoLogin } = this.state
        return (
            <div className={styles.main}>
                <LoginComponents
                    defaultActiveKey={type}
                    onTabChange={this.onTabChange}
                    onSubmit={this.handleSubmit}
                    onCreate={(form) => {
                        this.loginForm = form
                    }}
                >
                    <div className={styles.other}>
                        <UserName
                            name="userName"
                            placeholder={`${this.props.intl.formatMessage({
                                id: "user-login.login.userName",
                            })}`}
                            rules={[
                                {
                                    required: true,
                                    message: this.props.intl.formatMessage({
                                        id: "user-login.userName.required",
                                    }),
                                },
                            ]}
                        />
                        <Password
                            name="password"
                            placeholder={`${this.props.intl.formatMessage({
                                id: "user-login.login.password",
                            })}`}
                            rules={[
                                {
                                    required: true,
                                    message: this.props.intl.formatMessage({
                                        id: "user-login.password.required",
                                    }),
                                },
                            ]}
                            onPressEnter={(e) => {
                                e.preventDefault()

                                if (this.loginForm) {
                                    this.loginForm.current
                                        .validateFields()
                                        .then(async fieldsValue => {
                                            this.handleSubmit(fieldsValue)
                                        })
                                        .catch(err => {
                                            console.log("err", err)
                                        })
                                }
                            }}
                        />
                    </div>
                    <Submit loading={submitting}>
                        <FormattedMessage id="user-login.login.login" />
                    </Submit>
                    <div className={styles.other}>
                        <div
                            onClick={() => {
                                this.setState({ showLicenseUpload: true })
                            }}
                        >
                            <a className={styles.register}>证书上传</a>
                        </div>
                    </div>
                </LoginComponents>
                {this.renderLicenseUpload()}
            </div>
        )
    }
}

export default injectIntl(Login)
