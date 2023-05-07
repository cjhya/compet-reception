<template>
  <div style="margin: 10px 40px">
    <el-card style="padding: 20px 50px">
      <div>
        <h1 style="font-size: 28px; margin-top: 0">{{ article.artName }}</h1>
        <span style="font-size: 13px"
          >{{ article.artPosttime }}
          <img
            src="../../assets/阅读量.png"
            alt=""
            style="width: 13px; height: 13px"
          />{{ article.readcount }}
          <img
            src="../../assets/点赞.png"
            alt=""
            style="width: 13px; height: 13px"
          />{{ article.artApprove }}</span
        >
        <div class="top">
          <div class="head-pic">
            <el-avatar :src="article.headpicture" @click.native="artAvaToMyMessage(article)"></el-avatar>
          </div>
          <div class="info-detail">
            <div class="name">{{ article.artUser }}</div>
          </div>
        </div>
        <el-divider></el-divider>
        <div v-html="article.artContent"></div>
      </div>
      <el-divider></el-divider>
      <!-- 评论区 -->
      <div>
        <h1 style="font-size: 20px">评论</h1>
        <div style="display: flex; width: 90%; margin: 15px auto">
          <img
            style="width: 54px; height: 54px; border-radius: 50%"
            src="../../assets/comAva.jpg"
            @click="clearInput"
          />
          <el-input
            style="margin: 0 15px"
            type="textarea"
            resize="none"
            :placeholder="placeHolder"
            v-model="postCom"
          >
          </el-input>
          <el-button
            style="
              height: 54px;
              background-color: #00aeec;
              opacity: 0.5;
              border-radius: 4px;
              color: #ffffff;
            "
            @click="postFirstComment"
            >发布</el-button
          >
        </div>
        <div
          v-for="item in this.comments"
          :key="item.commId"
          style="width: 90%; margin: 0 auto"
        >
          <!-- 一级评论 -->
          <div style="display: flex; margin: 15px 0">
            <el-avatar
              :size="54"
              :src="item.headpicture"
              alt=""
              style="margin-right: 10px"
              @click.native="toMyMessage(item)"
            ></el-avatar>
            <div>
              <h1 style="font-size: 13px; margin: 0">{{ item.commUser }}</h1>
              <div style="font-size: 15px">{{ item.commContent }}</div>
              <div style="font-size: 13px">
                {{ item.commPosttime }}
                <img
                  src="../../assets/点赞.png"
                  alt=""
                  style="width: 13px; height: 13px"
                />{{ item.commApprove
                }}<span class="changeHover" @click="replyFirstComment(item)">
                  回复</span
                >
              </div>
            </div>
          </div>
          <!-- 二三级评论 -->
          <div
            v-for="secItem in item.soncomment"
            :key="secItem.commId"
            style="transform: translate(70px, 0); margin: 15px 0"
          >
            <div style="display: flex">
              <el-avatar
                :size="30"
                :src="secItem.headpicture"
                alt=""
                style="margin-right: 10px"
                @click.native="toMyMessage(item)"
              ></el-avatar>
              <div>
                <h1 style="font-size: 13px; margin: 0">
                  {{ secItem.commUser }} {{ secItem.touser }}
                </h1>
                <div style="font-size: 15px">{{ secItem.commContent }}</div>
                <div style="font-size: 13px">
                  {{ secItem.commPosttime }}
                  <img
                    src="../../assets/点赞.png"
                    alt=""
                    style="width: 15px; height: 15px"
                  />{{ secItem.commApprove
                  }}<span class="changeHover" @click="replySecComment(secItem)">
                    回复</span
                  >
                </div>
              </div>
            </div>
          </div>
          <el-divider style="transform: translate(100px, 0)"></el-divider>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ConArticle",
  data() {
    return {
      placeHolder: "请输入内容",
      postCom: "",
      commToId: "",
      isresponse: "",
      article: {},
      comments: [],
    };
  },
  created() {
    this.article = this.$store.getters.getArticle;
    console.log("文章信息", this.article);
    this.getAllComments();
  },
  methods: {
    //跳转我的消息页面
    artAvaToMyMessage(item) {
      this.$store.dispatch("asyncUpdateChatPerson", {
        listuserId: item.userId,
        listuserName: item.artUser,
        listuserheadpicture: item.headpicture,
      });
      this.$router.push("/myMessage");
    },
    //跳转我的消息页面
    toMyMessage(item) {
      console.log("用户信息", item);
      this.$store.dispatch("asyncUpdateChatPerson", {
        listuserId: item.userId,
        listuserName: item.commUser,
        listuserheadpicture: item.headpicture,
      });
      this.$router.push("/myMessage");
    },
    //点击空白处清除输入框信息
    clearInput() {
      this.postCom = "";
      this.commToId = "";
      this.isresponse = "";
      this.placeHolder = "请输入内容";
    },
    //获取该文章所有评论
    async getAllComments() {
      const { data: res } = await this.$http.get(
        "forum/getcomment?artId=" + this.article.artId
      );
      this.comments = res.data;
      console.log("所有评论信息", this.comments);
    },
    //发表评论
    async postFirstComment() {
      console.log("评论发表参数", {
        artId: this.article.artId,
        userId: this.$store.getters.getUser.userId,
        commContent: this.postCom,
        commToId: this.commToId,
        isresponse: this.isresponse,
      });
      const { data: res } = await this.$http.post("forum/addcomment", {
        artId: this.article.artId,
        userId: this.$store.getters.getUser.userId,
        commContent: this.postCom,
        commToId: this.commToId,
        isresponse: this.isresponse,
      });
      this.postCom = "";
      this.commToId = "";
      this.isresponse = "";
      this.placeHolder = "请输入内容";
      console.log("发表评论返回信息", res);
      this.getAllComments();
    },
    //回复一级评论的配置
    replyFirstComment(item) {
      this.placeHolder = "回复@" + item.commUser;
      this.commToId = item.commId;
      this.isresponse = "0";
    },
    // 回复二级评论的配置
    replySecComment(item) {
      this.placeHolder = "回复@" + item.commUser;
      this.commToId = item.commId;
      this.isresponse = "1";
    },
  },
};
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 10px 0;
}

.changeHover:hover {
  color: #00aeec;
}

.top {
  margin: 10px 0;
  &::after {
    content: "";
    display: block;
    clear: both;
  }
  .head-pic {
    float: left;
  }
  .info-detail {
    float: left;
    margin: 9px 5px;
    .name {
      font-size: 20px;
      font-weight: 600;
    }
  }
}
</style>
