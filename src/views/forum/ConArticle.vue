<template>
  <div style="margin: 10px 40px">
    <el-card style="padding: 0 20px 10px 20px">
      <div>
        <h1 style="">{{ article.artName }}</h1>
        <span style="font-size: 12px"
          >{{ article.artPosttime }} {{ article.readcount }}阅读
          {{ article.artApprove }}点赞 {{ article.artDisapprove }}踩</span
        >
        <h3>作者：{{ article.artUser }}</h3>
        <el-divider></el-divider>
        <div v-html="article.artContent"></div>
      </div>
      <el-divider></el-divider>
      <!-- 评论区 -->
      <div>
        <h1>评论</h1>
        <!-- 发表评论框 -->
        <el-row style="width: 90%; margin: 0 auto" type="flex" justify="center">
          <el-col :span="1.5"
            ><el-avatar
              :size="54"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ></el-avatar
          ></el-col>
          <el-col :span="20" style="margin: 0 10px"
            ><el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="postCom"
            >
            </el-input
          ></el-col>
          <el-col :span="1.5"
            ><div style="height: 54px; line-height: 54px">
              <el-button style="height: 54px">发布</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 评论 -->
        <el-row
          v-for="item in comments"
          :key="item.commId"
          style="width: 90%; margin: 10px auto"
          type="flex"
          justify="space-between"
        >
          <el-col style="margin-right: 5px; width: 8%"
            ><el-avatar
              :size="54"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ></el-avatar
          ></el-col>
          <el-col style="width: 92%"
            ><p style="margin-top: 0; margin-bottom: 8px">
              {{ item.commUser }}
            </p>
            <span>{{ item.commContent }}</span>
            <p style="margin-bottom: 0; margin-top: 8px">
              {{ item.commPosttime }} <i class="el-icon-caret-top"></i
              >{{ item.commApprove }} <i class="el-icon-caret-bottom"></i
              >{{ item.commDisapprove }}
            </p>
            <el-row
              v-for="item2 in item.soncomment"
              :key="item2.commId"
              style="margin: 5px 0"
              type="flex"
              justify="space-between"
            >
              <el-col style="width:7%">
                <el-avatar
                  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                ></el-avatar>
              </el-col>
              <el-col style="width:93%">
                <p style="margin: 8px 0">
                  {{ item2.commUser }} {{ item2.touser }}
                  {{ item2.commContent }}
                </p>
                <p style="margin: 8px 0">
                  {{ item2.commPosttime }} <i class="el-icon-caret-top"></i
                  >{{ item2.commApprove }} <i class="el-icon-caret-bottom"></i
                  >{{ item2.commDisapprove }}
                </p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ConArticle",
  data() {
    return {
      postCom: "",
      article: {},
      comments: [],
    };
  },
  created() {
    this.article = this.$store.getters.getArticle;
    console.log("得到的具体文章", this.article);
    this.getAllComments();
  },
  methods: {
    //获取该文章所有评论
    async getAllComments() {
      const { data: res } = await this.$http.get(
        "forum/getcomment?artId=" + this.article.artId
      );
      this.comments = res.data;
      console.log("对应的评论信息", this.comments);
    },
  },
};
</script>

<style></style>
