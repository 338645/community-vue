<template>

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
        }}">{{ question.title }}
        </router-link>
        <el-button type="primary" round size="small" style="float: right;" @click="deleteQuestion(question)">删除
        </el-button>
        <el-button type="primary" round size="small" style="float: right" @click="editQuestion(question)">编辑
        </el-button>
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

  <el-dialog v-model="dialogFormVisible" title="编辑问题">
    <template #footer>
      <el-form
          ref="ruleFormRef"
          label-position="top"
          label-width="100px"
          :model="editQuestionAlign"
          :rules="rules"
          class="demo-ruleForm"
          size="small"
      >

        <el-form-item label="问题标题" prop="title">

          <el-input v-model="editQuestionAlign.title" placeholder="问题标签"/>

        </el-form-item>

        <el-form-item label="问题补充" prop="description">

          <md-editor-v3
              v-model="editQuestionAlign.description"
              :preview="false"
              toolbarsExclude="['link', 'katex', 'github']"
              placeholder="请输入问题描述"
              @on-upload-img="onUploadImg"
          />

        </el-form-item>

        <el-form-item label="文件上传">

          <el-upload
              ref="uploadRef"
              class="upload-demo"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :auto-upload="false"
          >
            <template #trigger>
              <el-button type="primary" style="position: relative;left: -590px;">选择文件
              </el-button>
            </template>

            <el-button class="ml-3" type="success" @click="submitUpload" style="position: relative;left: -590px;">
              上传
            </el-button>

            <template #tip>
              <div class="el-upload__tip" style="text-align: left;">
                jpg/png files with a size less than 500kb
              </div>
            </template>
          </el-upload>

        </el-form-item>

        <el-form-item label="标签" prop="tag">

          <el-input v-model="editQuestionAlign.tag" placeholder="请输入标签" @change="changeTag"/>

          <el-tag
              v-for="tag in tags"
              :key="tag.name"
              class="mx-1"
              closable
              type="success"
              effect="dark"
              round
              size="small"
              @close="closeTag(tag.id)"

          >
            {{ tag.name }}
          </el-tag>

        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef,editQuestionAlign)" id="submit">提交</el-button>
        </el-form-item>

      </el-form>
    </template>
  </el-dialog>
</template>

<script>
import {Expand, Fold} from "@element-plus/icons";
import axios from "axios";
import {mapState} from "vuex";
import {time} from "@/util/timeFormat";
import {ElMessage, ElMessageBox} from "element-plus";
import store from "@/store";
import {reactive, ref} from "vue";

export default {
  name: "userQuestion",
  data() {
    return {
      questions: {},
      pageInfo: {
        //分页数
        currentPage: 1,
        //记录总数
        total: 0,
        //每页显示个数,
        pageSize: 7
      }, dialogFormVisible: false,
      editQuestionAlign: {},
      rules: {
        title: [{
          required: true,
          message: "标题不能为空",
          trigger: 'blur'
        }],
        description: [
          {
            required: true,
            message: "描述不能为空",
            triggers: 'blur'
          }
        ],
        tag: [
          {
            required: true,
            message: "标签不能为空",
            trigger: 'blur'
          }
        ]
      }, tags: {}
    }
  }, components: {
    Fold,
    Expand,
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

    const ruleFormRef = ref('')
    const submitForm = async (form, formLabelAlign) => {
      await ElMessageBox.confirm(
          '是否发布?',
          '发布提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            draggable: true
          }
      ).then(() => {
        form.validate((valid, fields) => {
          if (valid) {
            console.log('success1')
            //登录成功提交axios请求
            axios.defaults.withCredentials = true
            axios.post("/server/updateQuestion", formLabelAlign).then(resp => {
              ElMessage(
                  {
                    type: 'success',
                    message: '更新成功'
                  }
              )
            }).catch(err => {
              console.log(err)
              ElMessage(
                  {
                    type: 'warning',
                    message: '更新失败'
                  }
              )
            })
          } else {
            console.log('error submit!', fields)
          }
        })
      }).catch(err => {
        ElMessage(
            {
              type: 'warning',
              message: '验证失败'
            }
        )
      })
    }

    return {
      submitForm,
      ruleFormRef,
      onUploadImg
    }
  }, mounted() {
    //从后端查询到questions回显
    axios.defaults.withCredentials = true
    axios.get("/server/getQuestionsByUser", {
      params: {
        pageSize: this.pageInfo.pageSize,
        currentPage: this.pageInfo.currentPage,
        UserId: this.user.account_id
      }
    }).then(resp => {
      this.questions = resp.data
      this.pageInfo.total = parseInt(this.$cookies.get("UserQuestionTotal"))
    }).catch(err => {
      console.log(err.data)
    })
  }, computed: {
    ...mapState(['user'])
  }, methods: {
    getTags(question) {
      let split = question.tag.split(',');
      //split.pop();
      return split
    }, getTime(value) {
      return time(value)
    }, currentChange(newValue) {
      this.pageInfo.currentPage = newValue
      axios.defaults.withCredentials = true
      axios.get("/server/getQuestionsByUser", {
        params: {
          pageSize: this.pageInfo.pageSize,
          currentPage: this.pageInfo.currentPage,
          UserId: this.user.account_id
        }
      }).then(resp => {
        this.questions = resp.data
        this.pageInfo.total = parseInt(this.$cookies.get("UserQuestionTotal"))
      }).catch(err => {
        console.log(err.data)
      })
    }, deleteQuestion(question) {
      axios.defaults.withCredentials = true
      axios.get("/server/deleteQuestion", {
        params: {
          id: question.id
        }
      }).then(resp => {

      }).catch(err => {

      })
      let currentPage = this.pageInfo.currentPage;
      this.currentChange(currentPage)
    }, editQuestion(question) {
      this.dialogFormVisible = true
      this.editQuestionAlign = question;
      //let currentPage = this.pageInfo.currentPage;
      //this.currentChange(currentPage)
    }, changeTag(newValue) {
      this.tags = []
      let split = newValue.split(',');

      for (let idx = 0; idx < split.length; idx++) {
        if (split[idx] !== '') {
          this.tags[idx] = {
            name: split[idx],
            id: idx
          }
        }
      }
    }, closeTag(id) {
      let strings = this.editQuestionAlign.tag.split(",");
      let ts = strings.splice(id, 1);
      this.editQuestionAlign.tag = strings.join(',')
      this.changeTag(this.editQuestionAlign.tag)
    }, submitUpload() {
      //上传文件
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

a {
  text-decoration: none;
}
</style>