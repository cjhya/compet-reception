import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import FrontPage from "../views/secondaryPage/FrontPage.vue";
import Competition from "../views/competition/Competition.vue";
import Forum from "../views/forum/Forum.vue";
import LoginRegister from "../views/secondaryPage/LoginRegister.vue";
import PostArticle from "../views/secondaryPage/PostArticle.vue";
import Infor from "../views/message/Infor.vue";
import ComInfor from "../views/competition/ComInfor.vue";
import ComConInfor from "../views/competition/ComConInfor.vue";
import ComAnn from "../views/competition/ComAnn.vue";
import ComConAnn from "../views/competition/ComConAnn.vue";
import ConArticle from "../views/forum/ConArticle.vue";
import PersonalSignUp from "../views/signUp/PersonalSignUp.vue";
import TeamSignUp from "../views/signUp/TeamSignUp.vue";
import SysNotice from "../views/message/SysNotice.vue";
import MyMessage from "../views/message/MyMessage.vue";
import SearchRes from "../views/secondaryPage/SearchRes.vue"

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "home",
    },
    {
      path: "/home",
      component: Home,
      redirect: "/frontPage",
      children: [
        { path: "/loginRegister", component: LoginRegister },
        { path: "/frontPage", component: FrontPage },
        { path: "/competition", component: Competition },
        { path: "/forum", component: Forum },
        { path: "/postArticle", component: PostArticle },
        {
          path: "/infor",
          component: Infor,
          redirect: "/sysNotice",
          children: [
            { path: "/sysNotice", component: SysNotice },
            { path: "/myMessage", component: MyMessage },
          ],
        },
        {
          path: "/comInfor",
          component: ComInfor,
          redirect: "/comConInfor",
          children: [
            { path: "/comConInfor", component: ComConInfor },
            { path: "/comAnn", component: ComAnn },
          ],
        },
        { path: "/comConAnn", component: ComConAnn },
        { path: "/conArticle", component: ConArticle },
        { path: "/personalSignUp", component: PersonalSignUp },
        { path: "/teamSignUp", component: TeamSignUp },
        { path: "/searchRes", component: SearchRes },
      ],
    },
  ],
});

export default router;
