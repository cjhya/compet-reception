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
      竞赛公告
    </h2>
    <div v-for="item in notes" :key="item.noteId" @click="toConNote(item)" style="margin:10px 0">
      <h1 style="font-size: 18px; color: #262626">{{ item.noteTitle }}</h1>
      <div
        v-html="item.distributeText"
        style="
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 13px;
        "
      ></div>
      <p style="font-size: 12px; color: #aaaaaa">{{ item.distributeTime }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComAnn",
  data() {
    return {
      notes: [],
    };
  },
  created() {
    this.getAnns();
  },
  methods: {
    async getAnns() {
      const { data: res } = await this.$http.get(
        "note/getnote?absComId=" + this.$store.getters.getCompetition.absComId
      );
      this.notes = res.data;
    },
    toConNote(note) {
      this.$store.dispatch("asyncUpdateNote", note);
      this.$router.push("/comConAnn");
    },
  },
};
</script>

<style></style>
