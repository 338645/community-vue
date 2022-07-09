import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import '@/Css/common.css'
import urlUtil from '@/util/getUrl_util'
import VueCookies from 'vue-cookies'
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';


import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.$urlUtil = urlUtil;
installElementPlus(app)
app.use(store).use(router).use(VueCookies).use(MdEditor).mount('#app')