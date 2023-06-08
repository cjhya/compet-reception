<template>
  <div style="width: 60%; margin: 10px auto">
    <h1
      style="
        font-size: 15px;
        color: #666666;
        border-left: 4px solid #22bfa7;
        padding-left: 10px;
      "
    >
      {{ title }}
    </h1>
    <div
      v-for="item in articles"
      :key="item.artId"
      style="border: solid 1px #e6e6e6; padding: 20px; margin: 20px 0"
    >
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex">
          <div style="margin-right: 10px">
            <el-avatar
              :src="item.headpicture"
              @click.native="toConArt(item)"
            ></el-avatar>
          </div>
          <div>
            <div
              style="font-size: 12px; color: #666666"
              @click="toConArt(item)"
            >
              {{ item.artUser }}
            </div>
            <h1 style="font-size: 16px; color: #444444" @click="toConArt(item)">
              {{ $options.filters.setContent(item.artName) }}
            </h1>
            <div
              v-html="$options.filters.setContent(item.artContent)"
              style="font-size: 12px; color: #999999"
            ></div>
            <span style="font-size: 12px; color: #aaaaaa"
              >{{ item.artPosttime }}
              <img
                src="../../assets/阅读量.png"
                alt=""
                style="width: 14px; height: 14px"
              />{{ item.readcount }}
              <img
                src="../../assets/点赞.png"
                alt=""
                style="width: 14px; height: 14px"
              />{{ item.artApprove }}</span
            >
          </div>
        </div>
        <el-popconfirm
          confirm-button-text="删除"
          cancel-button-text="编辑"
          icon="el-icon-info"
          icon-color="red"
          title="这篇文章你要进行什么操作？"
          @confirm="deleteArticle(item.artId)"
          @cancel="showArtEditDialog(item.artId)"
          v-if="item.userId == $store.getters.getUser.userId"
        >
          <i class="el-icon-more" slot="reference"></i>
        </el-popconfirm>
      </div>
    </div>

    <!-- 修改文章对话框 -->
    <el-dialog
      title="修改文章"
      :visible.sync="editArtDialog"
      width="50%"
      @close="editArtDialogClosed"
      append-to-body
      id="editAnn"
    >
      <!-- 内容主体区域 -->
      <el-form :model="editArtForm" label-width="100px">
        <el-form-item label="文章标题">
          <el-input v-model="editArtForm.artName"></el-input>
        </el-form-item>
        <el-form-item label="正文">
          <Editor ref="artEditEditor" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editArtDialog = false">取 消</el-button>
        <el-button type="primary" @click="editArt">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Editor from "../../components/Editor.vue";
export default {
  name: "Forum",
  components: { Editor },
  data() {
    return {
      articles: [],
      title: "",
      editArtDialog: false,
      editArtForm: {
        artName: "",
      },
    };
  },
  created() {
    this.getAllArt();
  },
  methods: {
    //修改文章
    async editArt() {
      const { data: res } = await this.$http.post("forum/updatearticle", {
        artId: this.editArtForm.artId,
        artName: this.editArtForm.artName,
        artContent: this.$refs.artEditEditor.html,
      });
      this.editArtDialog = false;
      this.getAllArt();
    },
    //打开修改文章对话框
    showArtEditDialog(id) {
      for (let art of this.articles) {
        if (art.artId == id) {
          this.editArtForm = {
            artId: id,
            artName: art.artName,
          };
          //定时器模拟异步操作
          setTimeout(() => {
            this.$refs.artEditEditor.html = art.artContent;
          });
          this.editArtDialog = true;
          return;
        }
      }
    },
    //修改文章对话框关闭
    editArtDialogClosed() {
      this.$refs.artEditEditor.html = "";
      this.editArtForm = {
        artName: "",
      };
    },
    async deleteArticle(id) {
      const { data: res } = await this.$http.post("forum/deletearticle", {
        artId: id,
      });
      console.log("删除文章返回信息", res);
      this.getAllArt();
    },
    async getAllArt() {
      const { data: res } = await this.$http.get("/forum/getarticle");
      console.log("返回信息", res);
      this.articles = res.data;
      this.title = "所有文章";
      if (this.$store.getters.getForum == "我的") {
        const arr = [];
        for (let art of this.articles) {
          if (art.userId == this.$store.getters.getUser.userId) {
            arr.push(art);
          }
        }
        this.articles = arr;
        this.title = "我的文章";
        console.log("我的文章", this.articles);
      }
    },
    async toConArt(article) {
      const { data: res } = await this.$http.post("forum/addreadcount", {
        artId: article.artId,
      });
      article.readcount += 1;
      this.$store.dispatch("asyncUpdateArticle", article);
      this.$router.push("/conArticle");
      this.$emit("changeInd");
    },
  },
  filters: {
    //当渲染的文字超出一定字节后显示省略号
    setContent(value) {
      if (!value) return "";
      if (value.length > 60) {
        return value.slice(0, 60) + "...";
      }
      return value;
    },
  },
};
</script>

<style scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

#editAnn /deep/ .el-dialog__body {
  padding: 15px 20px 0 0;
}

#editAnn /deep/ .el-dialog__footer {
  padding: 0 10px 20px 10px;
}
</style>
