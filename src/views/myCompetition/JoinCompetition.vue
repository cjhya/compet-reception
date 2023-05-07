<template>
  <div style="width: 50%; margin: 100px auto">
    <el-form label-width="100px">
      <el-form-item label="参赛文件">
        <el-upload
          id="uploadFile"
          action="#"
          multiple
          :http-request="httpRequest"
          ref="uploadComFile"
          :auto-upload="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div style="float: right">
      <el-button type="primary" @click="submit">完成比赛</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "JoinCompetition",
  data() {
    return {
      subMitForm: {
        file: "",
        recordId: "",
      },
    };
  },
  created() {
    this.subMitForm.recordId = this.$store.getters.getRecord.recordId;
  },
  methods: {
    httpRequest(param) {
      this.subMitForm.file = param.file;
    },
    async submit() {
      this.$refs.uploadComFile.submit();
      let fd = new FormData();
      // 将data转换为form-data
      for (let i in this.subMitForm) {
        fd.append(i, this.subMitForm[i]);
      }

      const { data: res } = await this.$http.post("process/uploadfile", fd);
      console.log("上传文件返回信息", res);
      this.$router.push("/myCompetition");
    },
  },
};
</script>

<style>
#uploadFile {
  margin-bottom: 15px;
}
</style>
