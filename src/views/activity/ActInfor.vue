<template>
  <div>
    <div style="text-align: center; margin: 0 40px">
      <el-image
        style="width: 100%; height: 400px"
        :src="act.activityPicture"
      ></el-image>
    </div>
    <div style="margin: 30px 40px">
      <el-row type="flex" justify="space-between">
        <el-col :span="18">
          <div>
            <h1
              style="
                font-size: 26px;
                color: #444444;
                font-weight: 600;
                text-align: center;
              "
            >
              {{ act.activityName }}
            </h1>
            <h2
              style="
                font-size: 22px;
                color: #666666;
                font-weight: 600;
                border-left: 4px solid #22bfa7;
                padding-left: 10px;
              "
            >
              活动内容
            </h2>
            <div style="overflow: hidden" v-html="act.activityIntro"></div>
          </div>
        </el-col>
        <el-col :span="5" :offset="1">
          <div>
            <h2
              style="
                font-size: 14px;
                color: #444444;
                font-weight: 600;
                border-left: 4px solid #22bfa7;
                padding-left: 10px;
              "
            >
              活动信息
            </h2>
            <div style="font-size: 14px; color: #666666;margin:3px 0">
              主办方：<span style="font-size: 13px; color: #aaaaaa">{{
                act.activityHost
              }}</span>
            </div>
            <div style="font-size: 14px; color: #666666;margin:3px 0">
              发起人：<span style="font-size: 13px; color: #aaaaaa">{{
                act.activityTeacherName
              }}</span>
            </div>
            <div style="margin:3px 0">
              <div style="font-size: 14px; color: #666666">报名时间：</div>
              <span style="font-size: 13px; color: #aaaaaa"
                >{{ act.activityLoginstarttime }} ~
                {{ act.activityLoginendtime }}</span
              >
            </div>
            <div style="margin:3px 0">
              <div style="font-size: 14px; color: #666666">活动时间：</div>
              <span style="font-size: 13px; color: #aaaaaa"
                >{{ act.activityDostarttime }} ~
                {{ act.activityDoendtime }}</span
              >
            </div>
            <div style="font-size: 14px; color: #666666;margin:3px 0">
              分类：<span style="font-size: 13px; color: #aaaaaa">{{
                act.activityInterest
              }}</span>
            </div>
            <div style="font-size: 14px; color: #666666;margin:3px 0">
              级别：<span style="font-size: 13px; color: #aaaaaa">{{
                act.activityLevel
              }}</span>
            </div>
            <div style="font-size: 14px; color: #666666">
              方式：<span style="font-size: 13px; color: #aaaaaa">{{
                act.activityWay
              }}</span>
            </div>
            <div style="font-size: 14px; color: #666666;margin:3px 0">
              联系电话：<span style="font-size: 13px; color: #aaaaaa">{{
                act.activityPhone
              }}</span>
            </div>
            <div style="font-size: 14px; color: #666666;margin:3px 0">
              QQ群：<span style="font-size: 13px; color: #aaaaaa">{{
                act.activityGroup
              }}</span>
            </div>
            <div style="font-size: 14px; color: #666666;margin:3px 0">
              所有名额：<span style="font-size: 13px; color: #aaaaaa">{{
                act.allnumber
              }}</span>
            </div>
            <div style="font-size: 14px; color: #666666;margin:3px 0">
              剩余名额：<span style="font-size: 13px; color: #aaaaaa">{{
                act.remainnumber
              }}</span>
            </div>
            <el-button
              style="
                background-color: #22bfa7;
                color: #ffffff;
                width: 160px;
                height: 50px;
              "
              @click="signUp"
              :disabled="
                act.state != '正在报名' ||
                $store.getters.getUser.roleName == '老师' ||
                $store.getters.getUser.roleName == '管理员' ||
                $store.getters.getUser.roleId == undefined
              "
              v-if="act.state == '正在报名'"
              >{{ act.state }}</el-button
            >
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComInfor",
  data() {
    return {
      act: {},
    };
  },
  created() {
    this.act = this.$store.getters.getActivity;
  },
  methods: {
    async signUp() {
      var turnPage = document.createElement("a");
      turnPage.setAttribute("href", this.act.activityLink);
      turnPage.setAttribute("target", "_blank");
      turnPage.click();
      const { data: res } = await this.$http.post(
        "activity/addactivityrecord",
        {
          userId: this.$store.getters.getUser.userId,
          activityId: this.act.activityId,
        }
      );
      console.log("报名返回信息", res);
    },
  },
};
</script>

<style></style>
