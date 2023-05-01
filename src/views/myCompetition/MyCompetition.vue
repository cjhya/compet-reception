<template>
  <div style="width: 80%; margin: 10px auto">
    <el-card>
      <el-tabs v-model="activeName" style="padding:0 20px">
        <el-tab-pane label="我参加的竞赛" name="join">
          <div v-for="item in joinComs" :key="item.comId">
            <h2>{{ item.comName }}----{{ item.state }}</h2>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我订阅的竞赛" name="subscribe">
          <div v-for="item in subscribeComs" :key="item.subId">
            <h2>{{ item.comName }}----{{ item.state }}</h2>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="我管理的竞赛"
          name="manage"
          v-if="$store.getters.getUser.roleName == '老师'"
        >
          <div v-for="item in manageComs" :key="item.comId">
            <h2>{{ item.comName }}----{{ item.state }}</h2>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "MyCompetition",
  data() {
    return {
      activeName: "subscribe",
      joinComs: [],
      subscribeComs: [],
      manageComs: [],
    };
  },
  created() {
    this.getMyJoinComs();
    this.getMySubscribeComs();
    this.getMyManageComs();
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
    },
    //获取我订阅的竞赛
    async getMySubscribeComs() {
      const { data: res } = await this.$http.get(
        "note/getsub?userId=" + this.$store.getters.getUser.userId
      );
      this.subscribeComs = res.data;
      console.log("我订阅的竞赛", this.subscribeComs);
    },
    //获取我管理的竞赛
    async getMyManageComs() {
      const { data: res } = await this.$http.get(
        "competition/getmymanage?userId=" + this.$store.getters.getUser.userId
      );
      this.manageComs = res.data;
      console.log("我管理的竞赛", this.manageComs);
    },
  },
};
</script>

<style></style>
