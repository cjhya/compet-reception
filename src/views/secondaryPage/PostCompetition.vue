<template>
  <div style="width: 60%; margin: 10px auto">
    <el-card>
      <div slot="header">
        <span>发布竞赛</span>
      </div>
      <el-form
        :model="competForm"
        label-width="100px"
        style="margin: 10px auto; width: 500px"
      >
        <el-form-item label="上传图片">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :http-request="httpRequest"
            ref="uploadPic"
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
        <el-form-item label="竞赛大类">
          <el-select v-model="competForm.absComId" placeholder="请选择">
            <el-option
              v-for="item in absComs"
              :key="item.absComId"
              :label="item.absComName"
              :value="item.absComId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="竞赛名称">
          <el-input v-model="competForm.comName"></el-input
        ></el-form-item>
        <el-form-item label="竞赛类型">
          <el-select v-model="competForm.comType" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.type"
              :label="item.type"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报名开始时间">
          <el-date-picker
            v-model="competForm.comLoginstarttime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名结束时间">
          <el-date-picker
            v-model="competForm.comLoginendtime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="比赛开始时间">
          <el-date-picker
            v-model="competForm.comDostarttime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="比赛结束时间">
          <el-date-picker
            v-model="competForm.comDoendtime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div style="float: right; margin: 0 20px 20px 0">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="postCom">发表</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "PostCompetition",
  data() {
    return {
      types: [{ type: "个人赛" }, { type: "团队赛" }],
      //可供选择的抽象竞赛
      absComs: [],
      avaFile: "",
      imageUrl: "",
      competForm: {
        absComId: "",
        comName: "",
        comType: "",
        comLoginstarttime: "",
        comLoginendtime: "",
        comDostarttime: "",
        comDoendtime: "",
        comTeacher: "",
      },
    };
  },
  created() {
    this.getAllAbsComs();
    this.competForm.comTeacher = this.$store.getters.getUser.userId;
  },
  methods: {
    httpRequest(param) {
      this.avaFile = param.file;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    async postCom() {
      this.$refs.uploadPic.submit();
      let fd = new FormData();
      // 将data转换为form-data
      for (let i in this.competForm) {
        fd.append(i, this.competForm[i]);
      }
      fd.append("headpicture", this.avaFile);
      console.log("参数1",this.competForm,this.avaFile)
      console.log("发布竞赛参数", fd);
      const { data: res } = await this.$http.post(
        "competition/addcompetition",
        fd
      );
      console.log("发布竞赛返回信息", res);
      this.$router.push("/competition");
      this.$emit("changeIndex", "/competition");
    },
    async getAllAbsComs() {
      const { data: res } = await this.$http.get(
        "competition/getcompetitionmeta"
      );
      this.absComs = res.data;
    },
    cancel() {
      this.competForm = {
        absComId: "",
        comName: "",
        comType: "",
        comLoginstarttime: "",
        comLoginendtime: "",
        comDostarttime: "",
        comDoendtime: "",
        comTeacher: this.$store.getters.getUser.userId,
      };
      this.$router.push("/frontPage");
      this.$emit("changeIndex", "/frontPage");
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
