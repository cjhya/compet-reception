<template>
  <div>
    <el-carousel height="400px">
      <el-carousel-item
        v-for="item in hotActs"
        :key="item.activityId"
        style="text-align: center"
      >
        <el-image
          :src="item.activityPicture"
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
          <el-row v-for="aut1 in classList" :key="aut1.amId">
            <!-- 渲染一级分类 -->
            <el-col :span="3" style="text-align: right">
              <el-tag style="font-size: 14px; color: #7f8792">{{
                aut1.amName
              }}</el-tag>
            </el-col>
            <!-- 渲染二级分类 -->
            <el-col :span="21" bdright>
              <el-tag
                v-for="aut2 in aut1.children"
                :key="aut2.amId"
                :class="{
                  act:
                    aut2.amId == actIntId ||
                    aut2.amId == actWayId ||
                    aut2.amId == actLevelId,
                }"
                @click="getActs(aut1.amName, aut2.amId, aut2.amName)"
                style="font-size: 14px; color: #666666"
              >
                {{ aut2.amName }}</el-tag
              >
            </el-col>
          </el-row>
        </div>

        <div v-for="item in actList" :key="item.activityId">
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
                {{ item.activityName }}
              </h1>
              <p style="font-size: 14px; color: #aaaaaa">
                主办方 {{ item.activityHost }}
              </p>
              <p style="font-size: 14px; color: #aaaaaa; margin: 2px 0">
                活动分类 {{ item.activityInterest }}
              </p>
              <p style="font-size: 14px; color: #aaaaaa; margin: 2px 0">
                活动地点 {{ item.activityLevel }}
              </p>
              <p style="font-size: 14px; color: #aaaaaa; margin: 2px 0">
                活动方式 {{ item.activityWay }}
              </p>
              <p style="font-size: 14px; color: #aaaaaa; margin: 0">
                活动时间 {{ item.activityDostarttime }} ~
                {{ item.activityDoendtime }}
              </p>
              <p style="font-size: 14px; color: #aaaaaa; margin: 0">
                报名时间 {{ item.activityLoginstarttime }} ~
                {{ item.activityLoginendtime }}
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
                  item.stateInfor == '已报名' ||
                  item.state != '正在报名' ||
                  $store.getters.getUser.roleName == '老师' ||
                  $store.getters.getUser.roleName == '管理员' ||
                  $store.getters.getUser.roleId == undefined
                "
                v-if="item.state == '正在报名'"
                >{{ item.stateInfor }}</el-button
              >
              <p @click="toActInfor(item)" style="color: #666666">
                <el-link :underline="false"
                  >活动详情<i class="el-icon-arrow-right"></i
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
              style="
                color: #31363f;
                font-size: 18px;
                margin: 0 0 0 10px;
                border-left: 4px solid #22bfa7;
                padding-left: 10px;
              "
            >
              热门活动Top10
            </h1>
          </header>
          <div
            v-for="(item, index) in hotActs"
            :key="index"
            class="toplist-item"
            @click="toActInfor(item)"
          >
            <i class="t-i-number" style="margin: 0 2px 0 0; font-size: 14px">{{
              index + 1
            }}</i>
            <div class="t-i-tilte">
              <span style="font-size: 12px; color: #31363f">{{
                item.activityName
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="toplist"
          style="border: 1px solid #e6e6e6; margin-top: 20px; width: 80%"
        >
          <header class="t-header">
            <h1
              class="t-h-name"
              style="
                color: #31363f;
                font-size: 18px;
                margin: 0 0 0 10px;
                border-left: 4px solid #22bfa7;
                padding-left: 10px;
              "
            >
              最新活动Top10
            </h1>
          </header>
          <div
            v-for="(item, index) in newActs"
            :key="index"
            class="toplist-item"
            @click="toActInfor(item)"
          >
            <i class="t-i-number" style="margin: 0 2px 0 0; font-size: 14px">{{
              index + 1
            }}</i>
            <div class="t-i-tilte">
              <span style="font-size: 12px; color: #31363f">{{
                item.activityName
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
  name: "Activity",
  data() {
    return {
      classList: [],
      //激活选项
      actInt: "不限",
      actIntId: "1002",
      actWay: "不限",
      actWayId: "1000",
      actLevel: "不限",
      actLevelId: "1001",
      //活动列表
      actList: [],
      //最新活动
      newActs: [],
      hotActs: [],
      signActs: [],
    };
  },
  created() {
    if (this.$store.getters.getUser.userId != undefined) {
      this.getSignActs();
    } else {
      this.getCurAct();
    }
    this.getAllClass();
    this.getAllNewActs();
    this.getAllActHot();
  },
  methods: {
    async getSignActs() {
      const { data: res } = await this.$http.get(
        "activity/getmyparticipantactivity?userId=" +
          this.$store.getters.getUser.userId
      );
      this.signActs = res.data;
      console.log("我报名得活动", this.signActs);
      this.getCurAct();
    },
    async getAllActHot() {
      const { data: res } = await this.$http.get("activity/gethotactivity");
      this.hotActs = res.data;
      this.hotActs = this.hotActs.slice(0, 10);
      console.log("查看热门活动返回信息", res);
    },
    async getAllNewActs() {
      const { data: res } = await this.$http.get("activity/getnewactivity");
      console.log("最新活动返回信息", res);
      this.newActs = res.data;
      this.newActs = this.newActs.slice(0, 10);
    },
    async signUp(act) {
      var turnPage = document.createElement("a");
      turnPage.setAttribute("href", act.activityLink);
      turnPage.setAttribute("target", "_blank");
      turnPage.click();
      const { data: res } = await this.$http.post(
        "activity/addactivityrecord",
        {
          userId: this.$store.getters.getUser.userId,
          activityId: act.activityId,
        }
      );
      console.log("报名返回信息", res);
      this.getSignActs();
    },
    toActInfor(act) {
      this.$store.dispatch("asyncUpdateActivity", act);
      this.$router.push("/actInfor");
      this.$emit("changeInd");
    },
    async getCurAct() {
      const { data: res } = await this.$http.get(
        "activity/getactivity?way=" +
          (this.actWay == "不限" ? "" : this.actWay) +
          "&level=" +
          (this.actLevel == "不限" ? "" : this.actLevel) +
          "&interest=" +
          (this.actInt == "不限" ? "" : this.actInt) +
          "&query="
      );
      console.log("当前活动信息", res);
      this.actList = res.data;
      this.judgeState();
    },
    async judgeState() {
      for (let item of this.actList) {
        item.stateInfor = item.state;
        for (let signAct of this.signActs) {
          if (item.activityId == signAct.activityId) {
            if (item.state == "正在报名") {
              item.stateInfor = "已报名";
            }
            break;
          }
        }
      }
    },
    getActs(a1Name, a2Id, a2Name) {
      if (a1Name == "方式") {
        this.actWay = a2Name;
        this.actWayId = a2Id;
      } else if (a1Name == "地点") {
        this.actLevel = a2Name;
        this.actLevelId = a2Id;
      } else if (a1Name == "分类") {
        this.actInt = a2Name;
        this.actIntId = a2Id;
      }
      this.getCurAct();
    },
    async getAllClass() {
      const { data: res } = await this.$http.get("activity/getactivitymanage");
      this.classList = res.data;
      let idInd = 1000;
      for (let i of this.classList) {
        i.children.unshift({
          amId: idInd++,
          amName: "不限",
          children: "",
        });
      }
      console.log("分类列表", this.classList);
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
  background: #e7fffb !important;
  color: #22bfa7 !important;
  border-radius: 2px !important;
  font-weight: 300 !important;
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
