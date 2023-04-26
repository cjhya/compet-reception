<template>
  <div style="margin: 10px 40px">
    <h1>
      {{ $store.getters.getCompetition.comName
      }}{{ $store.getters.getCompetition.absComName }}
    </h1>
    <el-row type="flex" justify="space-between">
      <el-col :span="4">
        <h2>报名</h2>
      </el-col>
      <el-col :span="20">
        <el-steps :active="active" finish-status="success">
          <el-step title="个人信息确定"></el-step>
          <el-step title="团队信息填写"></el-step>
          <el-step title="确认信息"></el-step>
          <el-step title="进行缴费"></el-step>
          <el-step title="报名成功"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-form :model="personInforForm" label-width="80px" v-show="active == 0">
      <el-form-item label="姓名">
        <el-input v-model="personInforForm.name"></el-input>
      </el-form-item>
      <el-form-item label="学校">
        <el-input v-model="personInforForm.school"></el-input>
      </el-form-item>
      <el-form-item label="学院">
        <el-input v-model="personInforForm.department"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="personInforForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="personInforForm.email"></el-input>
      </el-form-item>
      <div style="float: right">
        <el-button @click="active++">下一步</el-button>
      </div>
    </el-form>

    <el-form :model="teamInforForm" label-width="80px" v-show="active == 1">
      <el-form-item label="团队名称">
        <el-input v-model="teamInforForm.name"></el-input>
      </el-form-item>
      <el-form-item label="指导老师">
        <el-input v-model="teamInforForm.school"></el-input>
      </el-form-item>
      <el-form-item label="队员">
        <el-input v-model="teamInforForm.department"></el-input>
      </el-form-item>
      <div style="float: right">
        <el-button @click="active--">返回上一步</el-button>
        <el-button @click="active++">下一步</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "TeamSignUp",
  data() {
    return {
      active: 0,
      personInforForm: {
        name: "程家豪",
        school: "重庆交通大学",
        department: "信息科学与工程学院",
        phone: "18182317524",
        email: "1365135968@qq.com",
      },
      teamInforForm: {
        name: "",
      },
    };
  },
};
</script>

<style></style>
