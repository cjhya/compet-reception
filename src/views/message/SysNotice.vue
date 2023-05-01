<template>
  <div>
    <div v-for="item in notices" :key="item.notificationId">
      <el-card style="padding: 10px 20px; margin: 10px 0">
        <div>
          <h1>{{ item.fromuser }}</h1>
          <p>{{ item.notificationText }}</p>
          <p>{{ item.sendtime }}</p>
        </div>
        <div style="float: right" v-if="item.state == '了解详情'">
          <el-link type="primary" @click.native="toNoticeInfor(item)"
            >了解详情</el-link
          >
        </div>
        <div style="float: right" v-if="item.state == '待接受'">
          <el-button @click="accept(item.notificationId)">接收</el-button>
          <el-button @click="reject(item.notificationId)">拒绝</el-button>
        </div>
        <div style="float: right" v-if="item.state == '已接受'">
          <el-button disabled>已接受</el-button>
        </div>
        <div style="float: right" v-if="item.state == '已拒绝'">
          <el-button disabled>已拒绝</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysNotice",
  data() {
    return {
      notices: [],
    };
  },
  created() {
    this.getAllNotice();
  },
  methods: {
    async accept(id) {
      const { data: res } = await this.$http.post("process/receiveinvite", {
        notificationId: id,
        choice: "接受邀请",
      });
      console.log("接受邀请返回信息", res);
      this.getAllNotice();
    },
    async reject(id) {
      const { data: res } = await this.$http.post("process/receiveinvite", {
        notificationId: id,
        choice: "拒绝邀请",
      });
      console.log("拒绝邀请返回信息", res);
      this.getAllNotice();
    },
    async getConNoticeInfor() {
      console.log("获取公告", this.notices);
      for (let mes of this.notices) {
        if (mes.state == "了解详情") {
          console.log("返回前", mes);
          const { data: res } = await this.$http.get(
            "process/knowdetail?notificationId=" + mes.notificationId
          );
          mes.conInfor = res.data;
          console.log("返回后", mes);
        }
      }
    },
    async getAllNotice() {
      const { data: res } = await this.$http.get(
        "process/getnotificationlist?userId=" +
          this.$store.getters.getUser.userId
      );
      this.notices = res.data;
      console.log("获取所有系统通知", this.notices);
      this.getConNoticeInfor();
    },
    // 具体公告
    async toNoticeInfor(item) {
      this.$store.dispatch("asyncUpdateNote", item.conInfor);
      this.$router.push("/comConAnn");
    },
  },
};
</script>

<style></style>
