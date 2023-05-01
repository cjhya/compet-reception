<template>
  <div style="width: 60%; margin: 30px auto">
    <el-form :model="personInfor" label-width="80px" size="medium">
      <el-form-item label="名字">
        <el-input v-model="personInfor.name"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="personInfor.account"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="personInfor.password"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-tag>{{ personInfor.roleName }}</el-tag>
      </el-form-item>
      <el-form-item label="是否评委">
        <el-tag v-if="personInfor.roleName === '老师'">{{
          personInfor.isjudge
        }}</el-tag>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="personInfor.sex"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="personInfor.age"></el-input>
      </el-form-item>
      <el-form-item label="学校">
        <el-input v-model="personInfor.college"></el-input>
      </el-form-item>
      <el-form-item label="学院">
        <el-input v-model="personInfor.school"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="personInfor.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editInfor">修改信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "PersonInfor",
  data() {
    return {
      personInfor: {},
    };
  },
  created() {
    this.personInfor = this.$store.getters.getUser;
  },
  methods: {
    async editInfor() {
      const { data: res } = await this.$http.post("user/updateuser", {
        userid: this.personInfor.userId,
        roleId: this.personInfor.roleId,
        userName: this.personInfor.name,
        userAccount: this.personInfor.account,
        userPassword: this.personInfor.password,
        userSex: this.personInfor.sex,
        userAge: this.personInfor.age,
        userPhone: this.personInfor.phone,
      });
      console.log("修改信息返回信息",res)
    },
  },
};
</script>

<style></style>
