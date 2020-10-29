import { stringify } from "qs"
import { history } from "umi"
import service from "../service"
import { reloadAuthorized } from "@/outter/fr-schema-antd-utils/src/utils/Authorized"
import { setAuthority } from "@/outter/fr-schema-antd-utils/src/utils/authority"
import { getPageQuery } from "@/outter/fr-schema-antd-utils/src/utils/utils"

function deleteAllCookies() {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.execCommand("ClearAuthenticationCache");
    }
}

export default {
    namespace: "login",

    state: {
        status: undefined,
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
                    payload: { token: token.data },
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

        * logout(_, { put, call }) {
            console.info("logout")

            // 清理数据
            localStorage.clear()
            sessionStorage.clear()
            deleteAllCookies()

            yield put({
                type: "changeLoginStatus",
                payload: {
                    status: false,
                    currentAuthority: "guest",
                },
            })
            reloadAuthorized()

            // 返回登录
            const { redirect } = getPageQuery() // redirect

            if (
                !window.location.pathname.endsWith("/user/login") &&
                !redirect
            ) {
                if (SETTING.loginPath) {
                    location.href = SETTING.loginPath + "?" + SETTING.redirectName + "=" + window.location.href
                } else {
                    history.replace({
                        pathname: "/user/login",
                        search: stringify({
                            redirect: window.location.href,
                        }),
                    })
                }
                try {
                    yield call(service.logout)
                    
                } catch (error) {
                    
                }

            }
        },
    },
    reducers: {
        changeLoginStatus(state, { payload }) {
            setAuthority(payload.currentAuthority)
            return {
                ...state,
                status: payload.status,
                type: payload.type,
            }
        },
    },
}
