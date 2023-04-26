<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            :router="true"
          >
            <el-menu-item index="/frontPage">首页</el-menu-item>
            <el-menu-item index="/competition">竞赛</el-menu-item>
            <el-menu-item index="/forum">论坛</el-menu-item>
          </el-menu></el-col
        >
        <el-col :span="6"
          ><el-input
            placeholder="搜一搜 发现更多精彩"
            prefix-icon="el-icon-search"
            v-model="wordkey"
            @keyup.enter.native="search"
          >
          </el-input
        ></el-col>
        <el-col :span="6">
          <span v-show="chang" style="float: right" @click="toLoginRegister"
            >注册/登录</span
          >

          <el-dropdown v-show="!chang" style="float: right; margin-left: 10px">
            <el-avatar
              :src="require('../assets/ava.jpg')"
              style="display: inline-box; vertical-align: middle"
            ></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>我的竞赛</el-dropdown-item>
              <el-dropdown-item @click.native="logout"
                >退出账号</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>

          <!-- 消息按钮 -->
          <span v-show="!chang" style="float: right">
            <el-image
              :src="require('../assets/message.png')"
              style="
                display: inline-box;
                vertical-align: middle;
                width: 30px;
                height: 30px;
              "
              @click="toInfor"
            ></el-image>
          </span>

          <el-dropdown style="float: right; margin-right: 10px">
            <el-button :disabled="$store.getters.getUser.roleId == undefined"
              >发布<i class="el-icon-s-promotion"></i
            ></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :disabled="$store.getters.getUser.roleName != '老师'"
                >竞赛</el-dropdown-item
              >
              <el-dropdown-item @click.native="toPostArticle"
                >文章</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <router-view
        @judgeLogin="judgeIsLogin"
        @changeInd="changeIndex"
      ></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      activeIndex: "/frontPage",
      wordkey: "",
      chang: true,
    };
  },
  created() {},
  methods: {
    //回车搜索事件
    search() {
      this.$store.dispatch("asyncUpdateSearchKey", this.wordkey);
      this.$router.push("/searchRes");
      this.activeIndex = "/searchRes";
      console.log("当前激活菜单", this.activeIndex);
    },
    judgeIsLogin() {
      if (this.$store.getters.getUser.userId) {
        this.chang = false;
      }
    },
    //子组件触发事件
    changeIndex(data) {
      this.activeIndex = data;
    },
    toLoginRegister() {
      this.$router.push("/loginRegister");
      this.activeIndex = "/loginRegister";
    },
    toPostArticle() {
      this.$router.push("/postArticle");
      this.activeIndex = "/postArticle";
    },
    toInfor() {
      this.$router.push("/infor");
      this.activeIndex = "/infor";
    },
    //退出账号
    logout() {
      this.chang = true;
      this.$message({
        showClose: true,
        message: "已退出登录",
        type: "success",
      });
      this.$store.dispatch("asyncUpdateUser", {});
      this.$router.push("/frontPage");
    },
  },
};
</script>

<style>
.el-header {
  color: #333;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px #e6e6e6 solid;
  padding: 0 !important;
  margin: 0 40px;
}
.el-main {
  color: #333;
}
.el-card__body,
.el-main {
  padding: 0 !important;
}
</style>
