import React, { Fragment, PureComponent } from "react"
import { Input, Row, Col, Skeleton, Tree, Switch, Divider } from "antd"
import Ltt from "list-to-tree"
import services from "../services"

import roleServices from "../../role/services.js"

import { globalStyle } from "@/styles/global"
import clone from "clone"
import * as lodash from "lodash"
export class FunctionTree extends PureComponent {
    functitonMap = {} // store key -> function item
    functitonMapById = {} // store key -> function item

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
        console.debug("init roleRecord", roleRecord)

        // stor
        this.functitonMap = {}
        this.functitonMapById = {}

        const functionList = (await services.functions.get({
            pageSize: 9999
        })).list.map(item => {
            this.functitonMap[item.key] = item
            this.functitonMapById[item.id] = item

            return {
                ...item,
                parent_key: item.parent_key || 0
            }
        })

        const checkedIds = (await roleServices.roles.getFunctions({
            role_id: roleRecord.id,
            pageSize: 9999
        })).list.map(
            item => item.id
        )
        this.props.onChange && this.props.onChange(checkedIds)

        const checkedKeys = checkedIds.map(
            item => this.functitonMapById[item].key
        )

        console.debug("init functionList", functionList)
        console.debug("init roleFunctionList", checkedKeys)

        // let data = clone(treeData)
        // data.forEach(item => (item.parentNodeId = item.parentNodeId || 0))

        this.data = this.convertToTree(functionList)

        console.debug("tree data", this.data)
        this.setState({
            data: this.data,
            checkedKeys
        })

        // if (this.props.type) {
        //     this.data = [this.data[this.props.type === "type" ? 0 : 1]]
        // } else {
        //     this.data = this.data
        // }

        // this.setState({
        //     data: this.data,
        //     statistics
        // })
    }

    componentDidMount() {
        this.init()
    }

    convertToTree(data) {
        const ltt = new Ltt(data, {
            key_id: "key",
            key_parent: "parent_key",
            key_child: "children"
        })
        ltt.sort((a, b) => {
            return (
                (!lodash.isEmpty(a.children) ? 1 : 0) -
                (!lodash.isEmpty(b.children) ? 1 : 0)
            )
        })
        return ltt.GetTree()
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
                    display: item.hide ? "none" : ""
                }}
                // icon={({ selected }) =>
                //     item.nodeIcon ? <IconFont type={item.nodeIcon} /> : null
                // }
                // selectable={true}
                title={item.group_name}
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
                    item.group_name.indexOf(value) > -1
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
        console.log(checkedKeys)
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
        console.log(checkedKeys)
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
            console.log(node)
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
                    {data ? (
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
                                    console.log(value)
                                    const checkedKeys = value.checked || value
                                    let key = this.diff(
                                        checkedKeys,
                                        this.state.checkedKeys
                                    )[0]
                                    this.setState({
                                        checkedKeys,
                                        datas: []
                                    })

                                    if (
                                        checkedKeys.length <
                                        this.state.checkedKeys.length
                                        // this.state.checkStrictly
                                    ) {
                                        console.log("删除")
                                        this.traverseTree(
                                            this.data[0],
                                            key,
                                            "delete"
                                        )
                                    } else if (
                                        checkedKeys.length >
                                            this.state.checkedKeys.length &&
                                        !this.state.checkStrictly
                                    ) {
                                        console.log("添加")

                                        this.traverseTree(
                                            this.data[0],
                                            key,
                                            "add"
                                        )
                                    }

                                    console.log(this.state.checkedKeys)
                                    this.setState({
                                        datas: []
                                    })
                                    const checkIds = checkedKeys.map(
                                        key => this.functitonMap[key].id
                                    )
                                    this.props.onChange &&
                                        this.props.onChange(checkIds)
                                }}
                                checkedKeys={this.state.checkedKeys}
                            >
                                {nodeList}
                            </Tree>
                        </div>
                    ) : (
                        <Skeleton active />
                    )}
                </Row>
            </Fragment>
        )
    }
}

export default FunctionTree
