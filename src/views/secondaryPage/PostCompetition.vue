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
      <div style="float: right;margin:0 20px 20px 0">
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
    async postCom() {
      console.log("具体竞赛表单", this.competForm);
      const { data: res } = await this.$http.post(
        "competition/addcompetition",
        this.competForm
      );
      console.log("添加竞赛返回信息", res);
      this.$router.push("/competition");
      this.$emit("changeIndex", "/competition");
    },
    async getAllAbsComs() {
      const { data: res } = await this.$http.get(
        "competition/getcompetitionmeta"
      );
      this.absComs = res.data;
      console.log("获取的抽象竞赛列表", this.absComs);
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

<style></style>
