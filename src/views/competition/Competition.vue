<template>
  <div>
    <el-carousel height="350px">
      <el-carousel-item
        v-for="item in recomComs"
        :key="item.comId"
        style="text-align: center"
      >
        <el-image
          :src="item.picturepath"
          style="width: 100%; height: 100%"
        ></el-image>
      </el-carousel-item>
    </el-carousel>
    <div style="display: flex">
      <div style="flex: 4; margin-top: 10px">
        <div
          style="
            width: 90%;
            border: 1px solid #e6e6e6;
            margin: 10px 0 10px 40px;
          "
        >
          <el-row v-for="aut1 in classList" :key="aut1.natureId">
            <!-- 渲染一级分类 -->
            <el-col :span="3" style="text-align: right">
              <el-tag style="font-size: 14px; color: #7f8792">{{
                aut1.natureName
              }}</el-tag>
            </el-col>
            <!-- 渲染二级分类 -->
            <el-col :span="21" bdright>
              <el-tag
                v-for="aut2 in aut1.children"
                :key="aut2.subjectId"
                :class="{ act: aut2.subjectName == activeSubjectName }"
                @click="getCompets(aut2.subjectId, aut2.subjectName)"
                style="font-size: 14px; color: #666666"
              >
                {{ aut2.subjectName }}</el-tag
              >
            </el-col>
          </el-row>

          <el-row v-for="aut1 in levels" :key="aut1.name">
            <!-- 渲染一级分类 -->
            <el-col :span="3" style="text-align: right">
              <el-tag style="font-size: 14px; color: #7f8792">{{
                aut1.name
              }}</el-tag>
            </el-col>
            <!-- 渲染二级分类 -->
            <el-col :span="21" bdright>
              <el-tag
                v-for="aut2 in aut1.children"
                :key="aut2.levelId"
                :class="{ act: aut2.levelName == activeLevel }"
                @click="getCompets2(aut2.levelName)"
                style="font-size: 14px; color: #666666"
              >
                {{ aut2.levelName }}</el-tag
              >
            </el-col>
          </el-row>
        </div>
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
                v-if="item.state == '正在报名' && item.remain&gt;=0"
              >
                距离报名截止还有{{ item.remain }}天
              </p>
              <p @click="toComInfor(item)" style="color: #666666">
                <el-link
                  :underline="false"
                  :class="{ isSignText: item.state != '正在报名' }"
                  >竞赛详情<i class="el-icon-arrow-right"></i
                ></el-link>
              </p>
            </div>
          </el-card>
        </div>
      </div>
      <div style="flex: 1">
        <div
          class="toplist"
          style="border: 1px solid #e6e6e6; margin-top: 20px; width: 80%"
        >
          <header class="t-header">
            <h1
              class="t-h-name"
              style="color: #31363f; font-size: 18px; margin: 0 0 0 10px"
            >
              推荐竞赛排行榜
            </h1>
          </header>
          <div
            v-for="(item, index) in recomComs"
            :key="index"
            class="toplist-item"
            @click="toComInfor(item)"
          >
            <i class="t-i-number" style="margin: 0 2px 0 0; font-size: 14px">{{
              index + 1
            }}</i>
            <div class="t-i-tilte">
              <span style="font-size: 12px; color: #31363f">{{
                item.comName
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Competition",
  data() {
    return {
      classList: [],
      activeSubjectId: "",
      activeSubjectName: "全部",
      levels: [
        {
          name: "竞赛级别",
          children: [
            { levelName: "全部" },
            { levelName: "校级" },
            { levelName: "省级" },
            { levelName: "国家级" },
          ],
        },
      ],
      activeLevel: "全部",
      compets: [],
      recomComs: [],
      joinComs: [],
    };
  },
  created() {
    //获取所有竞赛分类
    this.getClassList();
    this.getRecommendComs();
    if (this.$store.getters.getUser.userId != undefined) {
      this.getMyJoinComs();
    } else {
      this.getCompets2("全部");
    }
  },
  methods: {
    //获取我参加的竞赛
    async getMyJoinComs() {
      const { data: res } = await this.$http.get(
        "competition/getmyparticipant?userId=" +
          this.$store.getters.getUser.userId
      );
      this.joinComs = res.data;
      console.log("我参加的竞赛", this.joinComs);
      this.getCompets2("全部");
    },
    //获取排行榜
    async getRecommendComs() {
      const { data: res } = await this.$http.get(
        "competition/getrecommend?userId=" + this.$store.getters.getUser.userId
      );
      this.recomComs = res.data;
    },
    //获取所有竞赛分类
    async getClassList() {
      const { data: res } = await this.$http.get("subject/getsubject");
      this.classList = res.data;
      this.classList.unshift({
        natureId: "1001",
        natureName: "竞赛类别",
        children: [{ subjectId: "1000", subjectName: "全部" }],
      });
    },
    //点击分类获取竞赛
    async getCompets(id, name) {
      this.activeSubjectId = id;
      this.activeSubjectName = name;
      if (name == "全部") this.activeSubjectId = "";
      const { data: res } = await this.$http.get(
        "competition/getcompetitionbysubjectandlevel?subjectId=" +
          this.activeSubjectId +
          "&level=" +
          (this.activeLevel == "全部" ? "" : this.activeLevel)
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
        if (comp["signUpText"] == undefined) {
          comp.signUpText = comp.state;
        }
      }
    },
    //点击级别获取竞赛
    async getCompets2(name) {
      this.activeLevel = name;
      const { data: res } = await this.$http.get(
        "competition/getcompetitionbysubjectandlevel?subjectId=" +
          this.activeSubjectId +
          "&level=" +
          (this.activeLevel == "全部" ? "" : this.activeLevel)
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
          }
        }
        if (comp.signUpText == undefined) comp.signUpText = comp.state;
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
      this.$emit("changeInd");
    },
    //报名按钮
    signUp(competition) {
      this.$store.dispatch("asyncUpdateCompetition", competition);
      if (competition.comType == "个人赛") {
        this.$router.push("/personalSignUp");
      } else {
        this.$router.push("/teamSignUp");
      }
      this.$emit("changeInd");
    },
  },
};
</script>

<style scoped>
.isSignText {
  font-size: 22px;
}

.el-tag {
  background-color: #fff;
  border-color: #fff;
  margin: 2px;
  color: #333;
}
.el-tag:hover {
  color: #22bfa7;
}
.el-tag.act {
  color: #22bfa7;
  font-weight: 300;
  background: #e7fffb;
  border-radius: 2px;
}

.toplist {
  width: 100%;
}
.t-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
.t-h-name {
  font-size: 18px;
}
.more {
  padding: 2px 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.toplist-item {
  justify-content: space-around;
  width: 100%;
  padding: 8px 0;
}

.t-i-number {
  display: inline-block;
  width: 10%;
  height: 20px;
  margin-right: 5%;
  font-size: 14px;
  color: #999;
  text-align: center;
}

.t-i-tilte {
  display: inline-block;
  width: 85%;
  font-size: 14px;
  /* 垂直对齐  父级要变*/
  vertical-align: middle;
}
.t-i-tilte span {
  /* 两行显示 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: #4d4d4d;
}
</style>
