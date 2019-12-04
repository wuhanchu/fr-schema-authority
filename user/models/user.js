import services from "../services"
import lodash from "lodash"
import { reloadAuthorized } from "@/outter/fr-schema-antd-utils/src/utils/Authorized"
import { message } from "antd"

export default {
    namespace: "user",

    state: {
        init: null,
        list: [],
        currentUser: {}
    },

    effects: {
        *fetch(_, { call, put }) {
            const response = yield call(services.users.get)
            yield put({
                type: "save",
                payload: response
            })
        },
        *fetchCurrent(_, { call, put, select, take }) {
            try {
                const response = yield call(services.users.queryCurrent)
                const user = response.data
                yield put({
                    type: "saveCurrentUser",
                    payload: response.data
                })

                // 权限拼接
                let permissions = []
                user.roles &&
                    user.roles.forEach(item => {
                        permissions.push(item.name)
                    })

                // todo net version need to delete
                user.permissions &&
                    user.permissions.forEach(item => {
                        item.key && permissions.push(item.key)

                        item.key &&
                            item.key.split("_").forEach((_, index) => {
                                permissions.push(
                                    item.key.split("_", index + 1).join("_")
                                )
                            })
                        permissions.push(item.role_name)
                    })

                // The iteration of function
                user.permission_groups &&
                    user.permission_groups.forEach(item => {
                        item.key && permissions.push(item.key)
                    })

                // get permission
                permissions = lodash.uniq(permissions)
                console.info("permissions", permissions)

                // 修改登录
                yield put({
                    type: "login/changeLoginStatus",
                    payload: {
                        type: "account",
                        status: "ok",
                        user,
                        currentAuthority: [].concat(permissions)
                    }
                })
                take("login/changeLoginStatus/@@end")
                reloadAuthorized()

                yield put({
                    type: "save",
                    payload: {
                        init: true
                    }
                })
            } catch (e) {
                console.log("error", e)
                message.error(e.message)
            }
        }
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        saveCurrentUser(state, action) {
            return {
                ...state,
                currentUser: action.payload || {}
            }
        },
        changeNotifyCount(state, action) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload.totalCount,
                    unreadCount: action.payload.unreadCount
                }
            }
        }
    }
}
