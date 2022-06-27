import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import '@/Css/common.css'
import urlUtil from '@/util/getUrl_util'
import VueCookies from 'vue-cookies'

const app = createApp(App)
app.config.globalProperties.$urlUtil = urlUtil;
installElementPlus(app)
app.use(store).use(router).use(VueCookies).mount('#app')