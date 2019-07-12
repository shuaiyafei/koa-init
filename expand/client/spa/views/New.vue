<template>
  <div class="new-wrap">
    <div class="new-content">
      <el-input type="textarea" autofocus="true" v-model="content" @change="updateContent"></el-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: "",
      content: "",
      query: "",
      localData: ""
    };
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
  },
  mounted() {
    // 获取新建参数
    this.query = this.$route.query;
    // 获取本地存储数据
    this.localData = this.getLocalData();
    if (Object.keys(this.query).length) {
      this.key = this.query.key;
      this.content = this.localData[this.key].content;
    }
  },
  methods: {
    getLocalData() {
      let result = [];
      if (localStorage.todoList) {
        result = JSON.parse(localStorage.todoList);
      }
      return result;
    },
    setLcalData(res) {
      localStorage.setItem("todoList", JSON.stringify(res));
    },
    updateContent() {
      // 编辑
      if (Object.keys(this.query).length) {
        this.localData[this.key].content = this.content;
        this.localData[this.key].time = +new Date();
        this.localData.unshift(this.localData.splice(this.key, 1)[0]);
        this.setLcalData(this.localData);
      } else {
        // 新建
        if (this.localData.length === 0) {
          this.localData.push({
            content: this.content,
            time: +new Date()
          });
        } else {
          this.localData.unshift({
            content: this.content,
            time: +new Date()
          });
        }
        this.setLcalData(this.localData);
      }
    }
  }
};
</script>

<style lang="scss">
.new-content {
  width: calc(100vw - 10px);
  height: calc(100vh - 20px);;
  display: block;
  & > .el-textarea {
    height: 100%;
  }
  & textarea {
    width: 100%;
    height: 100%;
    background-color: transparent;
    color: #666464;
    border: 0 none;
    outline: none;
    resize: none;
    font-size: 20px;
  }
}
</style>


