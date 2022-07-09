<template>
  <el-row>
    <el-col id="publishMain" :md="16">
      <h3>
        <el-icon>
          <Plus/>
        </el-icon>
        <el-form
            ref="ruleFormRef"
            label-position="top"
            label-width="100px"
            :model="formLabelAlign"
            :rules="rules"
            class="demo-ruleForm"
            size="small"
        >

          <el-form-item label="问题标题" prop="title">

            <el-input v-model="formLabelAlign.title" placeholder="问题标签"/>

          </el-form-item>

          <el-form-item label="问题补充" prop="description">
            <md-editor-v3
                v-model="formLabelAlign.description"
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
                <el-button type="primary">选择文件</el-button>
              </template>

              <el-button class="ml-3" type="success" @click="submitUpload">
                上传
              </el-button>

              <template #tip>
                <div class="el-upload__tip">
                  文件上传提示：xxxxxx
                </div>
              </template>
            </el-upload>

          </el-form-item>

          <el-form-item label="标签" prop="tag">

            <el-input v-model="formLabelAlign.tag" placeholder="请输入标签" @change="changeTag"/>

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

          <el-form-item label="匿名">
            <el-switch v-model="formLabelAlign.isAnoy"/>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef,formLabelAlign)" id="submit">提交</el-button>
          </el-form-item>

        </el-form>
      </h3>
    </el-col>

    <el-col :md="8">
      <h3>问题发起指南</h3>
      <h4>问题题目不能超过x个</h4>
      <h4>问题描述必须填入，并且最长x个</h4>
      <h4>问题标签的格式为：xxx,xxx,xxx,...xxx</h4>
    </el-col>

  </el-row>
</template>

<script>
import {Plus} from '@element-plus/icons'
import {reactive, ref} from "vue";
import store from "@/store";
import {ElMessage, ElMessageBox} from "element-plus";
import axios from "axios";

export default {
  name: "publish",
  data() {
    return {
      tags: []
    }
  }, components: {
    Plus
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
    const formLabelAlign = reactive({
      title: '',
      description: '',
      tag: '',
      isAnoy: false
    })

    const rules = ref({
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
    })

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
            store.dispatch({
              type: 'publish',
              title: formLabelAlign.title,
              description: formLabelAlign.description,
              tag: formLabelAlign.tag
            })
          } else {
            console.log('error submit!', fields)
          }
        })
      })
          .catch(() => {
          })
    }
    return {
      ruleFormRef,
      formLabelAlign,
      submitForm,
      rules,
      onUploadImg
    }
  }, methods: {
    submitUpload() {
      //上传文件
    },
    changeTag(newValue) {
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
      let strings = this.formLabelAlign.tag.split(",");
      let ts = strings.splice(id, 1);
      this.formLabelAlign.tag = strings.join(',')
      this.changeTag(this.formLabelAlign.tag)
    }
  }
}
</script>

<style scoped>

h3 {
  margin: 0px;
  padding: 10px;
}

.el-col {
  height: 100%;
}

.el-row {
  z-index: 1;
  margin: 40px;
  background: white;
}

.el-icon {
  --font-size: 20px;
}

#publishMain {
  display: inline-block
}

#submit {
  float: right;
}
</style>




