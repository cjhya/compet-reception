<template>
  <div>
    <div style="text-align: center; margin: 0 40px">
      <el-image style="width: 100%" :src="competition.picturepath"></el-image>
    </div>
    <div style="margin: 0 40px">
      <el-row type="flex" justify="space-between">
        <el-col :span="18">
          <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            :router="true"
          >
            <el-menu-item index="/comConInfor">竞赛信息</el-menu-item>
            <el-menu-item index="/comAnn">竞赛公告</el-menu-item>
          </el-menu></el-col
        >
        <el-col :span="6" style="border-bottom: solid 1px #e6e6e6"
          ><el-button
            style="float: right"
            :disabled="
              competition.signUpText == '报名请登录' ||
              competition.signUpText == '已报名' ||
              competition.sighUpText == '报名未开始' ||
              $store.getters.getUser.roleName == '老师' ||
              $store.getters.getUser.roleName == '管理员'
            "
            >{{ competition.signUpText }}</el-button
          >
          <div>
            <span>报名时间 距离报名截止还有{{ competition.remain }}天</span
            ><span
              >{{ competition.comLoginstarttime }}-{{
                competition.comLoginendtime
              }}</span
            >
          </div></el-col
        >
      </el-row>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "ComInfor",
  data() {
    return {
      competition: {},
      activeIndex: "",
    };
  },
  created() {
    this.competition = this.$store.getters.getCompetition;
    console.log("获取该竞赛信息", this.competition);
  },
};
</script>

<style></style>
