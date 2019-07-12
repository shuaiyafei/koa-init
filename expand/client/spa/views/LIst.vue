<template>
  <div class="list-wrap">
    <div class="list-tool">
      <el-button
        v-show="deleteStatus && currentOption.length"
        type="danger"
        size="medium"
        @click="deleteOption"
      >删除</el-button>
      <el-input
        placeholder="请输入搜索内容"
        v-model="keyword"
        prefix-icon="el-icon-search"
        @input="searchContent"
        v-show="!deleteStatus"
      ></el-input>
    </div>
    <ul class="list-content">
      <li
        v-for="(todo, key) in todoList"
        :key="key"
        :class="{'list-content-select': currentOption.includes(key)}"
        @click="updateNote(key)"
      >
        <i
          v-show="deleteStatus"
          class="iconfont"
        >{{currentOption.includes(key) ? '&#xe657;' : '&#xe67f;'}}</i>
        <div>
          <h4>{{todo.content | getTitle}}</h4>
          <p class="list-info">
            <span>{{todo.time | getTime}}</span>
            <span>{{todo.content | getInfo}}</span>
          </p>
        </div>
      </li>
    </ul>
    <div class="list-opera">
      <p>
        <span @click="operaList" v-show="!deleteStatus">编辑</span>
        <span @click="cancelList" v-show="deleteStatus">取消</span>
      </p>
      <p>
        <span v-show="todoList.length">{{todoList.length}}个记事本</span>
      </p>
      <i class="el-icon-edit-outline" @click="newNote"></i>
    </div>
  </div>
</template>

<script>
import debounce from "../../module/js/debounce";

export default {
  data() {
    return {
      // 本地list
      todoList: [],
      // 搜索关键字
      keyword: "",
      // 是否执行删除操作
      deleteStatus: false,
      // 当前选中的option
      currentOption: []
    };
  },
  filters: {
    getTitle(w) {
      let result;
      let split = w.split("\n");
      for (let i = 0; i < split.length; i++) {
        result = split[i];
        if (result.trim()) {
          break;
        }
      }
      return result.substr(0, 20);
    },
    getTime(w) {
      const date = new Date(w);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}/${month}/${day}`;
    },
    getInfo(w) {
      let result;
      let flag = false;
      let split = w.split("\n");
      for (let i = 0; i < split.length; i++) {
        result = split[i];
        if (result.trim()) {
          if (flag) {
            break;
          } else {
            flag = !flag;
          }
        }
      }
      return result.substr(0, 12);
    }
  },
  mounted() {
    if (localStorage.todoList) {
      this.todoList = JSON.parse(localStorage.todoList);
    }
  },
  methods: {
    // 新建
    newNote() {
      this.$router.push("new");
    },
    // 修改
    updateNote(key) {
      if (this.deleteStatus) {
        this.selectOption(key);
      } else {
        this.$router.push({
          path: "new",
          query: {
            key
          }
        });
      }
    },
    // 搜索
    searchContent() {
      debounce(() => {
        if (this.keyword) {
          let result = [];
          this.todoList.forEach(item => {
            if (item.content.includes(this.keyword)) {
              result.push(item);
            }
          });
          this.todoList = result;
        } else {
          if (localStorage.todoList) {
            this.todoList = JSON.parse(localStorage.todoList);
          }
        }
      }, 500)();
    },
    // 点击编辑  进入删除状态
    operaList() {
      this.deleteStatus = !this.deleteStatus;
    },
    // 点击取消 进入编辑状态
    cancelList() {
      this.deleteStatus = !this.deleteStatus;
      this.currentOption = [];
    },
    // 当前选中的option
    selectOption(key) {
      const index = this.currentOption.indexOf(key);
      if (index === -1) {
        this.currentOption.push(key);
      } else {
        this.currentOption.splice(index, 1);
      }
    },
    // 删除
    deleteOption() {
      let result = [];
      JSON.parse(localStorage.todoList).forEach((item, index) => {
        if (!this.currentOption.includes(index)) {
          result.push(item);
        }
      });
      this.todoList = result;
      this.cancelList();
      localStorage.setItem("todoList", JSON.stringify(result));
    }
  }
};
</script>

<style lang="scss">
body {
  padding: 10px;
}
.list-content {
  & > li {
    height: 50px;
    margin-top: 10px;
    border-bottom: 1px solid #dedede;
    display: flex;
    & > i {
      line-height: 50px;
      margin-right: 10px;
      font-size: 25px;
      font-weight: 100;
    }
    &:last-child {
      border: none;
    }
  }
}
.list-tool {
  & input {
    background: #eee;
  }
  & button {
    width: 100%;
  }
}
.list-info {
  display: flex;
  justify-content: space-between;
  & > span {
    &:first-child {
      width: 100px;
    }
    &:last-child {
      flex: 1;
    }
  }
}
.list-opera {
  position: fixed;
  bottom: 0;
  padding: 15px 0;
  display: flex;
  width: calc(100% - 20px);
  justify-content: space-between;
  background: #f7f1e3;
  & > i {
    font-size: 26px;
  }
}
.list-content-select {
  background: #dedede;
}
</style>
