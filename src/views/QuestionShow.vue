<template>
  <el-row>

    <el-col :md="14">
      <h4 class="question-title"><span>{{ question.title }}</span></h4>
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
      <span class="text-desc">
        <span>作者：{{ question.user.name }}</span>|
        <span>  {{ question.comment_count }}</span>个回复 |
        <span>  {{ question.view_count }}</span> 次浏览 |
        <span>  发布时间：{{ getTime(question.gmt_create) }}</span>
      </span>
      <el-divider/>
      <div class="desc-sty">
        <md-editor-v3
            v-model="question.description"
            preview-only
            toolbarsExclude="['link', 'katex', 'github']"
            v-if="this.readOnly"
        />
        <md-editor-v3
            v-model="question.description"
            :preview="false"
            toolbarsExclude="['link', 'katex', 'github']"
            v-else
            @on-upload-img="onUploadImg"
        />
        <el-button type="primary" round size="small" style="float: right" @click="editDes"
                   v-if="this.user!==null&&this.user.id===question.user.id">
          编辑
        </el-button>
      </div>
      <el-divider/>
      <h3>{{ replys.length }}个回复</h3>

      <div v-for="reply in replys" :key="reply">
        <el-row>
          <el-col :span="2">
            <el-button style="margin: 0px;padding: 0px">
              <el-avatar shape="square" :size="60" :src="reply.user.avatarUrl"/>
            </el-button>
          </el-col>
          <el-col :span="22" style="border-bottom:1px solid #999999;margin-bottom: 10px">
            {{ reply.user.name }}：
            <br>
            {{ reply.reply }}
            <br>
            <div>
              <el-button @click="reply.showSub = !reply.showSub" class="el-button--primary" size="small">
                <el-icon :size="10" style="float:left;">
                  <ChatLineSquare/>
                </el-icon>
                {{ reply.subReplys.length }}
              </el-button>
              <span class="text-desc" style="float: right">
            回复于<span>
            {{ getTime(reply.gmtCreate) }}
          </span></span><br>
            </div>
          </el-col>
        </el-row>
        <div v-if="reply.showSub">
          <div v-for="subReply in reply.subReplys">
            <el-row>
              <el-col :span="2" :offset="2">
                <el-button style="margin: 0px;padding: 0px">
                  <el-avatar shape="square" :size="60" :src="reply.user.avatarUrl"/>
                </el-button>
              </el-col>
              <el-col :span="20" style="border-bottom: 1px solid #999999;margin-bottom: 5px">
                {{ subReply.user.name }}：
                <br>
                {{ subReply.reply }}
                <br>
                <div>
                  <span class="text-desc" style="float: right">
            回复于<span>
            {{ getTime(subReply.gmtCreate) }}
          </span></span><br>
                </div>
              </el-col>
            </el-row>
          </div>
          <div>
            <el-pagination background layout="prev, pager, next"
                           :total="reply.subPageInfo.total"
                           :page-size="reply.subPageInfo.pageSize"
                           :current-page="reply.subPageInfo.currentPage"
                           @current-change="(val)=>subcurrentChange(reply,val)"
                           style="float: right"
            />
            <br>
            <br>
            <el-row>
              <el-col :span="22" :offset="2">
                <el-button style="margin: 0px;padding: 0px">
                  <el-avatar shape="square" :size="40" :src="reply.user.avatarUrl"/>
                </el-button>
                <span style="position: relative;top: -10px;">{{ reply.user.name }}：</span>
                <el-form>
                  <el-form-item>
                    <md-editor-v3
                        v-model="subReply"
                        :preview="false"
                        toolbarsExclude="['link', 'katex', 'github','image']"
                        placeholder="请输入回复"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button class="el-button--primary" size="small" @click="submitSubReply(reply,subReply)"
                               style="float: right">
                      提交
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>

      <el-row>
        <el-col :span="24">
          <el-pagination background layout="prev, pager, next"
                         :total="pageInfo.total"
                         :page-size="pageInfo.pageSize"
                         :current-page="pageInfo.currentPage"
                         @current-change="currentChange"
                         style="float: right"/>
        </el-col>
      </el-row>
      <br>
      <el-divider/>
      <div>
        <h4 class="question-title"><span>评论</span></h4>
        <el-avatar shape="square" :src="this.user.avatarUrl" v-if="this.user != null"/>
        <span v-if="this.user !=null" style="position: relative;top: -10px;">
          {{ this.user.name }}：
        </span>
      </div>
      <el-form>
        <el-form-item>
          <md-editor-v3
              v-model="reply"
              :preview="false"
              toolbarsExclude="['link', 'katex', 'github','image']"
              placeholder="请输入回复"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="el-button--primary" size="small" @click="submitReply(reply)" style="float: right">提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :md="10">
      <h3>相关问题</h3>

      <ul v-for="relateQuest in this.relativeQuestions">
        <li>
          <router-link :to="{name:'questShow',params:{
                          question:encodeURIComponent(JSON.stringify(relateQuest))
                        }}" style="text-decoration: none" @click="refresh(relateQuest)">
            {{ relateQuest.title }}
          </router-link>
        </li>
      </ul>
    </el-col>

  </el-row>
</template>

<script>
import {time} from "@/util/timeFormat";
import axios from "axios";
import {mapState} from "vuex";
import {ElMessage} from "element-plus";
import {ChatLineSquare} from "@element-plus/icons"
import router from "@/router";

export default {
  name: "QuestionShow",
  data() {
    return {
      question: {},
      reply: '',
      pageInfo: {
        //分页数
        currentPage: 1,
        //记录总数
        total: 0,
        //每页显示个数,
        pageSize: 6
      },
      readOnly: true,
      replys: [],
      subReply: '',
      relativeQuestions: []
    }
  }, created() {
    if (typeof this.$route.params.question !== 'undefined') {
      this.question = JSON.parse(decodeURIComponent(this.$route.params.question))
      sessionStorage.setItem('questionShow', this.$route.params.question)
    }
    if (sessionStorage.getItem('questionShow')) {
      //console.log(JSON.parse(decodeURIComponent(sessionStorage.getItem('questionShow'))))
      this.question = JSON.parse(decodeURIComponent(sessionStorage.getItem('questionShow')))
    }

    //查询相关的问题
    axios.defaults.withCredentials = true
    axios.post("/server/getRelativeQuestions", this.question).then(resp => {
      console.log(resp.data)
      this.relativeQuestions = resp.data
    }).catch(err => {
      console.log(err)
    })

    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('questionShow', encodeURIComponent(JSON.stringify(this.question)))
    })
  }, methods: {
    refresh(relateQuest) {
      this.question = relateQuest
      router.go(0)
    },
    getTime(value) {
      return time(value)
    }, getTags(question) {
      let split = question.tag.split(',');
      return split
    }, currentChange(newValue) {
      this.pageInfo.currentPage = newValue
      //console.log(this.pageInfo.currentPage)
      axios.defaults.withCredentials = true
      axios.get("/server/getReplys", {
        params: {
          questId: this.question.id,
          pageSize: this.pageInfo.pageSize,
          currentPage: this.pageInfo.currentPage,
        }
      }).then(resp => {
        this.replys = resp.data;
        this.pageInfo.total = parseInt(this.$cookies.get("ReplyTotal"))
        //console.log(resp.data)
      }).catch(err => {
        //console.log(err)
      })
    }, submitReply(reply) {
      if (this.user !== null) {
        axios.defaults.withCredentials = true;
        //更新回复
        axios.post("/server/insertReply", {
          reply,
          userId: this.user.id,
          questId: this.question.id,
        }).then(resp => {
          ElMessage({
            type: 'warning',
            message: resp.data
          })
          this.$router.go(0);
        }).catch(err => {
          //console.log(err)
        })
      } else {
        ElMessage({
          type: 'warning',
          message: '请先登录'
        })
      }
    }, editDes() {
      if (this.readOnly) {
        this.readOnly = !this.readOnly
      } else {
        //更新question
        axios.defaults.withCredentials = true
        axios.post("/server/updateQuestion", this.question).then(resp => {
          //console.log(resp)
        }).catch(err => {
          //console.log(err)
        })
        this.readOnly = !this.readOnly
      }
    }, submitSubReply(reply, subReply) {
      if (this.user !== null) {
        //axios提交子回复
        axios.defaults.withCredentials = true
        axios.post("/server/insertSubReply", reply, {
          params: {
            subReply: subReply,
            userId: this.user.id
          }
        }).then(resp => {
          console.log(resp)
          this.subReply = ''
          reply.subReplys = resp.data.subReplys
          reply.subPageInfo = resp.data.subPageInfo
          this.$forceUpdate()
          ElMessage({
            type: 'warning',
            message: '评论成功'
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        ElMessage({
          type: 'warning',
          message: '请先登录'
        })
      }
    },
    subcurrentChange(reply, newValue) {
      reply.subPageInfo.currentPage = newValue
      axios.defaults.withCredentials = true
      axios.get("/server/refreshSubReply", {
        params: {
          currentPage: reply.subPageInfo.currentPage,
          pageSize: reply.subPageInfo.pageSize,
          questId: reply.questId,
          parentId: reply.id
        }
      }).then(resp => {
        reply.subReplys = resp.data
        this.$forceUpdate()
      }).catch(err => {
        console.log(err)
      })
    }
  },
  computed: {
    ...
        mapState(['user'])
  }, setup() {
    const onUploadImg = async (files, callback) => {
      const res = await Promise.all(
          files.map((file) => {
            return new Promise((rev, rej) => {
              const form = new FormData();
              form.append('file', file);

              axios
                  .post('/server/uploadImg', form, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  })
                  .then((res) => rev(res))
                  .catch((error) => rej(error));
            });
          })
      );

      //直接返回url没有封装dto
      callback(res.map((item) => item.data));
    };
    return {
      onUploadImg
    }
  },
  mounted() {
    axios.defaults.withCredentials = true
    axios.get("/server/getReplys", {
      params: {
        questId: this.question.id,
        pageSize: this.pageInfo.pageSize,
        currentPage: this.pageInfo.currentPage,
      }
    }).then(resp => {
      this.replys = resp.data;
      this.pageInfo.total = parseInt(this.$cookies.get("ReplyTotal"))
      for (let i = 0; i < resp.data.length; i++) {
        this.replys[i].showSub = false;
      }
      //console.log(resp.data)
    }).catch(err => {
      //console.log(err)
    })
  },
  components: {
    ChatLineSquare
  }
}
</script>

<style scoped>
.el-row {
  background: white;
}

.question-title {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.1;
  color: inherit;
  margin-bottom: 10px;
  font-size: 18px;
  margin-top: 25px;
}

.text-desc {
  font-size: 12px;
  font-weight: normal;
  color: #999;
}

.desc-sty {
  font-family: "Microsoft YaHei", Helvetica, "Meiryo UI", "Malgun Gothic", "Segoe UI", "Trebuchet MS", Monaco, monospace, Tahoma, STXihei, "华文细黑", STHeiti, "Helvetica Neue", "Droid Sans", "wenquanyi micro hei", FreeSans, Arimo, Arial, SimSun, "宋体", Heiti, "黑体", sans-serif;
  overflow: auto;
}

.el-main {
  margin: 0px;
  padding: 0px;
  height: 150px;
}

.el-aside {
  margin: 0px;
  padding: 0px;
  height: 150px;
  width: 85px;
}

textarea {
  border: none;
}

</style>