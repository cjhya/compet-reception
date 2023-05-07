<template>
  <div>
    <el-row style="margin: 0 40px; position: relative">
      <el-col
        :span="2"
        :offset="1"
        style="
          position: fixed;
          text-align: center;
          border: 1px solid #e6e6e6;
          height: 100%;
          font-size:14px
        "
      >
        <div
          style="width: 100%; height: 40px; line-height: 40px"
          @click="toSysNotice"
        >
          <i class="el-icon-star-on"></i>
          系统通知
        </div>
        <div
          style="width: 100%; height: 40px; line-height: 40px"
          @click="toMyMessage"
        >
          <i class="el-icon-star-on"></i>
          我的消息
        </div>
      </el-col>
      <el-col :span="19" :offset="4">
        <h1 style="font-size:15px;color:#666666">{{ title }}</h1>
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Infor",
  data() {
    return {
      // activeIndex:"/sysNotice",
      title: "系统通知",
    };
  },
  methods: {
    toSysNotice() {
      this.title = "系统通知";
      this.$router.push("/sysNotice");
    },
    toMyMessage() {
      this.title = "我的消息";
      this.$router.push("/myMessage");
    },
  },
};
</script>

<style></style>
