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
  </div>
</template>

<script>
export default {
  name: "PersonalSignUp",
  data() {
    return {
      active: 0,
      personInforForm: {},
    };
  },
};
</script>

<style></style>
