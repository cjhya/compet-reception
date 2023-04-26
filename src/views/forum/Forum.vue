<template>
  <div style="width: 60%; margin: 10px auto">
    <div
      v-for="item in arts"
      :key="item.artId"
      style="border: solid 1px #e6e6e6; padding: 0 20px; margin: 20px 0"
    >
      <h1 @click="toConArt(item)">{{ item.artName }}</h1>
      <span v-html="$options.filters.setContent(item.artContent)"></span>
      <p>{{ item.artPosttime }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Forum",
  data() {
    return {
      arts: [],
    };
  },
  created() {
    this.getAllArt();
  },
  methods: {
    async getAllArt() {
      const { data: res } = await this.$http.get("forum/getarticle");
      this.arts = res.data;
      console.log("所有文章信息", this.arts);
    },
    toConArt(article) {
      this.$store.dispatch("asyncUpdateArticle", article);
      this.$router.push("/conArticle");
      this.$emit("changeInd")
    },
  },
  filters: {
    //当渲染的文字超出一定字节后显示省略号
    setContent(value) {
      if (!value) return "";
      if (value.length > 80) {
        return value.slice(0, 80) + "...";
      }
      return value;
    },
  },
};
</script>

<style>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
