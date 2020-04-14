import antdUtils from "@/outter/fr-schema-antd-utils/src"

import schema from "./schema"
import service from "./service"
import { Form } from "antd"
import clone from "clone"

const { ListPage } = antdUtils.components

export class List extends ListPage {
    constructor(props) {
        super(props, {
            schema: clone(schema),
            authorityKey: "department",
            infoProps: {
                offline: true
            },
            service
        })
    }

}

export default Form.create()(List)
