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
            <h1 style="font-size: 20px">
              你需缴费<span>{{ money }}</span
              >元
              <el-link
                :href="
                  'https://4wr6987968.yicp.fun/paymoney/dingdan?recordId=' +
                  recordId +
                  '&money=' +
                  money +
                  '&comName=' +
                  comName
                "
                target="_blank"
                type="primary"
                style="font-size: 20px"
                @click.native="initMesSocket"
                v-if="money!=0"
                >，前去缴费</el-link
              >
            </h1>
            <p style="font-size: 14px; color: #aaaaaa" v-if="money!=0">
              支付状态
              <span style="font-size: 14px; color: #22bfa7">{{
                payStateText
              }}</span>
            </p>
          </div>

          <div style="float: right; margin: 10px 0">
            <el-button @click="active++" :disabled="payStateText == '待支付' && money != 0"
              >下一步</el-button
            >
          </div>
        </div>
      </div>

      <div v-show="active == 2" style="width: 60%; margin: 0 auto">
        <el-result
          icon="success"
          title="缴费成功"
          subTitle="请根据提示进行操作"
        >
          <template slot="extra">
            <el-button type="primary" size="medium" @click="toFrontPage"
              >返回首页</el-button
            >
          </template>
        </el-result>
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
      recordId: "",
      mesSocket: null,
      payStateText: "待支付",
      money: "",
      comName: "",
    };
  },
  created() {
    this.getPersonalInfor();
    this.getMyJoinComs();
  },
  methods: {
    initMesSocket() {
      this.mesSocket = new WebSocket("wss://4wr6987968.yicp.fun/ws/money/");
      this.mesSocket.onmessage = this.mesSocketMessage;
    },
    mesSocketMessage(msg) {
      const arr = JSON.parse(msg.data).res1.data;
      for (let pay of arr) {
        if (pay.recordId == this.recordId && pay.ispay == "是") {
          this.payStateText = "支付完成";
          this.mesSocket.close();
        }
      }
    },
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
          this.recordId = com.recordId;
          this.money = com.money;
          this.comName = com.comName;
          console.log("支付状态", this.recordId, this.money, this.comName);
          console.log("记录Id", this.recordId);
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
      console.log("报名返回信息", res);
      this.recordId = res.recordId;
      this.money = res.money;
      this.comName = res.comName;
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
