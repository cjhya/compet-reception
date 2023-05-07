<template>
  <div style="width: 60%; margin: 10px auto">
    <div
      v-for="item in arts"
      :key="item.artId"
      style="border: solid 1px #e6e6e6; padding: 20px; margin: 20px 0"
      @click="toConArt(item)"
    >
      <div style="display: flex">
        <div style="margin-right: 10px">
          <el-avatar :src="item.headpicture"></el-avatar>
        </div>
        <div>
          <div style="font-size: 12px; color: #666666">{{ item.artUser }}</div>
          <h1 style="font-size: 16px; color: #444444">
            {{ item.artName }}
          </h1>
          <div
            v-html="$options.filters.setContent(item.artContent)"
            style="font-size: 12px; color: #999999"
          ></div>
          <span style="font-size: 12px; color: #aaaaaa"
            >{{ item.artPosttime }}
            <img
              src="../../assets/阅读量.png"
              alt=""
              style="width: 14px; height: 14px"
            />{{ item.readcount }}
            <img
              src="../../assets/点赞.png"
              alt=""
              style="width: 14px; height: 14px"
            />{{ item.artApprove }}</span
          >
        </div>
      </div>
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
      console.log("所有文章", this.arts);
    },
    async toConArt(article) {
      const { data: res } = await this.$http.post("forum/addreadcount", {
        artId: article.artId,
      });
      article.readcount += 1;
      this.$store.dispatch("asyncUpdateArticle", article);
      this.$router.push("/conArticle");
      this.$emit("changeInd");
    },
  },
  filters: {
    //当渲染的文字超出一定字节后显示省略号
    setContent(value) {
      if (!value) return "";
      if (value.length > 60) {
        return value.slice(0, 60) + "...";
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
