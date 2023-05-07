<template>
  <div style="margin: 10px 200px">
    <el-card>
      <div slot="header">
        <span>{{ $store.getters.getCompetition.comName }}</span>
      </div>
      <el-row type="flex" justify="center" style="margin: 10px 40px 0 40px">
        <el-col :span="2">
          <h2>报名</h2>
        </el-col>
        <el-col :span="15">
          <el-steps :active="active" finish-status="success">
            <el-step title="个人信息确定"></el-step>
            <el-step title="进行缴费"></el-step>
            <el-step title="报名成功"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-form
        :model="personInforForm"
        label-width="80px"
        v-show="active == 0"
        style="width: 60%; margin: 0 auto"
      >
        <el-form-item label="姓名">
          <el-input v-model="personInforForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学校">
          <el-input v-model="personInforForm.college"></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <el-input v-model="personInforForm.school"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="personInforForm.phone"></el-input>
        </el-form-item>
        <div style="float: right; margin-bottom: 10px">
          <el-button @click="compSignUp">下一步</el-button>
        </div>
      </el-form>

      <div v-show="active == 1">
        <div style="width: 60%; margin: 0 auto">
          <div>
            <h2>你需缴费XX元，是否</h2>
            <el-link
              :href="
                'https://4wr6987968.yicp.fun/paymoney/dingdan?recordId' +
                recordId
              "
              target="_blank"
              type="primary"
              style="font-size: 24px"
              >前去缴费</el-link
            >
          </div>

          <div style="float: right; margin: 10px 0">
            <el-button @click="active--">返回上一步</el-button>
            <el-button @click="active++">下一步</el-button>
          </div>
        </div>
      </div>

      <div v-show="active == 2" style="width: 60%; margin: 0 auto">
        <h1>报名成功，请关注后续通知</h1>
        <el-button @click="toFrontPage" style="float: right; margin: 10px 0"
          >返回首页</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "PersonalSignUp",
  data() {
    return {
      active: 0,
      personInforForm: {},
      joinComs: [],
      recordId: 8,
    };
  },
  created() {
    this.getPersonalInfor();
    this.getMyJoinComs();
  },
  methods: {
    //获取我参加的竞赛
    async getMyJoinComs() {
      const { data: res } = await this.$http.get(
        "competition/getmyparticipant?userId=" +
          this.$store.getters.getUser.userId
      );
      this.joinComs = res.data;
      this.judgeComStatus();
    },
    //判断比赛状态
    async judgeComStatus() {
      for (let com of this.joinComs) {
        if (com.comId == this.$store.getters.getCompetition.comId) {
          if (com.state == "待支付") {
            this.active = 1;
            return;
          } else {
            this.active = 2;
            return;
          }
        }
      }
      this.active = 0;
    },
    //完成报名
    async compSignUp() {
      const { data: res } = await this.$http.post("competition/addrecord", {
        comId: this.$store.getters.getCompetition.comId,
        captialId: this.personInforForm.userId,
        teamName: "",
        instrArray: "",
        stuArray: "",
      });
      this.active++;
    },
    getPersonalInfor() {
      this.personInforForm = this.$store.getters.getUser;
    },
    toFrontPage() {
      this.$router.push("/frontPage");
      this.$emit("changeInd", "/frontPage");
    },
  },
};
</script>

<style></style>
