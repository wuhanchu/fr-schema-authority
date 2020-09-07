import "@ant-design/compatible/assets/index.css"
import { Tabs,Form } from "antd"
import React, { Component } from "react"
import classNames from "classnames"
import LoginContext from "./LoginContext"
import LoginItem from "./LoginItem"
import LoginSubmit from "./LoginSubmit"
import LoginTab from "./LoginTab"
import styles from "./index.less"

class Login extends Component {
    static Tab = LoginTab
    static Submit = LoginSubmit
    static defaultProps = {
        className: "",
        defaultActiveKey: "",
        onTabChange: () => {},
        onSubmit: () => {},
    }

    formRef = React.createRef();

    constructor(props) {
        super(props)
        this.state = {
            type: props.defaultActiveKey,
            tabs: [],
            active: {},
        }
    }

    componentDidMount() {
        const { onCreate } = this.props

        if (onCreate) {
            onCreate(this.formRef)
        }
    }

    onSwitch = (type) => {
        this.setState(
            {
                type,
            },
            () => {
                const { onTabChange } = this.props

                if (onTabChange) {
                    onTabChange(type)
                }
            }
        )
    }
    getContext = () => {
        const { tabs = [] } = this.state
        return {
            tabUtil: {
                addTab: (id) => {
                    this.setState({
                        tabs: [...tabs, id],
                    })
                },
                removeTab: (id) => {
                    this.setState({
                        tabs: tabs.filter((currentId) => currentId !== id),
                    })
                },
            },
            form: this.formRef,
            updateActive: (activeItem) => {
                const { type = "", active = {} } = this.state

                if (active[type]) {
                    active[type].push(activeItem)
                } else {
                    active[type] = [activeItem]
                }

                this.setState({
                    active,
                })
            },
        }
    }
    handleSubmit = (e) => {
        const { active = {}, type = "" } = this.state
        const { onSubmit } = this.props
        const activeFields = active[type] || []

        if (this.formRef) {
            this.formRef.current
                .validateFields()
                .then(async fieldsValue => {
                    if (onSubmit) {
                        onSubmit(fieldsValue)
                    }
                })
                .catch(err => {
                    console.log("err", err)
                })
        }
    }

    render() {
        const { className, children } = this.props
        const { type, tabs = [] } = this.state
        const TabChildren = []
        const otherChildren = []
        React.Children.forEach(children, (child) => {
            if (!child) {
                return
            }

            if (child.type.typeName === "LoginTab") {
                TabChildren.push(child)
            } else {
                otherChildren.push(child)
            }
        })
        return (
            <LoginContext.Provider value={this.getContext()}>
                <div className={classNames(className, styles.login)}>
                    <Form onFinish={this.handleSubmit} ref={this.formRef}>
                        {tabs.length ? (
                            <React.Fragment>
                                <Tabs
                                    animated={false}
                                    className={styles.tabs}
                                    activeKey={type}
                                    onChange={this.onSwitch}
                                >
                                    {TabChildren}
                                </Tabs>
                                {otherChildren}
                            </React.Fragment>
                        ) : (
                            children
                        )}
                    </Form>
                </div>
            </LoginContext.Provider>
        )
    }
}

Object.keys(LoginItem).forEach((item) => {
    Login[item] = LoginItem[item]
})
export default (Login)
