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
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
