<template>
  <div style="width: 60%; margin: 30px auto">
    <h1
      style="
        font-size: 15px;
        color: #666666;
        border-left: 4px solid #22bfa7;
        padding-left: 10px;
      "
    >
      个人信息
    </h1>
    <el-form :model="personInfor" label-width="80px" size="medium">
      <el-form-item label="上传头像">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :http-request="httpRequest"
          ref="uploadAva"
          :auto-upload="false"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i
            v-else
            class="el-icon-plus"
            style="
              font-size: 28px;
              color: #8c939d;
              width: 100px;
              height: 100px;
              line-height: 100px;
              text-align: center;
            "
          ></i>
        </el-upload>
      </el-form-item>
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
      <el-form-item label="是否评委" v-if="personInfor.roleName === '老师'">
        <el-tag>{{ personInfor.isjudge }}</el-tag>
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
      <el-form-item label="邮箱">
        <el-input v-model="personInfor.email"></el-input>
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
      avaFile: "",
      imageUrl: "",
      personInfor: {},
    };
  },
  created() {
    this.personInfor = this.$store.getters.getUser;
    console.log("个人信息", this.personInfor);
  },
  methods: {
    httpRequest(param) {
      this.avaFile = param.file;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log("图片路径", this.imageUrl);
    },
    async editInfor() {
      const { data: res } = await this.$http.post("user/updateuser", {
        userId: this.personInfor.userId,
        roleId: this.personInfor.roleId,
        userName: this.personInfor.name,
        userAccount: this.personInfor.account,
        userPassword: this.personInfor.password,
        userSex: this.personInfor.sex,
        userAge: this.personInfor.age,
        userPhone: this.personInfor.phone,
        college: this.personInfor.college,
        school: this.personInfor.school,
        userEmail: this.personInfor.email,
      });
      console.log("修改信息返回信息", res);
      this.uploadAvater();
    },
    async uploadAvater() {
      this.$refs.uploadAva.submit();
      let fd = new FormData();
      fd.append("userId", this.$store.getters.getUser.userId);
      fd.append("headpicture", this.avaFile);

      const { data: res } = await this.$http.post("user/uploadheadpicture", fd);
      console.log("上传头像返回信息", res);
      this.$store.dispatch("asyncUpdateUser", res.data);
      this.$router.push("/frontPage");
      this.$emit("changeInd", "/frontPage");
    },
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
