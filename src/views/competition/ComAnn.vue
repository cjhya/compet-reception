<template>
  <div style="width: 60%; margin: 0 40px">
    <div v-for="item in notes" :key="item.noteId">
      <h1 @click="toConNote(item)">{{ item.noteTitle }}</h1>
      <div
        v-html="item.distributeText"
        style="overflow:hidden;white-space: nowrap; text-overflow: ellipsis"
      ></div>
      <p>{{ item.distributeTime }}</p>
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
      console.log("得到的公告列表", this.notes);
    },
    toConNote(note) {
        console.log("选择的公告",note)
        this.$store.dispatch("asyncUpdateNote",note)
        this.$router.push("/comConAnn")
    },
  },
};
</script>

<style></style>
