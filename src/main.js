import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import '@/Css/common.css'
import urlUtil from '@/util/getUrl_util'

const app = createApp(App)
app.config.globalProperties.$urlUtil = urlUtil;
installElementPlus(app)
app.use(store).use(router).mount('#app')
installElementPlus(app)