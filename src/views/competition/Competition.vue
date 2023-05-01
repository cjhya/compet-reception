<template>
  <div>
    <el-carousel height="300px">
      <el-carousel-item
        v-for="item in pics"
        :key="item.id"
        style="text-align: center"
      >
        <el-image :src="item.path" style="width: 100%; height: 100%"></el-image>
      </el-carousel-item>
    </el-carousel>
    <div
      style="width: 60%; border: 1px solid #e6e6e6; margin: 10px 0 10px 40px"
    >
      <el-row v-for="aut1 in classList" :key="aut1.natureId">
        <!-- 渲染一级分类 -->
        <el-col :span="3" style="text-align: right">
          <el-tag>{{ aut1.natureName }}</el-tag>
        </el-col>
        <!-- 渲染二级分类 -->
        <el-col :span="21" bdright>
          <el-tag
            v-for="aut2 in aut1.children"
            :key="aut2.subjectId"
            :class="{ act: aut2.subjectName == activeSubjectName }"
            @click="getCompets(aut2.subjectId, aut2.subjectName)"
          >
            {{ aut2.subjectName }}</el-tag
          >
        </el-col>
      </el-row>

      <el-row v-for="aut1 in levels" :key="aut1.name">
        <!-- 渲染一级分类 -->
        <el-col :span="3" style="text-align: right">
          <el-tag>{{ aut1.name }}</el-tag>
        </el-col>
        <!-- 渲染二级分类 -->
        <el-col :span="21" bdright>
          <el-tag
            v-for="aut2 in aut1.children"
            :key="aut2.levelId"
            :class="{ act: aut2.levelName == activeLevel }"
            @click="getCompets2(aut2.levelName)"
          >
            {{ aut2.levelName }}</el-tag
          >
        </el-col>
      </el-row>
    </div>
    <div v-for="item in compets" :key="item.comId">
      <el-card
        style="
          width: 60%;
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
            报名时间 {{ item.comLoginstarttime }} ~ {{ item.comLoginendtime }}
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
              item.signUpText == '报名未开始' ||
              $store.getters.getUser.roleName == '老师' ||
              $store.getters.getUser.roleName == '管理员'
            "
            >{{ item.signUpText }}</el-button
          >
          <h2>距离报名{{ item.statusText }}还有{{ item.remain }}天</h2>
          <span @click="toComInfor(item)"
            >竞赛详情<i class="el-icon-arrow-right"></i
          ></span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Competition",
  data() {
    return {
      pics: [
        {
          path: "https://publicqn.saikr.com/2023/03/24/contest641d6c4d3196f7.848381221679649873731.png?imageView2/2/w/1080",
          id: "1",
        },
        {
          path: "https://publicqn.saikr.com/2023/04/03/contest642a9f8573b037.630061001680514981170.png?imageView2/2/w/1080",
          id: "2",
        },
        {
          path: "https://publicqn.saikr.com/2023/02/03/contest63dc75d9e66901.304693181675393439551.png?imageView2/2/w/1080",
          id: "3",
        },
        {
          path: "https://publicqn.saikr.com/2023/04/12/contest64366057734cc7.485133281681285248785.png?imageView2/2/w/1080",
          id: "4",
        },
      ],
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
      compets: [
        {
          comId: "1",
          state: "正在报名",
          comName: "第一届比赛",
          hostName: "主办方1",
          loginStart: "开始时间1",
          loginEnd: "结束时间1",
        },
        {
          comId: "2",
          state: "已经结束",
          comName: "第二届比赛",
          hostName: "主办方2",
          loginStart: "开始时间2",
          loginEnd: "结束时间2",
        },
      ],
    };
  },
  created() {
    //获取所有竞赛分类
    this.getClassList();
    //初始化获取所有竞赛数据
    this.getCompets2("全部");
  },
  methods: {
    //判断某一竞赛报名状态

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
        if (comp.remain < 0) {
          comp.remain = -comp.remain;
          comp.statusText = "开始";
        } else {
          comp.statusText = "截止";
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
      console.log("返回信息", res);
      this.compets = res.data;
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
        if (comp.remain < 0) {
          comp.remain = -comp.remain;
          comp.statusText = "开始";
        } else {
          comp.statusText = "截止";
        }
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
      this.$emit("changeInd");
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
      this.$emit("changeInd");
    },
  },
};
</script>

<style scoped>
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
</style>
