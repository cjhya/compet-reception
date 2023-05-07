<template>
  <div>
    <h2
      style="
        font-size: 22px;
        color: #666666;
        font-weight: 600;
        border-left: 4px solid #22bfa7;
        padding-left: 10px;
        margin:50px
      "
    >
      公告信息
    </h2>
    <h1
      style="
        text-align: center;
        font-size: 40px;
        color: #f1f1f1;
        background: #333;
        padding: 50px;
      "
    >
      {{ note.noteTitle }}
    </h1>
    <div
      v-html="note.distributeText"
      style="margin: 5px 40px; font-size: 18px; color: #666666;padding:20px 50px"
    ></div>
    <el-card style="width: 600px; margin: 30px auto">
      <div slot="header" class="clearfix">
        <span style="font-size:22px;color:#666666;font-weight:600">附件列表</span>
      </div>
      <div
        v-for="item in note.appendix"
        :key="item.appendixId"
        style="font-size: 20px; margin: 20px"
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
    console.log("公告",this.note)
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
