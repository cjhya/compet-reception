<template>
  <div>
    <h1 style="margin-left: 20%">"{{ wordkey }}"搜索结果</h1>
    <el-tabs type="border-card" style="margin: 10px auto; width: 60%">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-s-platform"></i>竞赛</span>
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
              <h1 style="margin: 0">
                <span style="font-size: 15px; color: #22bfa7">{{
                  item.state
                }}</span>
                {{ item.comName }}
              </h1>
              <p>主办方 {{ item.absComHost }}</p>
              <p>竞赛级别 {{ item.absComLevel }}</p>
              <p style="font-size: 5px">
                报名时间 {{ item.comLoginstarttime }} ~
                {{ item.comLoginendtime }}
              </p>
              <p style="font-size: 5px">
                比赛时间 {{ item.comDostarttime }} ~ {{ item.comDoendtime }}
              </p>
            </div>
            <div style="float: right; text-align: right">
              <el-button
                @click="sighUp(item)"
                :disabled="
                  item.signUpText == '报名请登录' ||
                  item.signUpText == '已报名' ||
                  item.sighUpText == '报名未开始'
                "
                >{{ item.signUpText }}</el-button
              >
              <h2>距离报名截止还有{{ item.remain }}天</h2>
              <span @click="toComInfor(item)"
                >竞赛详情<i class="el-icon-arrow-right"></i
              ></span>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-document"></i>文章</span>
        <h1 v-if="arts.length == 0" style="margin-left: 40px">无</h1>
        <div style="width: 90%; margin: 10px auto">
          <div
            v-for="item in arts"
            :key="item.artId"
            style="border: solid 1px #e6e6e6; padding: 0 20px; margin: 20px 0"
          >
            <h1 @click="toConArt(item)">{{ item.artName }}</h1>
            <span v-html="$options.filters.setContent(item.artContent)"></span>
            <p>{{ item.artPosttime }}</p>
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
    };
  },
  created() {
    this.wordkey = this.$store.getters.getSearchKey;
    this.getAllCompetitions();
    this.getAllArticles();
  },
  methods: {
    async getAllCompetitions() {
      const { data: res } = await this.$http.get(
        "competition/getcompetitionbysubjectandlevel?query=" + this.wordkey
      );
      this.compets = res.data;
      console.log("竞赛搜索结果", this.compets);
      for (let comp of this.compets) {
        if (comp.state == "正在报名") {
          if (this.$store.getters.getUser.userId == undefined) {
            comp.signUpText = "报名请登录";
          } else if (1) {
            //没有报名该竞赛
            comp.signUpText = "马上报名";
          } else {
            //报名该竞赛
            comp.sighUpText = "已报名";
          }
        } else if (comp.state == "未开始") {
          comp.signUpText = "报名未开始";
        }
      }
    },
    async getAllArticles() {
      const { data: res } = await this.$http.get(
        "forum/getarticle?query=" + this.wordkey
      );
      this.arts = res.data;
      console.log("文章搜索结果", this.arts);
    },
    //报名按钮
    sighUp(competition) {
      this.$store.dispatch("asyncUpdateCompetition", competition);
      console.log("竞赛信息", this.$store.getters.getCompetition);
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
      console.log("竞赛信息", this.$store.getters.getCompetition);
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

<style></style>
