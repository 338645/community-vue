<template>
  <el-row style="background: white;height: 100%">
    <el-col :md="4">
      <el-menu style="height: 100%"
               default-active="1-1"
               :default-openeds="['1']"
               class="el-menu-vertical-demo"
               @open="handleOpen"
               @close="handleClose"
      >
        <el-submenu index="1">
          <template #title>
            <el-icon>
              <icon-menu/>
            </el-icon>
            <span>用户操作</span>
          </template>
          <el-menu-item index="1-1" @click="changeRouter('')">个人中心</el-menu-item>
          <el-menu-item index="1-2" @click="changeRouter('questions')">我的问题</el-menu-item>
          <el-menu-item index="1-3" @click="changeRouter('userMsg')">最新回复</el-menu-item>
        </el-submenu>

        <el-menu-item index="2">
          <el-icon>
            <setting/>
          </el-icon>
          <span>个人设置</span>
        </el-menu-item>

      </el-menu>
    </el-col>

    <el-col :md="20">
      <router-view></router-view>
    </el-col>

  </el-row>
</template>

<script>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import {computed, getCurrentInstance, watch} from "vue";
import {mapState} from "vuex";
import router from "@/router";

export default {
  name: "user",
  components: {
    Document,
    IconMenu,
    Location,
    Setting
  }, methods: {
    changeRouter(url) {
      this.$router.push({path: `/user/${url}`})
    }, handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    user: {
      handler(user, pre) {
        if (user == null) {
          router.push("/")
        }
      }
    }
  }
}
</script>

<style scoped>

</style>