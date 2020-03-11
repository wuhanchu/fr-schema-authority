import React, { Fragment, PureComponent } from "react"
import { Col, Divider, Input, Row, Skeleton, Switch, Tree } from "antd"
import services from "../services"

import roleServices from "../../role/services.js"

import { globalStyle } from "@/styles/global"
import clone from "clone"
import smartArrayToTree from "smart-arraytotree"

export class FunctionTree extends PureComponent {
    functitonMap = {} // store key -> function item
    functitonMapByKey = {} // store key -> function item

    static defaultProps = {
        showStatistics: true,
        hideZero: false
    }

    state = {
        data: null,
        checkStrictly: true,
        checkedKeys: [],
        datas: []
    }

    async init() {
        let { record: roleRecord } = this.props

        // stor
        this.functitonMap = {}
        this.functitonMapByKey = {}

        let functionList = (await services.functions.get({
            pageSize: 9999,
            order: "parent_key.desc"
        })).list

        console.debug("functionList", functionList)

        functionList = functionList.map(item => {
            this.functitonMap[item.key] = item
            this.functitonMapByKey[item.key] = item

            return item
        })

        const checkedKeys = (await roleServices.roles.getFunctions({
            role_id: roleRecord.id,
            pageSize: 9999
        })).list.map(item => this.functitonMapByKey[item.key].key)

        this.data = this.convertToTree(functionList)
        console.debug("treeData", this.data)

        this.setState({
            data: this.data,
            checkedKeys
        })
        this.props.onChange && this.props.onChange(checkedKeys)
    }

    componentDidMount() {
        this.init()
    }

    convertToTree(data) {
        const tempData = smartArrayToTree(data.map(item => ({
            ...item,
            treeKey: !item.key || item.key == "login"? item.key : item.product_key + "_" + item.key,
            treeParentKey: !item.parent_key || item.parent_key == "login" && item.parent_key == "login"? item.parent_key : item.product_key + "_" + item.parent_key,
        })), {
            id: 'treeKey',
            pid: 'treeParentKey',
            firstPid: null
        })

        return tempData
    }

    renderNode(item) {
        if (!item) {
            return null
        }

        return (
            <Tree.TreeNode
                key={item.key}
                value={item.key}
                item={item}
                checkable={true}
                // nodeName={item.nodeName}
                disableCheckbox={
                    item.parent_key &&
                    this.state.checkedKeys &&
                    !this.state.checkedKeys.includes(item.parent_key)
                }
                style={{
                    display: item.hide? "none" : ""
                }}
                // icon={({ selected }) =>
                //     item.nodeIcon ? <IconFont type={item.nodeIcon} /> : null
                // }
                // selectable={true}
                title={item.name}
            >
                {item.children &&
                item.children.map(childItem => {
                    return this.renderNode(childItem)
                })}
            </Tree.TreeNode>
        )
    }

    checkValue(data, value) {
        let result = false
        data &&
        data.forEach((item, index) => {
            if (
                this.checkValue(item.children, value) ||
                item.name.indexOf(value) > -1
            ) {
                result = true
                return
            }
            item.hide = true
        })
        return result
    }

    // 遍历单个节点
    traverseNode(node) {
        let data = this.state.datas

        data.push(node.key)
        this.setState({
            datas: data
        })
    }

    deleteNodeData(node, type) {
        let checkedKeys = this.state.checkedKeys
        // let checkedKeysCopy = [...this.state.checkedKeys]
        if (checkedKeys.indexOf(node.key) != -1) {
            checkedKeys.splice(checkedKeys.indexOf(node.key), 1)
        }
        this.setState({
            checkedKeys: checkedKeys
        })
    }

    addNodeData(node, type) {
        let checkedKeys = this.state.checkedKeys
        // let checkedKeysCopy = [...this.state.checkedKeys]
        if (checkedKeys.indexOf(node.key) == -1) {
            checkedKeys.push(node.key)
        }
        this.setState({
            checkedKeys: checkedKeys
        })
    }

    deleteTreeData(node, type) {
        if (!node) {
            return
        }
        if (type == "add") {
            this.addNodeData(node, type)
        }
        if (type == "delete") {
            this.deleteNodeData(node, type)
        }

        if (node.children && node.children.length > 0) {
            var i = 0
            for (i = 0; i < node.children.length; i++) {
                this.deleteTreeData(node.children[i], type)
            }
        }
    }

    traverseTree(node, key, type) {
        if (!node) {
            return
        }

        if (node.key == key) {
            this.deleteTreeData(node, type)
        }
        this.traverseNode(node)
        if (node.children && node.children.length > 0) {
            var i = 0
            for (i = 0; i < node.children.length; i++) {
                this.traverseTree(node.children[i], key, type)
            }
        }
    }

    diff(arr1, arr2) {
        var newArr = []
        var arr3 = arr1.concat(arr2) //将arr1和arr2合并为arr3
        function isContain(value) {
            //找出arr3中不存在于arr1和arr2中的元素
            return arr1.indexOf(value) == -1 || arr2.indexOf(value) == -1
        }

        newArr = arr3.filter(isContain)
        return newArr
    }

    render() {
        // const { showType } = this.props

        const { data } = this.state
        if (!data) {
            return null
        }

        let nodeList = []
        data &&
        data.forEach(item => {
            const node = this.renderNode(item)
            node && nodeList.push(node)
        })

        return (
            <Fragment>
                <Row type="flex" justify="space-between">
                    <Col span={16}>
                        <Input.Search
                            placeholder="搜索"
                            size="small"
                            onChange={event => {
                                const value = event.target.value
                                if (!value) {
                                    return this.setState({ data: this.data })
                                }
                                let data = clone(this.data)
                                this.checkValue(data, value)
                                this.setState({
                                    data
                                })
                            }}
                        />
                    </Col>
                    <Col span={4}>
                        <Switch
                            checkedChildren="级联"
                            unCheckedChildren="单选"
                            onChange={value => {
                                this.setState({ checkStrictly: !value })
                            }}
                        />
                    </Col>
                </Row>
                <Divider style={{ marginBottom: 4, marginTop: 12 }}></Divider>
                <Row>
                    {data? (
                        <div
                            style={{
                                overflowY: "scroll",
                                maxHeight: globalStyle.tree.height
                            }}
                        >
                            <Tree
                                checkable
                                checkStrictly={true}
                                defaultExpandAll={true}
                                onCheck={value => {
                                    const checkedKeys = value.checked || value
                                    let key = this.diff(
                                        checkedKeys,
                                        this.state.checkedKeys
                                    )[0]
                                    this.setState({
                                        checkedKeys,
                                        datas: []
                                    })
                                    let notStrictly = null
                                    if (
                                        checkedKeys.length <
                                        this.state.checkedKeys.length
                                        // this.state.checkStrictly
                                    ) {
                                        this.traverseTree(
                                            this.data[0],
                                            key,
                                            "delete"
                                        )
                                    } else if (
                                        checkedKeys.length >=
                                        this.state.checkedKeys.length
                                    ) {
                                        if (this.state.checkStrictly) {

                                            notStrictly = checkedKeys
                                        } else {

                                            this.traverseTree(
                                                this.data[0],
                                                key,
                                                "add"
                                            )
                                        }
                                    }

                                    this.setState({
                                        datas: []
                                    })
                                    let checkIds
                                    if (notStrictly) {
                                        checkIds = notStrictly.map(
                                            key => this.functitonMap[key]
                                        )
                                    } else {
                                        checkIds = this.state.checkedKeys.map(
                                            key => this.functitonMap[key]
                                        )
                                    }

                                    this.props.onChange &&
                                    this.props.onChange(checkIds)
                                }}
                                checkedKeys={this.state.checkedKeys}
                            >
                                {nodeList}
                            </Tree>
                        </div>
                    ) : (
                        <Skeleton active/>
                    )}
                </Row>
            </Fragment>
        )
    }
}

export default FunctionTree
