import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Publish from '../views/publish.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
