import service from "../service"
import lodash from "lodash"
import { reloadAuthorized } from "@/outter/fr-schema-antd-utils/src/utils/Authorized"
import { message } from "antd"

export default {
    namespace: "user",

    state: {
        init: null,
        list: [],
        currentUser: null
    },

    effects: {
        *fetch(_, { call, put }) {
            const response = yield call(service.get)
            yield put({
                type: "save",
                payload: response
            })
        },
        *fetchCurrent(_, { call, put, select, take }) {
            try {
                const response = yield call(service.queryCurrent)

                if (response instanceof Error) {
                    throw response
                }

                const user = response
                yield put({
                    type: "saveCurrentUser",
                    payload: response
                })

                // 权限拼接
                let permissions = []
                user.roles &&
                    user.roles.forEach(item => {
                        permissions.push(item.name)
                    })

                // The iteration of function
                user.permission_scopes &&
                    user.permission_scopes.forEach(item => {
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
                e.message && message.error(e.message)
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
