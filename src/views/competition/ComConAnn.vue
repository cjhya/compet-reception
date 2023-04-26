<template>
  <div>
    <h1 style="text-align: center">{{ note.noteTitle }}</h1>
    <div v-html="note.distributeText" style="margin: 5px 40px"></div>
    <el-card style="width: 500px; margin: 0 auto">
      <div slot="header" class="clearfix">
        <span>附件列表</span>
      </div>
      <div
        v-for="item in note.appendix"
        :key="item.appendixId"
        style="font-size: 20px; margin: 10px"
      >
        <a
          :href="
            'https://4wr6987968.yicp.fun/note/downloadappendix?appendixId=' +
            item.appendixId
          "
          >{{ item.appendixName }}</a
        >
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ComConAnn",
  data() {
    return {
      note: {},
    };
  },
  created() {
    this.note = this.$store.getters.getNote;
    console.log("得到的公告信息", this.note.appendix);
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
