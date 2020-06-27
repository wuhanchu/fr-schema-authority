import { stringify } from "qs"
import { history } from "umi";
import service from "../service"
import { reloadAuthorized } from "@/outter/fr-schema-antd-utils/src/utils/Authorized"
import { setAuthority } from "@/outter/fr-schema-antd-utils/src/utils/authority"
import { getPageQuery } from "@/outter/fr-schema-antd-utils/src/utils/utils"

export default {
    namespace: "login",

    state: {
        status: undefined
    },

    effects: {
        * login({ payload }, { call, put, take }) {
            localStorage.clear()
            sessionStorage.clear()

            let token = null
            token = yield call(service.login, payload)
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
                const params = getPageQuery()
                let { redirect } = params
                if (redirect) {
                    window.location.replace(redirect)
                } else {
                    window.location.replace(BASE_PATH)
                }
            }
        },

        * logout(_, { put }) {
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

            if (!window.location.pathname.endsWith("/user/login") && !redirect) {
                history.replace({
                    pathname: '/user/login',
                    search: stringify({
                        redirect: window.location.href,
                    }),
                });
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
