import { routerRedux } from "dva/router"
import { message } from "antd"
import { stringify } from "qs"
import services from "../services"
import { reloadAuthorized } from "@/outter/fr-schema-antd-utils/src/utils/Authorized"
import { setAuthority } from "@/outter/fr-schema-antd-utils/src/utils/authority"
import { getPageQuery } from "@/outter/fr-schema-antd-utils/src/utils/utils"

export default {
    namespace: "login",

    state: {
        status: undefined
    },

    effects: {
        *login({ payload }, { call, put, take }) {
            let token = null
            token = yield call(services.users.login, payload)
            if (token && token.data) {
                token.data.expires = token.expires.getTime()
                localStorage.setItem("token", JSON.stringify(token.data))

                yield put({
                    type: "save",
                    payload: { token: token.data }
                })

                yield put({ type: "user/fetchCurrent" })
                yield take("user/fetchCurrent/@@end")

                //get user
                const urlParams = new URL(window.location.href)
                const params = getPageQuery()
                let { redirect } = params
                if (redirect) {
                    const redirectUrlParams = new URL(redirect)
                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length)
                        if (redirect.startsWith("/#")) {
                            redirect = redirect.substr(2)
                        }
                        if (redirect.startsWith("/static")) {
                            redirect = redirect.substr(7)
                        }
                        // yield put(routerRedux.replace(redirect || "/"))
                    } else {
                        // window.location.href = redirect
                    }
                    window.location.replace(redirect)
                }
            }
        },

        *logout(_, { put }) {
            yield put({
                type: "changeLoginStatus",
                payload: {
                    status: false,
                    currentAuthority: "guest"
                }
            })
            reloadAuthorized()

            const { redirect } = getPageQuery() // redirect

            localStorage.clear()
            sessionStorage.clear()

            if (window.location.pathname !== "/user/login" && !redirect) {
                yield put(
                    routerRedux.replace({
                        pathname: "/user/login",
                        search: stringify({
                            redirect: window.location.href
                        })
                    })
                )
            }
        }
    },
    reducers: {
        changeLoginStatus(state, { payload }) {
            setAuthority(payload.currentAuthority)
            return {
                ...state,
                status: payload.status,
                type: payload.type
            }
        }
    }
}
