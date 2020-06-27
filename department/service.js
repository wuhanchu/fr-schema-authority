import schema from "./schema"

import { createApi } from "@/outter/fr-schema/src/service";

// 用户
let service = createApi("user_auth/department", schema, null, "eq.")

export default service
