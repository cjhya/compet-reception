<template>
  <div style="width: 80%; margin: 10px auto">
    <el-form :model="articleForm" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="articleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="文章内容">
        <Editor ref="contentEditor" />
      </el-form-item>
    </el-form>
    <div style="float: right">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="postArt">发表</el-button>
    </div>
  </div>
</template>

<script>
import Editor from "../../components/Editor.vue";
export default {
  name: "PostArticle",
  components: { Editor },
  data() {
    return {
      articleForm: {
        name: "",
      },
    };
  },
  methods: {
    cancel() {
      this.articleForm = { name: "" };
      this.$refs.contentEditor.html = "";
      this.$router.push("/frontPage");
      this.$emit("changeIndex", "/frontPage");
    },
    async postArt() {
      const { data: res } = await this.$http.post("forum/addarticle", {
        artName: this.articleForm.name,
        artContent: this.$refs.contentEditor.html,
        userId: this.$store.getters.getUser.userId,
      });
      console.log("发表文章参数", {
        artName: this.articleForm.name,
        artContent: this.$refs.contentEditor.html,
        userId: this.$store.getters.getUser.userId,
      });
      console.log("发表文章返回信息", res);
      this.$router.push("/forum");
      this.$emit("changeIndex", "/forum");
    },
  },
};
</script>

<style></style>
