<template>
  <div>
    <el-carousel height="300px">
      <el-carousel-item
        v-for="item in pics"
        :key="item.id"
        style="text-align: center"
      >
        <el-image :src="item.path" style="width: 100%; height: 100%"></el-image>
      </el-carousel-item>
    </el-carousel>
    <el-card style="margin: 10px 40px">
      <div slot="header" class="clearfix">
        <span>热门竞赛</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="toCompet"
          >查看更多</el-button
        >
      </div>
      <div>
        <el-row type="flex" justify="space-between">
          <el-col
            :span="5"
            v-for="item in comHot"
            :key="item.comId"
            style="margin: 5px 10px 0 20px"
            @click.native="toComInfor(item)"
          >
            <div>
              <el-image
                src="https://publicqn.saikr.com/e9a415c2a88946e825877e81b91e337a1681724109481.png"
              ></el-image>
              <p>
                <el-tag size="mini">{{ item.state }}</el-tag> {{ item.comName
                }}
              </p>
              <p>主办方: {{ item.absComHost }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "FrontPage",
  data() {
    return {
      pics: [
        {
          path: "https://publicqn.saikr.com/2023/03/24/contest641d6c4d3196f7.848381221679649873731.png?imageView2/2/w/1080",
          id: "1",
        },
        {
          path: "https://publicqn.saikr.com/2023/04/03/contest642a9f8573b037.630061001680514981170.png?imageView2/2/w/1080",
          id: "2",
        },
        {
          path: "https://publicqn.saikr.com/2023/02/03/contest63dc75d9e66901.304693181675393439551.png?imageView2/2/w/1080",
          id: "3",
        },
        {
          path: "https://publicqn.saikr.com/2023/04/12/contest64366057734cc7.485133281681285248785.png?imageView2/2/w/1080",
          id: "4",
        },
      ],
      comHot: [],
    };
  },
  created() {
    //获取首页热点竞赛
    this.getAllComHot();
  },
  methods: {
    //进入详细竞赛信息
    toComInfor(competition) {
      competition.comLoginstarttime = competition.comLoginstarttime.substr(
        0,
        10
      );
      competition.comLoginendtime = competition.comLoginstarttime.substr(0, 10);
      competition.comDostarttime = competition.comLoginstarttime.substr(0, 10);
      competition.comDoendtime = competition.comLoginstarttime.substr(0, 10);
      this.$store.dispatch("asyncUpdateCompetition", competition);
      console.log("竞赛信息", this.$store.getters.getCompetition);
      this.$router.push("/comInfor");
      this.$emit("changeInd");
    },
    //查看更多竞赛
    toCompet() {
      this.$router.push("/competition");
      this.$emit("changeInd", "/competition");
    },
    async getAllComHot() {
      const { data: res } = await this.$http.get("competition/gethot");
      this.comHot = res.data;
      console.log("得到热点竞赛", this.comHot);
      for (let comp of this.comHot) {
        if (comp.state == "正在报名") {
          if (this.$store.getters.getUser.userId == undefined) {
            comp.signUpText = "报名请登录";
          } else if (1) {
            //没有报名该竞赛
            comp.signUpText = "马上报名";
          } else {
            //报名该竞赛
            comp.sighUpText = "已报名";
          }
        }
      }
    },
  },
};
</script>

<style></style>
