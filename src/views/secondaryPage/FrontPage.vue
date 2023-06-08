<template>
  <div>
    <el-carousel height="400px">
      <el-carousel-item
        v-for="item in comHot"
        :key="item.comId"
        style="text-align: center"
      >
        <el-image
          :src="item.picturepath"
          style="width: 100%; height: 100%"
        ></el-image>
      </el-carousel-item>
    </el-carousel>
    <el-card style="margin: 10px 40px">
      <div slot="header" class="clearfix">
        <h3 style="font-size: 22px; margin: 0">热门竞赛</h3>
        <el-link style="float: right" @click="toCompet" type="primary"
          >查看更多</el-link
        >
      </div>
      <div>
        <el-row type="flex" justify="space-between">
          <el-col
            :span="5"
            v-for="item in comHot"
            :key="item.comId"
            style="margin: 10px 10px 0 20px"
            @click.native="toComInfor(item)"
          >
            <div>
              <el-image :src="item.picturepath"></el-image>
              <p style="font-size: 14px">
                <el-tag size="mini">{{ item.state }}</el-tag> {{ item.comName }}
              </p>
              <p style="font-size: 12px; color: #aaaaaa">
                主办方: {{ item.absComHost }}
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card style="margin: 10px 40px">
      <div slot="header" class="clearfix">
        <h3 style="font-size: 22px; margin: 0">热门活动</h3>
        <el-link style="float: right" type="primary">查看更多</el-link>
      </div>
      <div>
        <el-row type="flex" justify="space-between">
          <el-col
            :span="5"
            v-for="item in actHot"
            :key="item.activityId"
            style="margin: 10px 10px 0 20px"
          >
            <div>
              <el-image :src="item.activityPicture"></el-image>
              <p style="font-size: 14px">
                <el-tag size="mini">{{ item.state }}</el-tag>
                {{ item.activityName }}
              </p>
              <p style="font-size: 12px; color: #aaaaaa">
                主办方: {{ item.activityHost }}
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "FrontPage",
  data() {
    return {
      comHot: [],
      joinComs: [],
      actHot: [],
    };
  },
  created() {
    this.getAllComHot();
    if (this.$store.getters.getUser.userId != undefined) {
      this.getMyJoinComs();
    }
    this.getAllActHot();
  },
  methods: {
    async getAllActHot() {
      const { data: res } = await this.$http.get("activity/gethotactivity");
      this.actHot = res.data;
      this.actHot = this.actHot.slice(0, 5);
      console.log("查看热门活动返回信息", res);
    },
    //获取我参加的竞赛
    async getMyJoinComs() {
      const { data: res } = await this.$http.get(
        "competition/getmyparticipant?userId=" +
          this.$store.getters.getUser.userId
      );
      this.joinComs = res.data;
    },
    //进入详细竞赛信息
    toComInfor(competition) {
      competition.comLoginstarttime = competition.comLoginstarttime.substr(
        0,
        10
      );
      competition.comLoginendtime = competition.comLoginstarttime.substr(0, 10);
      competition.comDostarttime = competition.comLoginstarttime.substr(0, 10);
      competition.comDoendtime = competition.comLoginstarttime.substr(0, 10);
      this.$store.dispatch("asyncUpdateCompetition", competition);
      this.$router.push("/comInfor");
      this.$emit("changeInd");
    },
    //查看更多竞赛
    toCompet() {
      this.$router.push("/competition");
      this.$emit("changeInd", "/competition");
    },
    async getAllComHot() {
      const { data: res } = await this.$http.get("competition/gethot");
      this.comHot = res.data;
      this.comHot = this.comHot.slice(0, 5);
      for (let comp of this.comHot) {
        if (comp.state == "正在报名") {
          if (comp.absComLink != "") {
            comp.signUpText = "官网报名";
            continue;
          }
          if (this.$store.getters.getUser.userId == undefined) {
            comp.signUpText = "报名请登录";
            continue;
          } else {
            for (let joinCom of this.joinComs) {
              if (joinCom.comId == comp.comId) {
                if (joinCom.state == "待支付") {
                  comp.signUpText = "待支付";
                  break;
                } else if (joinCom.state == "组队接受中") {
                  comp.signUpText = "组队接受中";
                  break;
                } else {
                  comp.signUpText = "已报名";
                  break;
                }
              }
            }
          }
        }
        if (comp.signUpText == undefined) comp.signUpText = comp.state;
      }
    },
  },
};
</script>

<style scoped>
.el-card ::v-deep .el-card__header {
  padding-bottom: 5px;
}
</style>
