<template>
  <div style="margin: 10px 40px">
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
            <el-step title="团队信息填写"></el-step>
            <el-step title="团队情况查看"></el-step>
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
          <el-button @click="active++">下一步</el-button>
        </div>
      </el-form>

      <el-form
        :model="teamInforForm"
        label-width="80px"
        v-show="active == 1"
        style="width: 60%; margin: 0 auto"
      >
        <el-form-item label="团队名称">
          <el-input v-model="teamInforForm.name"></el-input>
        </el-form-item>
        <el-form-item label="指导老师">
          <el-select
            v-model="teamInforForm.instrArray"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in teachers"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="队员">
          <el-select
            v-model="teamInforForm.stuArray"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in stus"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div style="float: right; margin-bottom: 10px">
          <el-button @click="active--">返回上一步</el-button>
          <el-button @click="sendInvitation">发送邀请</el-button>
        </div>
      </el-form>

      <div v-show="active == 2">
        <div style="width: 60%; margin: 0 auto">
          <div>
            <el-descriptions title="指导老师">
              <el-descriptions-item
                :label="item.userName"
                v-for="item in teaReceiveState"
                :key="item.userName"
                >{{ item.state }}</el-descriptions-item
              >
            </el-descriptions>
            <el-descriptions title="同组成员">
              <el-descriptions-item
                :label="item.userName"
                v-for="item in stuReceiveState"
                :key="item.userName"
                >{{ item.state }}</el-descriptions-item
              >
            </el-descriptions>
          </div>

          <div style="float: right; margin: 10px 0">
            <el-button @click="active--">返回上一步</el-button>
            <el-button @click="active++" :disabled="teamState=='组队接受中'">下一步</el-button>
          </div>
        </div>
      </div>

      <div v-show="active == 3">
        <div style="width: 60%; margin: 0 auto">
          <div>
            <h2>你需缴费XX元，是否</h2>
            <el-link
              href="https://4wr6987968.yicp.fun/paymoney/dingdan"
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

      <div v-show="active == 4" style="width: 60%; margin: 0 auto">
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
  name: "TeamSignUp",
  data() {
    return {
      active: 0,
      personInforForm: {},
      teamInforForm: {
        name: "",
        instrArray: [],
        stuArray: [],
      },
      teachers: [],
      stus: [],
      joinComs: [],
      teaReceiveState: [],
      stuReceiveState: [],
      teamState: "",
    };
  },
  created() {
    this.getMyJoinComs();
    this.getPersonalInfor();
    this.getAllTeachers();
    this.getAllStus();
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
      this.judgeComStatus();
    },
    //判断比赛状态
    async judgeComStatus() {
      console.log("参加的比赛", this.joinComs);
      for (let com of this.joinComs) {
        console.log("参赛记录", com);
        if (com.comId == this.$store.getters.getCompetition.comId) {
          this.active = 2;
          const { data: res } = await this.$http.get(
            "process/getreceivestate?recordId=" + com.recordId
          );
          console.log("团队接受邀请情况返回信息", res);
          this.teaReceiveState = res.teacher;
          this.stuReceiveState = res.student;
          this.teamState = res.state;
          return;
        }
      }
      this.active = 0;
    },
    //发送邀请
    async sendInvitation() {
      const { data: res } = await this.$http.post("process/signup", {
        comId: this.$store.getters.getCompetition.comId,
        fromuser: this.$store.getters.getUser.name,
        teamName: this.teamInforForm.name,
        inviteinstr: this.teamInforForm.instrArray,
        invitestu: this.teamInforForm.stuArray,
      });
      this.active++;
      console.log("发送团队邀请后返回信息", res);
    },
    toFrontPage() {
      this.$router.push("/frontPage");
      this.$emit("changeInd", "/frontPage");
    },
    getPersonalInfor() {
      this.personInforForm = this.$store.getters.getUser;
      console.log("个人信息表单", this.personInforForm);
    },
    //获取所有老师
    async getAllTeachers() {
      const { data: res } = await this.$http.get("user/getteacher");
      this.teachers = res.data;
      console.log("所有老师", this.teachers);
      console.log("个人信息", this.$store.getters.getUser);
    },
    //获取所有学生
    async getAllStus() {
      const { data: res } = await this.$http.get("user/getstudent");
      this.stus = res.data;
      console.log("没删除前所有学生", res.data);
      for (let i = 0; i < this.stus.length; i++) {
        if (this.stus[i].stuId == this.$store.getters.getUser.userId) {
          this.stus.splice(i, 1);
          break;
        }
      }
      console.log("删除后所有学生", this.stus);
    },
  },
};
</script>

<style></style>
