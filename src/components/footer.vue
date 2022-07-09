<template>
  <div class="footer" style="background: red">
    Copyright © {{ yaer }}· CC BY-NC-SA 3.0 ·
    <el-link to="/">{{ webName }}</el-link>
    · 友情链接
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  props: {
    yaer: String,
    webName: String
  }
})
export default class footer extends Vue {
  yaer!: String
  webName!: String
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>