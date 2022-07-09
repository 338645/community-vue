import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Publish from '../views/publish.vue'
import User from '@/views/UserVue'
import UserQuestion from "@/views/userQuestion";
import UserCenter from "@/views/UserCenter";
import QuestionShow from "@/views/QuestionShow"
import UserMsg from "@/views/UserMsg";
import store from "@/store";
import searchView from "@/views/searchView";

const routes = [
    {
        path: '/',
        name: 'home',
        alias: '/home',
        components: {
            default: HomeView
        }
    }, {
        path: '/publish',
        name: 'publish',
        component: Publish
    }, {
        path: '/user',
        name: 'user',
        component: User,
        meta: {
            requireAuth: true
        },
        children: [
            {
                path: 'questions',
                name: 'userQuestion',
                component: UserQuestion
            }, {
                path: '',
                name: 'UserCenter',
                component: UserCenter
            }, {
                path: 'questShow',
                name: 'questShow',
                component: QuestionShow
            }, {
                path: 'userMsg',
                name: 'userMsg',
                component: UserMsg
            }
        ]
    }, {
        path: '/questShow',
        name: 'questShow',
        component: QuestionShow
    }, {
        path: '/search',
        name: 'search',
        component: searchView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        from.name ? next({
            name: from.name
        }) : next('/home');
    } else if (to.meta.requireAuth) {
        if (store.state.user != null) {
            next()
        } else {
            next("/home")
        }
    } else {
        next(); //如果匹配到正确跳转
    }
})

export default router
