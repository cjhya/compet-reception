<template>
  <div style="margin: 0 40px">
    <el-row>
      <el-col :span="18"
        ><h1>{{ competition.comName }}{{ competition.absComName }}</h1>
        <h2>竞赛信息</h2>
        <p>{{ competition.absComIntroduction }}</p>
        <h2>主办单位</h2>
        <span>{{ competition.absComHost }}</span>
        <h2>联系方式</h2>
        <p>电子邮箱{{ competition.absComEmail }}</p>
        <p>电话号码{{ competition.absComPhone }}</p></el-col
      >
      <el-col :span="6"
        ><h3>发布者</h3>
        <p>{{ competition.absComHost }}</p>
        <h3>类型 {{ competition.comType }}</h3>
        <h3>主办方</h3>
        <p>{{ competition.absComHost }}</p>
        <h3>报名时间 距离报名截止还有{{competition.remain}}天</h3>
        <p>{{ competition.comLoginstarttime }} 至 {{competition.comLoginendtime}}</p>
        <h3>比赛时间 尚未开始</h3>
        <p>{{ competition.comDostarttime }} 至 {{competition.comDoendtime}}</p>
        <h3>竞赛类别</h3>
        <p>数学建模</p></el-col
      >
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ComConInfor",
  data() {
    return {
      competition: {},
    };
  },
  created() {
    this.competition = this.$store.getters.getCompetition;
  },
};
</script>

<style></style>
