<template>
  <div style="width: 60%; margin: 10px auto">
    <el-card>
      <div slot="header">
        <span style="border-left: 4px solid #22bfa7; padding-left: 10px"
          >发布竞赛大类</span
        >
      </div>
      <!-- 内容主体区域 -->
      <el-form
        :model="addAbsComForm"
        label-width="100px"
        style="margin: 10px auto; width: 500px"
      >
        <el-form-item label="竞赛名称">
          <el-input v-model="addAbsComForm.absComName"></el-input>
        </el-form-item>
        <el-form-item label="竞赛简介">
          <Editor ref="absComEditor" />
        </el-form-item>
        <el-form-item label="主办方">
          <el-input v-model="addAbsComForm.absComHost"></el-input>
        </el-form-item>
        <el-form-item label="竞赛级别">
          <el-select
            v-model="addAbsComForm.absComLevel"
            placeholder="请选择"
            @change="addChangeLevelState"
          >
            <el-option
              v-for="item in levels"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="官网链接">
          <el-input
            v-model="addAbsComForm.absComLink"
            :disabled="addLevelState"
          ></el-input>
        </el-form-item>
        <el-form-item label="学科分类">
          <el-cascader
            v-model="subArray"
            :options="subjectList"
            :props="{
              label: 'subjectName',
              value: 'subjectId',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="addAbsComForm.absComPhone"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="addAbsComForm.absComEmail"></el-input>
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
import Editor from "../../components/Editor.vue";
export default {
  name: "PostAbsCompetition",
  components: { Editor },
  data() {
    return {
      types: [{ type: "个人赛" }, { type: "团队赛" }],
      //可供选择的抽象竞赛
      absComs: [],
      avaFile: "",
      imageUrl: "",
      addAbsComForm: {
        absComName: "",
        absComIntroduction: "",
        absComHost: "",
        absComPhone: "18182317524",
        absComEmail: "1365135968@qq.com",
        absComLevel: "",
        absComsubjectId: "",
        absComLink: "",
      },
      //抽象竞赛级别类型
      levels: [
        { label: "校级", value: "校级" },
        { label: "省级", value: "省级" },
        { label: "国家级", value: "国家级" },
      ],
      //竞赛官网链接状态
      addLevelState: false,
      //可选择的学科列表
      subjectList: [],
      subArray: [],
    };
  },
  created() {
    this.getSubList();
  },
  methods: {
    //取级联选择器最后一个数字
    handleChange(value) {
      this.addAbsComForm.absComsubjectId = value[1];
    },
    //获取可选择的学科列表
    async getSubList() {
      const { data: res } = await this.$http.get("subject/getsubject");
      let dataList = res.data;
      dataList.map((item) => {
        let obj = {
          subjectId: item.natureId,
          subjectName: item.natureName,
          children: item.children,
        };
        this.subjectList.push(obj);
      });
    },
    addChangeLevelState() {
      if (this.addAbsComForm.absComLevel == "校级") {
        this.addAbsComForm.absComLink = "";
        this.addLevelState = true;
      } else {
        this.addLevelState = false;
      }
    },
    async postCom() {
      this.addAbsComForm.absComIntroduction=this.$refs.absComEditor.html
      const { data: res } = await this.$http.post(
        "competition/addcompetitionmeta",
        this.addAbsComForm
      );
      console.log("发布竞赛返回信息", res);
      this.$router.push("/competition");
      this.$emit("changeIndex", "/competition");
    },
    cancel() {
      this.$router.push("/frontPage");
      this.$emit("changeIndex", "/frontPage");
    },
  },
};
</script>

<style></style>
