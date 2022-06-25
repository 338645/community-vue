import {createStore} from 'vuex'
import axios from "axios";

export default createStore({
    state: {
        user: null,
        userMessage: ''
    },
    getters: {
        getUser(state) {
            //判断本地是否有cookie
            //如果有则请求服务端获取

            return state.user
        }
    },
    mutations: {
        updateUser(state, newUser) {
            state.user = newUser
        },
        deleteUser(state){
            state.user = null
        }
    },
    actions: {
        login({commit},msg) {
            axios.get("http://localhost:8887/callback", {
                params: {
                    state:msg.state,
                    code:msg.code
                }
            }).then(resp => {
                if (typeof resp.data != 'string') {
                    commit('updateUser', resp.data)
                }else commit('deleteUser')
            }).catch(err => {
                console.log(err)
                commit('deleteUser')
            })
        }
    },
    modules: {}
})
