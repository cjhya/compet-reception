<template>
  <div>
    <div style="text-align: center; margin: 0 40px">
      <el-image
        style="width: 100%; height: 400px"
        :src="competition.picturepath"
      ></el-image>
    </div>
    <div style="margin: 0 40px">
      <el-row type="flex" justify="space-between">
        <el-col :span="18">
          <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            :router="true"
          >
            <el-menu-item
              index="/comConInfor"
              style="font-size: 18px; color: #666666; font-weight: 600"
              >竞赛信息</el-menu-item
            >
            <el-menu-item
              index="/comAnn"
              style="font-size: 18px; color: #666666; font-weight: 600"
              >竞赛公告</el-menu-item
            >
            <el-menu-item
              index="/excellentWork"
              style="font-size: 18px; color: #666666; font-weight: 600"
              >优秀作品</el-menu-item
            >
          </el-menu></el-col
        >
        <el-col :span="6" style="border-bottom: solid 1px #e6e6e6">
          <div>
            <el-button
              @click="signUp(competition)"
              style="float: right; background: #22bfa7; color: #fff"
              :disabled="
                (competition.signUpText != '正在报名' &&
                  competition.signUpText != '待支付' &&
                  competition.signUpText != '组队接受中' &&
                  competition.signUpText != '官网报名') ||
                $store.getters.getUser.roleName == '老师' ||
                $store.getters.getUser.roleName == '管理员'
              "
              v-if="competition.state == '正在报名'"
              >{{ competition.signUpText }}</el-button
            >
            <div>
              <div style="font-size: 14px; color: #666666; font-weight: 600">
                报名时间
                <span v-if="competition.state == '正在报名'"
                  >距离报名截止还有{{ competition.remain }}天</span
                >
              </div>
              <div style="font-size: 14px; color: #878787">
                {{ competition.comLoginstarttime }}-{{
                  competition.comLoginendtime
                }}
              </div>
            </div>
          </div>
        </el-col>
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
      activeIndex: "/comConInfor",
    };
  },
  created() {
    this.competition = this.$store.getters.getCompetition;
    console.log("竞赛信息", this.competition);
  },
  methods: {
    //报名按钮
    sighUp(competition) {
      if (competition.absComLink != "") {
        var turnPage = document.createElement("a");
        turnPage.setAttribute("href", competition.absComLink);
        turnPage.setAttribute("target", "_blank");
        turnPage.click();
        return;
      }
      if (competition.comType == "个人赛") {
        this.$router.push("/personalSignUp");
      } else {
        this.$router.push("/teamSignUp");
      }
    },
  },
};
</script>

<style></style>
