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
                {{ NavMenu.menus[0].messageMenu }}
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
                  <el-select placeholder="Select" style="width: 115px" v-model="select">
                    <el-option label="Restaurant" value="1"/>
                    <el-option label="Order No." value="2"/>
                    <el-option label="Tel" value="3"/>
                  </el-select>
                </template>
                <template #append>
                  <el-button>
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

              <el-submenu :index="NavMenu.menus[4].id" v-if="getUser !=null">

                <template #title>{{ getUser.name }}</template>

                <el-menu-item :index=NavMenu.menus[4].id+-+submenu.id :disabled="submenu.disabled"
                              @click="selectMenu(submenu.index,this.$router,this.$route)"
                              v-for="submenu in NavMenu.menus[4].children">
                  {{ submenu.messageMenu }}
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
      <el-row>
        <el-col :span="12">这是一半</el-col>
        <el-col :span="12">这是一半</el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import {countOffsetUtil, NavMenu, selectMenu} from '@/componentable/NavMenu'
import {mapGetters, mapState} from "vuex";
import {Search} from "@element-plus/icons";
import {ref} from "vue";
import store from "@/store";

export default {
  components: {Search},
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
    } else if (this.$cookies.get('token') && this.user == null) {
      //操作cookie,暂时不需要
    }
  },
  computed: {
    ...mapState(['user', 'userMessage']),
    ...mapGetters(['getUser']),
  },
  methods: {
    login() {
      location.href = "https://github.com/login/oauth/authorize?client_id=ae6d4adb632935201bcb&redirect_uri=http://localhost:8080/&scope=user&state=1"
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
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    // beforeunload事件在页面刷新时先触发
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }, watch: {
    userMessage(newMsg) {
      console.log(newMsg)
      window.alert(newMsg);
    }
  }
}


</script>

<style scoped>
.el-footer{
  background-color: #545c64;
}
.el-menu-demo {
  height: 100%;
  width: 100%;
}

.el-affix{
  height: 100%;
  margin: 0px;
}

.el-menu-demo{
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
</style>


