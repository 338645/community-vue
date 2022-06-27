<template>
  <el-row>
    <el-col :span="16" id="publishMain">
      <h3>
        <el-icon>
          <Plus/>
        </el-icon>
        发起问题
      </h3>
    </el-col>

    <el-col :span="8">
      <h3>问题发起指南</h3>
      问题发起指南问题发起指南问题发起指南问题发起指南问题发起指南
      问题发起指南问题发起指南问题发起指南
      问题发起指南问题发起指南问题发起指南
    </el-col>

  </el-row>
</template>

<script>
import {Plus} from '@element-plus/icons'
import {reactive, ref} from "vue";
import Schema from "async-validator";

export default {
  name: "publish",
  data() {
    return {}
  }, components: {
    Plus
  }, setup() {


    return {

    }
  }, methods: {
    submitUpload() {
      //上传文件
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


<!--<el-form
    label-position="top"
    label-width="100px"
    :model="formLabelAlign"
    :rules="rules"
    class="demo-ruleForm"
    size="small"
>

<el-form-item label="问题标题" required="true" prop="title">

  <el-input v-model="formLabelAlign.title" placeholder="问题标签"/>

</el-form-item>

<el-form-item label="问题补充" required="true" prop="description">

  <el-input
      v-model="formLabelAlign.textarea"
      :rows="4"
      type="textarea"
      placeholder="请输入问题描述"
      resize="none"
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
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>

</el-form-item>

<el-form-item label="标签" required="true" prop="tag">

  <el-input v-model="formLabelAlign.tag" placeholder="请输入标签"/>

</el-form-item>

<el-form-item label="匿名">
  <el-switch v-model="formLabelAlign.isAnoy"/>
</el-form-item>

<el-form-item>
  <el-button type="primary" @click="submitForm(formLabelAlign)" id="submit">提交</el-button>
</el-form-item>

</el-form>-->

