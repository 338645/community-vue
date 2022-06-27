import {createStore} from 'vuex'
import axios from "axios";
import router from "@/router";

export default createStore({
    state: {
        user: null,
        userMessage: ''
    },
    getters: {
        getUser(state) {
            //判断本地是否有cookie
            return state.user
        }
    },
    mutations: {
        updateUser(state, newUser) {
            state.user = newUser
        },
        deleteUser(state){
            state.user = null
        },
        updateUserMessage(state,newMsg){
            state.userMessage = newMsg
        }
    },
    actions: {
        login({commit},msg) {
            axios.defaults.withCredentials = true
            axios.get("http://localhost:8887/callback", {
                params: {
                    state:msg.state,
                    code:msg.code
                }
            }).then(resp => {
                if (typeof resp.data != 'string') {
                    commit('updateUser', resp.data)
                    router.push("/")
                    commit('updateUserMessage','登陆成功')
                }
                else commit('deleteUser')
            }).catch(err => {
                console.log(err)
                commit('deleteUser')
            })
        }
    },
    modules: {}
})
