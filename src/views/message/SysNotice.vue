<template>
  <div>
    <!-- <div v-if="notices.length == 0">123</div> -->
    <div class="showIcon" v-if="notices.length == 0">
      <img
        class="icon-snapchat"
        src="//s1.hdslb.com/bfs/static/blive/blfe-message-web/static/img/placeholder.6b466963.png"
        alt=""
      />
    </div>
    <div v-for="item in notices" :key="item.notificationId" v-else>
      <el-card style="padding: 10px 20px; margin: 10px 0">
        <div>
          <h1 style="font-size: 12px; color: #333333">
            {{ item.fromuser
            }}<span style="font-size: 12px; color: #999999">
              {{ item.sendtime }}</span
            >
          </h1>
          <p style="font-size: 12px; color: #666666; margin: 0px 15px">
            {{ item.notificationText }}
          </p>
        </div>
        <div style="float: right" v-if="item.state == '了解详情'">
          <el-link
            type="primary"
            @click.native="toNoticeInfor(item)"
            style="font-size: 12px"
            >了解详情</el-link
          >
        </div>
        <div style="float: right" v-if="item.state == '待接受'">
          <el-button @click="accept(item.notificationId)" size="mini"
            >接收</el-button
          >
          <el-button @click="reject(item.notificationId)" size="mini"
            >拒绝</el-button
          >
        </div>
        <div style="float: right" v-if="item.state == '已接受'">
          <el-button disabled size="mini">已接受</el-button>
        </div>
        <div style="float: right" v-if="item.state == '已拒绝'">
          <el-button disabled size="mini">已拒绝</el-button>
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
      showPic: false,
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
      this.getAllNotice();
    },
    async reject(id) {
      const { data: res } = await this.$http.post("process/receiveinvite", {
        notificationId: id,
        choice: "拒绝邀请",
      });
      this.getAllNotice();
    },
    async getConNoticeInfor() {
      for (let mes of this.notices) {
        if (mes.state == "了解详情") {
          const { data: res } = await this.$http.get(
            "process/knowdetail?notificationId=" + mes.notificationId
          );
          mes.conInfor = res.data;
        }
      }
    },
    async getAllNotice() {
      const { data: res } = await this.$http.get(
        "process/getnotificationlist?userId=" +
          this.$store.getters.getUser.userId
      );
      this.notices = res.data;
      console.log("公告信息", this.notices);
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

<style lang="scss" scoped>
.showIcon {
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  .icon-snapchat {
    width: 500px;
    height: 500px;
    font-size: 500px;
  }
}
</style>
