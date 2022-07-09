import {createStore} from 'vuex'
import axios from "axios";
import router from "@/router";
import {ElMessage} from "element-plus";

export default createStore({
    state: {
        user: null,
        userMessage: ''
    },
    getters: {
        getUser(state) {
            return state.user
        }
    },
    mutations: {
        updateUser(state, newUser) {
            state.user = newUser
        },
        deleteUser(state) {
            state.user = null
        },
        updateUserMessage(state, newMsg) {
            state.userMessage = newMsg
            ElMessage({
                type: 'success',
                message: state.userMessage
            })
        }
    },
    actions: {
        login({commit}, msg) {
            axios.defaults.withCredentials = true
            axios.get("/server/callback", {
                params: {
                    state: msg.state,
                    code: msg.code
                }
            }).then(resp => {
                if (typeof resp.data != 'string') {
                    commit('updateUser', resp.data)
                    router.go(-1)
                    commit('updateUserMessage', '登陆成功')
                } else commit('deleteUser')
            }).catch(err => {
                console.log(err)
                commit('deleteUser')
            })
        },
        getUserByToken({commit}, token) {
            axios.defaults.withCredentials = true
            axios.post("/server/getUserByToken", {
                token: token.token
            }).then((resp) => {
                console.log(resp.data);
                if (resp.data != null) {
                    commit('updateUser', resp.data)
                }
            }).catch((err) => {
                console.log(err.request)
                console.log(err.data)
                console.log(err)
            })
        }, publish({commit}, formLabelAlign) {
            axios.post('/server/publish', {
                title: formLabelAlign.title,
                description: formLabelAlign.description,
                tag: formLabelAlign.tag
            }).then(resp => {
                if (resp.data === '请重新登录') {
                    commit('deleteUser')
                }
                ElMessage(
                    {
                        type: 'info',
                        message: resp.data
                    }
                )
                if (resp.data === '发表成功') router.go(-1);
            }).catch(err => {
                console.log(err)
                ElMessage(
                    {
                        type: 'error',
                        message: '发表失败'
                    }
                )
            })
        }
    },
    modules: {}
})
