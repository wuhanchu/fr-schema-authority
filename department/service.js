import schemas from "./schema"

import frSchema from "@/outter/fr-schema/src"

const { createApi } = frSchema

// 用户
let service = createApi("user_auth/department", schemas)

export default service
