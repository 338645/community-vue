<template>
  <el-container>


    <div style="width: 100%">
      <div v-for="notification in this.notifications"
           style="width:100%;margin: 0px;padding:0px;background:#E6A23C;border:1px solid var(--el-border-color);borderRadius:var(--el-border-radius-base)">
        <router-link to="/">
          {{ notification.notifierUser.name }}
        </router-link>
        回复了您在
        <router-link :to="{name:'questShow',params:{
                          question:JSON.stringify(notification.question)
                        }}"
                     @click="updataStatus(notification)"
                     v-if="notification.question!=null"
        >
          {{ notification.question.title }}
        </router-link>
        <router-link :to="{name:'questShow',params:{
                          question:JSON.stringify(notification.reply.question)
                        }}"
                     @click="updataStatus(notification)"
                     v-if="notification.reply!=null"
        >
          {{ notification.reply.question.title }}
        </router-link>
        {{ notification.question === null ? '的评论' : '的问题' }}
        <span style="float: right">{{ notification.status ? '已读' : '未读' }}</span>
        <br>
        <span class="text-desc"><span>{{ getTime(notification.gmtCreate) }}</span></span><br>
      </div>
    </div>

  </el-container>
  <el-pagination background layout="prev, pager, next"
                 :total="pageInfo.total"
                 :page-size="pageInfo.pageSize"
                 :current-page="pageInfo.currentPage"
                 @current-change="currentChange"
                 style="float: right"/>
</template>

<script>
import axios from "axios";
import {mapState} from "vuex";
import {time} from "@/util/timeFormat";

export default {
  name: "UserMsg",
  data() {
    return {
      question: {
        name: '大吉吧'
      },
      search: '',
      notifications: [],
      pageInfo: {
        pageSize: 10,
        total: 0,
        currentPage: 1,
      }
    }
  }, setup() {
  }, created() {
    if (this.$cookies.get('NotificationTotal')) {
      this.total = this.$cookies.get('NotificationTotal')
    }
    axios.defaults.withCredentials = true
    axios.get("/server/getNotifications", {
      params: {
        currentPage: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize,
        userId: this.user.id
      }
    }).then(resp => {
      //console.log(resp.data)
      this.notifications = resp.data
    }).catch(err => {
      console.log(err)
    })
  }, computed: {
    ...mapState(['user'])
  }, methods: {
    updataStatus(notification) {
      //更新已读状态
      axios.defaults.withCredentials = true
      axios.get("/server/updateStatus", {
        params: {
          updateId: notification.id
        }
      }).then(resp => {
        console.log(resp.data)
      }).catch(err => {
        console.log(err)
      })
    },
    getTime(time1) {
      return time(time1)
    },
    cellClick(cell) {
      console.log('点击了')
    },
    currentChange(newValue) {
      this.pageInfo.currentPage = newValue
      axios.defaults.withCredentials = true
      axios.get("/server/getNotifications", {
        params: {
          currentPage: this.pageInfo.currentPage,
          pageSize: this.pageInfo.pageSize,
          userId: this.user.id
        }
      }).then(resp => {
        this.notifications = resp.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.text-desc {
  font-size: 12px;
  font-weight: normal;
  color: #999;
  float: right;
}
</style>