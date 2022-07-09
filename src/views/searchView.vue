<template>
  <el-row>
    <el-col class="demo-border" :md="24">
      <el-row style="height: 60px">
        <h3 style="margin:0px">
          <Fold style="width: 30px; height: 30px;position: relative;top: 8px"/>
          发现
        </h3>
      </el-row>

      <div class="common-layout" v-for="question in this.questions">

        <el-container>

          <el-aside>
            <el-button style="margin: 0px;padding: 0px">
              <el-avatar shape="square" :size="60" :src="question.user.avatarUrl"/>
            </el-button>
          </el-aside>

          <el-main>
            <router-link :to="{name:'questShow',params:{
                          question:encodeURIComponent(JSON.stringify(question))
                        }}" style="text-decoration: none"
                         @click="updateViewCount(question)"
            >
              {{ question.title }}
            </router-link>
            <br>
            <el-tag
                v-for="tag in getTags(question)"
                :key="tag"
                class="mx-1"
                type="success"
                effect="dark"
                size="small"
            >
              {{ tag }}
            </el-tag>
            <br>
            <span class="text-desc"><span>{{ question.comment_count }}</span> 个回复 • <span>{{
                question.view_count
              }}</span> 次浏览 • <span>{{ getTime(question.gmt_create) }}</span></span><br>
          </el-main>

        </el-container>

      </div>

      <el-pagination background layout="prev, pager, next"
                     :total="pageInfo.total"
                     :page-size="pageInfo.pageSize"
                     :current-page="pageInfo.currentPage"
                     @current-change="currentChange"
                     style="float: right"/>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
import {time} from "@/util/timeFormat";

export default {
  name: "searchView",
  data() {
    return {
      questions: {},
      pageInfo: {
        //分页数
        currentPage: 1,
        //记录总数
        total: 0,
        //每页显示个数,
        pageSize: 6
      },
      search: '',
      tag: ''
    }
  },
  mounted() {
    this.search = this.$route.query.search
    this.tag = this.$route.query.tag
    axios.defaults.withCredentials = true
    axios.get("/server/search", {
      params: {
        pageSize: this.pageInfo.pageSize,
        currentPage: this.pageInfo.currentPage,
        tag: this.tag,
        search: this.search
      }
    }).then(resp => {
      this.questions = resp.data
      //console.log(parseInt(this.$cookies.get("questionTotal")))
      this.pageInfo.total = parseInt(this.$cookies.get("questionTotal"));
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    getTags(question) {
      let split = question.tag.split(',');
      //split.pop();
      return split
    },
    updateViewCount(question) {
      if (typeof this.user.id !== 'undefined' && this.user.id !== question.user.id) {
        axios.defaults.withCredentials = true;
        axios.get("/server/updateViewCount", {
          params: {
            questId: question.id
          }
        }).then(resp => {

        }).catch(err => {

        })
      }
    }, getTime(value) {
      return time(value)
    }, currentChange(newValue) {
      this.pageInfo.currentPage = newValue
      //console.log(this.pageInfo.currentPage)
      axios.defaults.withCredentials = true
      axios.get("/server/search", {
        params: {
          pageSize: this.pageInfo.pageSize,
          currentPage: this.pageInfo.currentPage,
          tag: this.tag,
          search: this.search
        }
      }).then(resp => {
        this.questions = resp.data
        //console.log(parseInt(this.$cookies.get("questionTotal")))
        this.pageInfo.total = parseInt(this.$cookies.get("questionTotal"));
      }).catch(err => {
        console.log(err)
      })
    }
  }, watch: {
    '$route.query.search': function () {
      this.search = this.$route.query.search
      this.currentChange(this.pageInfo.total)
    },
    '$route.query.tag': function () {
      this.tag = this.$route.query.tag
      this.currentChange(this.pageInfo.total)
    }
  }
}
</script>

<style scoped>
.el-row {
  background: white;
  height: 100%;
}

.el-image {
  height: 80px;
  width: 80px;
  margin: 0px;
  padding: 0px;
}

.el-main {
  margin: 0px;
  padding: 0px;
  height: 85px;
}

.el-aside {
  margin: 0px;
  padding: 0px;
  height: 85px;
  width: 85px;
}

h4 {
  padding: 10px;
  margin: 0px;
}

.item {
  margin-right: 20px;
}

.el-dropdown {
  margin-top: 1.1rem;
}

.text-desc {
  font-size: 12px;
  font-weight: normal;
  color: #999;
}

.router-link-active {
  text-decoration: none;
}

</style>