import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

//保存数据
const state = {
  user: {},
  competition: {},
  note: {},
  article: {},
  searchKey: "",
  record: {},
  //与某人聊天
  chatPerson: {},
  //获取我的文章
  forum: "",
  activity:{}
};

//获取state数据
const getters = {
  getUser(state) {
    return state.user;
  },
  getCompetition(state) {
    return state.competition;
  },
  getNote(state) {
    return state.note;
  },
  getArticle(state) {
    return state.article;
  },
  getSearchKey(state) {
    return state.searchKey;
  },
  getRecord(state) {
    return state.record;
  },
  getChatPerson(state) {
    return state.chatPerson;
  },
  getForum(state) {
    return state.forum;
  },
  getActivity(state) {
    return state.activity;
  },
};

//同步执行修改state值方法
const mutations = {
  updateUser(state, data) {
    state.user = data;
  },
  updateCompetition(state, data) {
    state.competition = data;
  },
  updateNote(state, data) {
    state.note = data;
  },
  updateArticle(state, data) {
    state.article = data;
  },
  updateSearchKey(state, data) {
    state.searchKey = data;
  },
  updateRecord(state, data) {
    state.record = data;
  },
  updateChatPerson(state, data) {
    state.chatPerson = data;
  },
  updateForum(state, data) {
    state.forum = data;
  },
  updateActivity(state, data) {
    state.activity = data;
  },
};

//异步执行mutations方法
const actions = {
  asyncUpdateUser(content, user) {
    content.commit("updateUser", user);
  },
  asyncUpdateCompetition(content, competition) {
    content.commit("updateCompetition", competition);
  },
  asyncUpdateNote(content, note) {
    content.commit("updateNote", note);
  },
  asyncUpdateArticle(content, article) {
    content.commit("updateArticle", article);
  },
  asyncUpdateSearchKey(content, searchKey) {
    content.commit("updateSearchKey", searchKey);
  },
  asyncUpdateRecord(content, record) {
    content.commit("updateRecord", record);
  },
  asyncUpdateChatPerson(content, chatPerson) {
    content.commit("updateChatPerson", chatPerson);
  },
  asyncUpdateForum(content, forum) {
    content.commit("updateForum", forum);
  },
  asyncUpdateActivity(content, activity) {
    content.commit("updateActivity", activity);
  },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
