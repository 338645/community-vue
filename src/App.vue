<template>
  <el-container>

    <!--  头部  -->
    <el-header>
      <el-affix>
        <el-menu
            :default-active="NavMenu.menuStyle.defaultActiveMenu"
            :class='NavMenu.menuStyle.class'
            :mode='NavMenu.menuStyle.mode'
            :background-color='NavMenu.menuStyle.backgroundColor'
            :text-color='this.NavMenu.menuStyle.textColor'
            :active-text-color='this.NavMenu.menuStyle.activeTextColor'
        >

          <el-row>

            <el-col
                :span="NavMenu.menus[0].span"
                :offset="countOffsetUtil(NavMenu.menus[0].id,NavMenu.menus,NavMenu.menus[0].countOffset)"
            >
              <el-menu-item :index="NavMenu.menus[0].id" :disabled="NavMenu.menus[0].disabled"
                            @click="selectMenu(NavMenu.menus[0].index,this.$router,this.$route)">
                <el-avatar :size="50" :src="url"/>
              </el-menu-item>
            </el-col>

            <el-col
                :span="NavMenu.menus[1].span"
                :offset="countOffsetUtil(NavMenu.menus[1].id,NavMenu.menus,NavMenu.menus[1].countOffset)"
            >
              <el-menu-item :index="NavMenu.menus[1].id" :disabled="NavMenu.menus[1].disabled"
                            @click="selectMenu(NavMenu.menus[1].index,this.$router,this.$route)">
                {{ NavMenu.menus[1].messageMenu }}
              </el-menu-item>
            </el-col>

            <el-col
                :span="NavMenu.menus[2].span"
                :offset="countOffsetUtil(NavMenu.menus[2].id,NavMenu.menus,NavMenu.menus[2].countOffset)">
              <el-input
                  v-model="input3"
                  :placeholder="NavMenu.menus[2].messageMenu"
                  class="input-with-select"
              >
                <template #prepend>
                  <el-select placeholder="Select" style="width: 115px" v-model="select" @click="refreshTags">
                    <el-option label="全部" value=""/>
                    <el-option :label="slstag" :value="slstag" v-for="slstag in tags"/>
                  </el-select>
                </template>
                <template #append>
                  <el-button @click="submitSearch">
                    <el-icon>
                      <Search/>
                    </el-icon>
                  </el-button>
                </template>
              </el-input>
            </el-col>

            <el-col
                :span="NavMenu.menus[3].span"
                :offset="countOffsetUtil(NavMenu.menus[3].id,NavMenu.menus,NavMenu.menus[3].countOffset)"
            >
              <el-menu-item :index="NavMenu.menus[3].id" :disabled="NavMenu.menus[3].disabled"
                            @click="selectMenu(NavMenu.menus[3].index,this.$router,this.$route)">
                {{ NavMenu.menus[3].messageMenu }}
              </el-menu-item>
            </el-col>

            <el-col
                :span="NavMenu.menus[4].span"
                :offset="countOffsetUtil(NavMenu.menus[4].id,NavMenu.menus,NavMenu.menus[4].countOffset)"
            >
              <el-submenu :index="NavMenu.menus[4].id" v-if="getUser !=null" @mouseover="getUnreads">

                <template #title>
                  <el-avatar :size="40" :src="getUser.avatarUrl"/>
                </template>

                <el-menu-item :index=NavMenu.menus[4].id+-+submenu.id :disabled="submenu.disabled"
                              @click="submenu.messageMenu==='退出'?quitUser():selectMenu(submenu.index,this.$router,this.$route)"
                              v-for="submenu in NavMenu.menus[4].children">
                  <span v-if="submenu.messageMenu==='消息'">
                    {{ submenu.messageMenu }}：{{ this.unread }}未读
                  </span>

                  <span v-else>
                    {{ submenu.messageMenu }}
                  </span>
                </el-menu-item>

              </el-submenu>

              <el-menu-item :index="NavMenu.menus[4].id" :disabled="NavMenu.menus[4].disabled"
                            @click="login()" v-else>
                <template #title>登录</template>
              </el-menu-item>

            </el-col>

          </el-row>

        </el-menu>
      </el-affix>
    </el-header>

    <!--  主体  -->
    <el-main id="main">
      <router-view></router-view>
    </el-main>

    <!--  底栏  -->
    <el-footer>
      <div class="aw-footer">
        Copyright © 2022· <a target="_blank" title="简单来说就是转载必须注明本站链接！"
                             href="http://creativecommons.org/licenses/by/3.0/cn/">CC BY-NC-SA 3.0</a>

        <span class="hidden-xs"> · <a href="https://elasticsearch.cn/" target="_blank">Elastic中文社区</a>
						<p>
			</p>
					</span>
      </div>
      <!--   广告模块未开放   -->
      <!--      <el-row>
              <el-col :span="12">这是一半</el-col>
              <el-col :span="12">这是一半</el-col>
            </el-row>-->
    </el-footer>

    <!--  广告  -->
    <el-dialog
        v-model="dialogVisible"
        width="50%"
        :before-close="handleClose"
    >
      <el-carousel indicator-position="outside">
        <el-carousel-item v-for="item in 4" :key="item">
          <el-link href="https://www.bilibili.com/video/BV1P3411q7os?spm_id_from=333.337.search-card.all.click">
            <el-image
                src="/server/images/jiarang.png"/>
          </el-link>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

  </el-container>
</template>

<script>
import {countOffsetUtil, NavMenu, selectMenu} from '@/componentable/NavMenu'
import {mapGetters, mapState} from "vuex";
import {Search} from "@element-plus/icons";
import {ref} from "vue";
import store from "@/store";
import axios from "axios";
import {ElMessage} from "element-plus";
import router from "@/router";
import footer from "@/components/footer"
import {v4 as uuidv4} from "uuid"

export default {
  components: {
    Search,
    footer
  },
  data() {
    return {
      url: 'https://ts1.cn.mm.bing.net/th/id/R-C.94cd2cb227abbb12b9ad62e20b7203c7?rik=O3K4TtUAntAHZw&riu=http%3a%2f%2fimg.lieyou888.com%2f000%2f2021%2f09%2f02%2ffdfdeebd-c05e-48b8-ab5f-b993c405a30e.jpg&ehk=lhtXvNxLaWb28wqL2VWAhQoGUeKEtJ2nSEdlceuL1e4%3d&risl=&pid=ImgRaw&r=0',
      tags: [],
      dialogVisible: true,
      unread: 0,
    }
  },
  setup() {
    const flag = false

    const input3 = ref('')
    const select = ref('')
    return {
      flag,
      NavMenu,
      selectMenu, countOffsetUtil,
      Search,
      select,
      input3
    }
  }, mounted() {
    this.$cookies.config('30d')
    let state = this.$urlUtil('state')
    let code = this.$urlUtil('code')
    //代理api，让服务器能传来token，如果有token就像服务器请求用户信息
    if (state != null && code != null && this.user == null) {
      store.dispatch({
        type: 'login',
        types: {},
        code,
        state
      })
    }
    axios.defaults.withCredentials = true;
    axios.get("/server/getTags").then(resp => {
      this.tags = resp.data
    }).catch(err => {
      console.log(err)
    })
  },
  computed: {
    ...mapState(['user', 'userMessage']),
    ...mapGetters(['getUser']),
  },
  methods: {
    submitSearch() {
      //转到查询结果页面
      router.push({
        path: 'search', query: {
          search: this.input3,
          tag: this.select
        }
      })
    },
    getUnreads() {
      axios.defaults.withCredentials = true;
      axios.get("/server/getUnreadNotification", {
        params: {
          userId: this.user.id
        }
      }).then(resp => {
        this.unread = resp.data
      }).catch(err => {
        console.log(err)
      })
    },
    refreshTags() {
      axios.defaults.withCredentials = true;
      axios.get("/server/getTags").then(resp => {
        this.tags = resp.data
      }).catch(err => {
        console.log(err)
      })
    },
    handleClose() {
      this.dialogVisible = false;
      sessionStorage.setItem('dialogVis', this.dialogVisible)
    },
    login() {
      let target = 'https://github.com/login/oauth/authorize?'
      let state = uuidv4();
      let redirect_uri = "http://1.14.206.60/"
      let client_id = 'ae6d4adb632935201bcb'
      let scope = 'user'
      location.href = target
          + "client_id=" + client_id + "&"
          + "redirect_uri=" + redirect_uri + "&"
          + "scope=" + scope + "&"
          + "state=" + state
      //location.href = "https://github.com/login/oauth/authorize?client_id=ae6d4adb632935201bcb&redirect_uri=http://localhost:8080/&scope=user&state=1"
    }, quitUser() {
      //从store中删除用户
      store.commit('deleteUser')
      //从cookie中删除token
      this.$cookies.remove('token')
      //把store存入sessionStorage
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
      ElMessage({
        type: 'success',
        message: '退出成功'
      })
    }
  }, created() {
    //default: expireTimes = 1d,path=/
    //将vuex的信息存入sessionStorge中
    if (sessionStorage.getItem('store')) {
      //使用一个Object.assign复制当前state中的属性和session中的state
      this.$store.replaceState(Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('store'))
      ))
    }

    if (sessionStorage.getItem('dialogVis')) {
      //console.log(sessionStorage.getItem('dialogVis'))
      this.dialogVisible = Boolean(sessionStorage.getItem('dialogVis') === 'true')
    }

    //页面刷新后,查看是否具有cookie,并且user==null
    if (this.$cookies.get('token') && this.user == null) {
      //获得cookie的token从服务器端获取用户信息
      store.dispatch({
        type: 'getUserByToken',
        token: this.$cookies.get('token'),
      })
    }
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    // beforeunload事件在页面刷新时先触发
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }
}


</script>

<style scoped>
.el-footer {
  background-color: #545c64;
}

.el-menu-demo {
  height: 100%;
  width: 100%;
}

.el-affix {
  height: 100%;
  margin: 0px;
}

.el-menu-demo {
  height: 100%;
}

#main {
  height: 100%;
  margin: 0px;
  padding: 0px;
}

.el-container {
  height: 100%;
}

.el-header {
  padding: 0;
}

li {
  padding: 0;
  text-align: center;
}

.el-input {
  position: relative;;
  top: 6px;
}

.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.aw-footer {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  line-height: 160%;
  font-family: candara, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Microsoft Yahei", sans-serif, -apple-system;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  padding: 30px 0 10px;
  font-size: 12px;
  text-align: center;
  color: black;
}
</style>


