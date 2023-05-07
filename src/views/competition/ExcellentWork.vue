<template>
  <div style="width: 60%; margin: 0 40px">
    <h2
      style="
        font-size: 22px;
        color: #666666;
        font-weight: 600;
        border-left: 4px solid #22bfa7;
        padding-left: 10px;
      "
    >
      优秀作品
    </h2>
    <div
      v-for="item in excellentWorkList"
      :key="item.fileId"
      style="font-size: 18px; margin: 30px 40px"
    >
      <a
        :href="
          'https://4wr6987968.yicp.fun/competition/downloaditem?fileId=' +
          item.fileId
        "
        >{{ item.fileName }}</a
      >
      <span style="float: right; font-size: 14px; color: #878787">{{
        item.fileLoadtime
      }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExcellentWork",
  data() {
    return {
      excellentWorkList: [],
    };
  },
  created() {
    this.getAllWorkList();
  },
  methods: {
    //获取优秀作品列表
    async getAllWorkList() {
      const { data: res } = await this.$http.get(
        "competition/getiteminfo?comId=" +
          this.$store.getters.getCompetition.comId
      );
      this.excellentWorkList = res.data;
      console.log("优秀作品列表", this.excellentWorkList);
    },
  },
};
</script>

<style></style>
