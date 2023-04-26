<template>
  <div>
    <el-row style="margin: 0 40px;position:relative">
      <el-col
        :span="4"
        style="
          position: fixed;
          text-align: center;
          border: 1px solid #e6e6e6;
          height: 100%;
        "
      >
        <div style="width: 100%; height: 50px; line-height: 50px">
          <i class="el-icon-s-promotion"></i>
          消息中心
        </div>
        <div style="width: 100%; height: 50px; line-height: 50px" @click="toSysNotice">
          <i class="el-icon-star-on"></i>
          系统通知
        </div>
        <div style="width: 100%; height: 50px; line-height: 50px" @click="toMyMessage">
          <i class="el-icon-star-on"></i>
          我的消息
        </div>
      </el-col>
      <el-col :span="18" :offset="6">
        <h1>{{title}}</h1>
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default{
    name:"Infor",
    data(){
      return{
        title:"系统通知"
      }
    },
    methods:{
      toSysNotice(){
        this.title="系统通知"
        this.$router.push("/sysNotice")
      },
      toMyMessage(){
        this.title="我的消息"
        this.$router.push("/myMessage")
      }
    }
}
</script>

<style></style>