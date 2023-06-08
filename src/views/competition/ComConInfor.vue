<template>
  <div style="margin: 0 40px 10px 40px">
    <el-row>
      <el-col :span="18"
        ><h1 style="font-size: 26px; color: #444444; font-weight: 600">
          {{ competition.comName }}
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
          竞赛信息
        </h2>
        <div
          style="overflow: hidden"
          v-html="competition.absComIntroduction"
        ></div>
        <h2
          style="
            font-size: 22px;
            color: #666666;
            font-weight: 600;
            border-left: 4px solid #22bfa7;
            padding-left: 10px;
          "
        >
          主办单位
        </h2>
        <span style="font-size: 14px; color: #666666">{{
          competition.absComHost
        }}</span>
        <h2
          style="
            font-size: 22px;
            color: #666666;
            font-weight: 600;
            border-left: 4px solid #22bfa7;
            padding-left: 10px;
          "
        >
          联系方式
        </h2>
        <p style="font-size: 14px; color: #666666">
          电子邮箱{{ competition.absComEmail }}
        </p>
        <p style="font-size: 14px; color: #666666">
          电话号码{{ competition.absComPhone }}
        </p></el-col
      >
      <el-col :span="6"
        ><h3
          style="
            font-size: 14px;
            color: #666666;
            font-weight: 600;
            border-left: 4px solid #22bfa7;
            padding-left: 6px;
          "
        >
          发布者
        </h3>
        <p style="font-size: 16px; color: #444444; font-weight: 600">
          {{ competition.absComHost }}
        </p>
        <h3
          style="
            font-size: 14px;
            color: #666666;
            font-weight: 600;
            border-left: 4px solid #22bfa7;
            padding-left: 6px;
          "
        >
          类型 {{ competition.comType }}
        </h3>
        <h3
          style="
            font-size: 14px;
            color: #666666;
            font-weight: 600;
            border-left: 4px solid #22bfa7;
            padding-left: 6px;
          "
        >
          主办方
        </h3>
        <p style="font-size: 13px; color: #aaaaaa">
          {{ competition.absComHost }}
        </p>
        <h3
          style="
            font-size: 14px;
            color: #666666;
            font-weight: 600;
            border-left: 4px solid #22bfa7;
            padding-left: 6px;
          "
        >
          报名时间
          <span v-if="competition.state == '正在报名'"
            >距离报名截止还有{{ competition.remain }}天</span
          >
        </h3>
        <p style="font-size: 13px; color: #aaaaaa">
          {{ competition.comLoginstarttime }} 至
          {{ competition.comLoginendtime }}
        </p>
        <h3
          style="
            font-size: 14px;
            color: #666666;
            font-weight: 600;
            border-left: 4px solid #22bfa7;
            padding-left: 6px;
          "
        >
          比赛时间
          <span
            v-if="
              competition.state != '进行中' || competition.state != '已结束'
            "
            >尚未开始</span
          >
        </h3>
        <p style="font-size: 13px; color: #aaaaaa">
          {{ competition.comDostarttime }} 至 {{ competition.comDoendtime }}
        </p>
        <h3
          style="
            font-size: 14px;
            color: #666666;
            font-weight: 600;
            border-left: 4px solid #22bfa7;
            padding-left: 6px;
          "
        >
          竞赛类别
        </h3>
        <p style="font-size: 13px; color: #aaaaaa">
          {{ competition.absComsubject }}
        </p>
        <h3
          style="
            font-size: 14px;
            color: #666666;
            font-weight: 600;
            border-left: 4px solid #22bfa7;
            padding-left: 6px;
          "
        >
          关注竞赛 <span style="font-size: 12px">以后会第一时间收到消息</span>
        </h3>
        <el-button
          style="font-size: 12px; color: #666666"
          @click="subCom(competition.comId)"
          :disabled="competition.isSub == '已订阅'"
          ><span
            ><i id="subIcon" class="el-icon-star-off"></i>{{ subText }}</span
          >
        </el-button></el-col
      >
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ComConInfor",
  data() {
    return {
      competition: {},
      subComs: [],
      subscribeComs: [],
      subText: "关注",
    };
  },
  created() {
    this.getMySubscribeComs();
  },
  methods: {
    //获取我订阅的竞赛
    async getMySubscribeComs() {
      const { data: res } = await this.$http.get(
        "note/getsub?userId=" + this.$store.getters.getUser.userId
      );
      this.subscribeComs = res.data;
      this.competition = this.$store.getters.getCompetition;
      for (let subCom of this.subscribeComs) {
        if (subCom.comId == this.competition.comId) {
          this.competition.isSub = "已订阅";
          this.subText = "已关注";
          document.getElementById("subIcon").className = "el-icon-star-on";
          return;
        }
      }
      this.competition.isSub = "未订阅";
    },
    //订阅竞赛
    async subCom(id) {
      const { data: res } = await this.$http.post("note/subcompetition", {
        userId: this.$store.getters.getUser.userId,
        comId: id,
      });
      this.competition.isSub = "已订阅";
      this.subText = "已关注";
      document.getElementById("subIcon").className = "el-icon-star-on";
    },
  },
};
</script>

<style></style>
