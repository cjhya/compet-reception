<template>
  <div>
    <h1 style="margin-left: 20%">"{{ wordkey }}"搜索结果</h1>
    <el-tabs type="border-card" style="margin: 10px auto; width: 60%">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-trophy"></i>竞赛</span>
        <h1 v-if="compets.length == 0" style="margin-left: 40px">无</h1>
        <div v-for="item in compets" :key="item.comId">
          <el-card
            style="
              width: 90%;
              margin: 10px 0 10px 40px;
              padding: 10px;
              box-sizing: border-box;
            "
          >
            <div style="float: left">
              <h1 style="margin: 0; font-size: 20px">
                <span style="font-size: 14px; color: #22bfa7">{{
                  item.state
                }}</span>
                {{ item.comName }}
              </h1>
              <p style="font-size: 14px; color: #aaaaaa">
                主办方 {{ item.absComHost }}
              </p>
              <p style="font-size: 14px; color: #aaaaaa">
                竞赛级别 {{ item.absComLevel }}
              </p>
              <p style="font-size: 14px; color: #aaaaaa; margin: 0">
                报名时间 {{ item.comLoginstarttime }} ~
                {{ item.comLoginendtime }}
              </p>
              <p style="font-size: 14px; color: #aaaaaa; margin: 0">
                比赛时间 {{ item.comDostarttime }} ~ {{ item.comDoendtime }}
              </p>
            </div>
            <div style="float: right; text-align: right">
              <el-button
                style="
                  background-color: #22bfa7;
                  color: #ffffff;
                  width: 160px;
                  height: 50px;
                "
                @click="signUp(item)"
                :disabled="
                  (item.signUpText != '正在报名' &&
                    item.signUpText != '待支付') ||
                  $store.getters.getUser.roleName == '老师' ||
                  $store.getters.getUser.roleName == '管理员'
                "
                v-if="item.state == '正在报名'"
                >{{ item.signUpText }}</el-button
              >
              <p
                style="font-size: 14px; color: #666666"
                v-if="item.state=='正在报名'&&item.remain&gt;=0"
              >
                距离报名{{ item.statusText }}还有{{ item.remain }}天
              </p>
              <p
                @click="toComInfor(item)"
                style="color: #666666"
              >
                <el-link
                  :underline="false"
                  :class="{ isSignText: item.state != '正在报名' }"
                  >竞赛详情<i class="el-icon-arrow-right"></i
                ></el-link>
              </p>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-postcard"></i>文章</span>
        <h1 v-if="arts.length == 0" style="margin-left: 40px">无</h1>
        <div style="width: 90%; margin: 10px auto">
          <div
            v-for="item in arts"
            :key="item.artId"
            style="border: solid 1px #e6e6e6; padding: 20px; margin: 20px 0"
            @click="toConArt(item)"
          >
            <div style="display: flex">
              <div style="margin-right: 10px">
                <el-avatar :src="item.headpicture"></el-avatar>
              </div>
              <div>
                <div style="font-size: 12px; color: #666666">
                  {{ item.artUser }}
                </div>
                <h1 style="font-size: 16px; color: #444444">
                  {{ item.artName }}
                </h1>
                <div
                  v-html="$options.filters.setContent(item.artContent)"
                  style="font-size: 12px; color: #999999"
                ></div>
                <span style="font-size: 12px; color: #aaaaaa"
                  >{{ item.artPosttime }}
                  <img
                    src="../../assets/阅读量.png"
                    alt=""
                    style="width: 14px; height: 14px"
                  />{{ item.readcount }}
                  <img
                    src="../../assets/点赞.png"
                    alt=""
                    style="width: 14px; height: 14px"
                  />{{ item.artApprove }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "SearchRes",
  data() {
    return {
      wordkey: "",
      compets: [],
      arts: [],
      joinComs: [],
    };
  },
  created() {
    this.wordkey = this.$store.getters.getSearchKey;
    this.getAllArticles();
    if (this.$store.getters.getUser.userId != undefined) {
      this.getMyJoinComs();
    } else {
      this.getAllCompetitions();
    }
  },
  methods: {
    async toConArt(article) {
      const { data: res } = await this.$http.post("forum/addreadcount", {
        artId: article.artId,
      });
      article.readcount += 1;
      this.$store.dispatch("asyncUpdateArticle", article);
      this.$router.push("/conArticle");
      this.$emit("changeInd");
    },
    //获取我参加的竞赛
    async getMyJoinComs() {
      const { data: res } = await this.$http.get(
        "competition/getmyparticipant?userId=" +
          this.$store.getters.getUser.userId
      );
      this.joinComs = res.data;
      this.getAllCompetitions();
    },
    async getAllCompetitions() {
      const { data: res } = await this.$http.get(
        "competition/getcompetitionbysubjectandlevel?query=" + this.wordkey
      );
      this.compets = res.data;
      for (let comp of this.compets) {
        if (comp.state == "正在报名") {
          if (this.$store.getters.getUser.userId == undefined) {
            comp.signUpText = "报名请登录";
            continue;
          } else {
            for (let joinCom of this.joinComs) {
              if (joinCom.comId == comp.comId) {
                if (joinCom.state == "待支付") {
                  comp.signUpText = "待支付";
                  break;
                } else {
                  comp.signUpText = "已报名";
                  break;
                }
              }
            }
            comp.signUpText = "马上报名";
          }
        }
        if (comp.signUpText == undefined) {
          comp.signUpText = comp.state;
        }
      }
      console.log("搜索关键字返回信息",this.compets)
    },
    async getAllArticles() {
      const { data: res } = await this.$http.get(
        "forum/getarticle?query=" + this.wordkey
      );
      this.arts = res.data;
    },
    //报名按钮
    sighUp(competition) {
      this.$store.dispatch("asyncUpdateCompetition", competition);
      if (competition.comType == "个人赛") {
        this.$router.push("/personalSignUp");
      } else {
        this.$router.push("/teamSignUp");
      }
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
    },
    toConArt(article) {
      this.$store.dispatch("asyncUpdateArticle", article);
      this.$router.push("/conArticle");
    },
  },
  filters: {
    //当渲染的文字超出一定字节后显示省略号
    setContent(value) {
      if (!value) return "";
      if (value.length > 80) {
        return value.slice(0, 80) + "...";
      }
      return value;
    },
  },
};
</script>

<style scoped>
.isSignText {
  font-size: 22px;
}
</style>
