<template>
  <div style="width: 60%; margin: 10px auto">
    <el-card>
      <div slot="header">
        <span style="border-left: 4px solid #22bfa7; padding-left: 10px"
          >发布活动</span
        >
      </div>
      <el-form
        :model="actForm"
        label-width="100px"
        style="margin: 10px auto; width: 500px"
      >
        <el-form-item label="上传图片">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
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
        <el-form-item label="活动名称">
          <el-input v-model="actForm.activityName"></el-input
        ></el-form-item>
        <el-form-item label="活动简介">
          <Editor ref="actInforEditor" />
        </el-form-item>
        <el-form-item label="主办方">
          <el-input v-model="actForm.activityHost"></el-input
        ></el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="actForm.activityPhone"></el-input
        ></el-form-item>
        <el-form-item label="QQ群">
          <el-input v-model="actForm.activityGroup"></el-input
        ></el-form-item>
        <el-form-item label="级别">
          <el-select v-model="actForm.activityLevel" placeholder="请选择">
            <el-option
              v-for="item in levels"
              :key="item.way"
              :label="item.way"
              :value="item.way"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="actForm.activityLink"></el-input
        ></el-form-item>
        <el-form-item label="方式">
          <el-select v-model="actForm.activityWay" placeholder="请选择">
            <el-option
              v-for="item in ways"
              :key="item.way"
              :label="item.way"
              :value="item.way"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="actForm.activityInterest" placeholder="请选择">
            <el-option
              v-for="item in ints"
              :key="item.amId"
              :label="item.amName"
              :value="item.amName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报名开始时间">
          <el-date-picker
            v-model="actForm.activityLoginstarttime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名结束时间">
          <el-date-picker
            v-model="actForm.activityLoginendtime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动开始时间">
          <el-date-picker
            v-model="actForm.activityDostarttime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间">
          <el-date-picker
            v-model="actForm.activityDoendtime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所有名额">
          <el-input v-model="actForm.allnumber"></el-input
        ></el-form-item>
      </el-form>
      <div style="float: right; margin: 0 20px 20px 0">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="postAct">发表</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Editor from "../../components/Editor.vue";
export default {
  name: "PostCompetition",
  components: { Editor },
  data() {
    return {
      ways: [{ way: "线上" }, { way: "线下" }],
      levels: [{ way: "校内" }, { way: "校外" }],
      ints: [],
      avaFile: "",
      imageUrl: "",
      actForm: {
        activityName: "",
        activityIntro: "",
        activityHost: "",
        activityPhone: "",
        activityGroup: "",
        activityLevel: "",
        activityLink: "",
        activityWay: "",
        activityInterest: "",
        activityTeacherId: "",
        activityLoginstarttime: "",
        activityLoginendtime: "",
        activityDostarttime: "",
        activityDoendtime: "",
        allnumber: "",
      },
    };
  },
  created() {
    this.actForm.activityTeacherId = this.$store.getters.getUser.userId;
    this.getAllInts();
  },
  methods: {
    async getAllInts() {
      const { data: res } = await this.$http.get("activity/getactivitymanage");
      console.log("所有分类返回信息",res)
      for (let i of res.data) {
        if (i.amName == "分类") {
          this.ints = i.children;
        }
      }
      console.log("分类表格",this.ints)
    },
    httpRequest(param) {
      this.avaFile = param.file;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    async postAct() {
      this.$refs.uploadPic.submit();
      let fd = new FormData();
      this.actForm.activityIntro = this.$refs.actInforEditor.html;
      // 将data转换为form-data
      for (let i in this.actForm) {
        fd.append(i, this.actForm[i]);
      }
      fd.append("activityPicture", this.avaFile);
      const { data: res } = await this.$http.post("activity/addactivity", fd);
      console.log("发布竞赛返回信息", res);
      this.$router.push("/activity");
      this.$emit("changeIndex", "/activity");
    },
    cancel() {
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
