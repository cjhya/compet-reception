<template>
  <div>
    <div
      style="
        width: 100%;
        height: 100%;
        border: 1px #e6e6e6 solid;
        display: flex;
        background-color: rgb(39, 42, 55);
      "
    >
      <!-- 人员列表 -->
      <div
        style="flex: 1; border-right: 1px #e6e6e6 solid"
        class="person-cards-wrapper"
      >
        <div
          v-for="item in personList"
          :key="item.listuserId"
          style="display: flex"
          @click="clickPerson(item)"
        >
          <div
            style="border-bottom: 1px solid #e6e6e6"
            class="person-card"
            :class="{ activeCard: item.listuserId == currentPerson }"
          >
            <div class="info">
              <el-avatar :src="item.listuserheadpicture"></el-avatar>
              <div class="info-detail">
                <div class="name">{{ item.listuserName }}</div>
                <div class="detail">{{ item.messageText }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-window" style="flex: 4">
        <!-- 头部栏 -->
        <div class="top" v-show="currentPerson">
          <div class="head-pic">
            <el-avatar :src="topInfo.listuserheadpicture"></el-avatar>
          </div>
          <div class="info-detail">
            <div class="name">{{ topInfo.listuserName }}</div>
          </div>
        </div>
        <!-- 内容框 -->
        <div class="botoom">
          <div class="chat-content" ref="chatContent">
            <div
              class="chat-wrapper"
              v-for="item in conContentList"
              :key="item.messageId"
            >
              <div
                class="chat-friend"
                v-if="item.touserId == $store.getters.getUser.userId"
              >
                <div class="info-time">
                  <img :src="item.fromuserheadpicture" alt="" />
                  <span>{{ item.messageTime }}</span>
                </div>
                <div class="chat-text">
                  {{ item.messageText }}
                </div>
              </div>
              <div class="chat-me" v-else>
                <div class="info-time">
                  <img :src="$store.getters.getUser.headpicture" alt="" />
                  <span>{{ item.messageTime }}</span>
                </div>
                <div class="chat-text">
                  {{ item.messageText }}
                </div>
              </div>
            </div>
          </div>
          <!-- 输入框 -->
          <div class="chatInputs" v-show="currentPerson">
            <div class="emoji boxinput" @click="clickEmoji">
              <img src="@/assets/img/emoji/smiling-face.png" alt="" />
            </div>
            <input class="inputs" v-model="inputMsg" @keyup.enter="sendText" />
            <div class="send boxinput" @click="sendText">
              <img src="@/assets/img/emoji/rocket.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { animation } from "@/util/util";
export default {
  name: "MyMessage",
  data() {
    return {
      mesSocket: null,
      inputMsg: "",
      currentPerson: "",
      topInfo: {},
      //所有用户所有人员列表
      allPersonList: [],
      //当前用户人员列表
      personList: [],
      //所有用户所有聊天内容列表
      allContentList: [],
      //当前用户所有聊天内容列表
      contentList: [],
      //当前聊天框内容列表
      conContentList: [],
    };
  },
  watch: {
    currentPerson: function (newVal, oldVal) {
      for (let oneList of this.contentList) {
        if (oneList.listuserId == newVal) {
          this.conContentList = oneList.message;
        }
      }
      this.scrollBottom();
    },
  },
  created() {
    this.initMesSocket();
  },
  methods: {
    clickPerson(item) {
      this.currentPerson = item.listuserId;
      this.topInfo = item;
    },
    initMesSocket() {
      this.mesSocket = new WebSocket("wss://4wr6987968.yicp.fun/ws/chat/");
      this.mesSocket.onopen = this.mesSocketOpen;
      this.mesSocket.onerror = this.mesSocketError;
      this.mesSocket.onmessage = this.mesSocketMessage;
    },
    mesSocketOpen() {
      console.log("连接成功");
    },
    mesSocketError() {
      console.log("连接错误");
    },
    mesSocketMessage(msg) {
      this.allPersonList = JSON.parse(msg.data).res1.data;
      for (let oneList of this.allPersonList) {
        if (oneList.userId == this.$store.getters.getUser.userId) {
          this.personList = oneList.list;
        }
      }
      for (let oneList of this.personList) {
        if (oneList.listuserId == this.currentPerson) {
          this.topInfo = oneList;
        }
      }
      this.allContentList = JSON.parse(msg.data).res2.data;
      for (let oneList of this.allContentList) {
        if (oneList.userId == this.$store.getters.getUser.userId) {
          this.contentList = oneList.list;
        }
      }
      for (let oneList of this.contentList) {
        if (oneList.listuserId == this.currentPerson) {
          this.conContentList = oneList.message;
        }
      }
      if (this.$store.getters.getChatPerson.listuserId != undefined) {
        this.personList.unshift(this.$store.getters.getChatPerson);
        this.topInfo = this.$store.getters.getChatPerson;
        this.currentPerson = this.$store.getters.getChatPerson.listuserId;
        this.conContentList = [];
      }
      this.scrollBottom();
    },
    clickEmoji() {},
    sendText() {
      this.mesSocket.send(
        JSON.stringify({
          fromuser: this.$store.getters.getUser.userId,
          touser: this.currentPerson,
          text: this.inputMsg,
        })
      );
      this.inputMsg = "";
      this.$store.dispatch("asyncUpdateChatPerson", {});
    },
    //获取窗口高度并滚动至最底层
    scrollBottom() {
      console.log("开始")
      this.$nextTick(() => {
        const scrollDom = this.$refs.chatContent;
        console.log(
          "滚动条元素",
          scrollDom,
          // scrollDom.scrollHeight,
          // scrollDom.offsetHeight
        );
        animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight);
      });
      console.log("结束")
    },
  },
};
</script>

<style lang="scss" scoped>
.person-cards-wrapper {
  height: 65vh;
  overflow: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 0; /* Safari,Chrome 隐藏滚动条 */
    height: 0; /* Safari,Chrome 隐藏滚动条 */
    display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
  }
}

.person-card {
  width: 250px;
  height: 80px;
  background-color: rgb(50, 54, 68);
  position: relative;
  cursor: pointer;
  .info {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 90%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    display: flex;
    .info-detail {
      margin-top: 5px;
      margin-left: 20px;
      .name {
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 5px;
      }
      .detail {
        color: #5c6675;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
      }
    }
  }
  &:hover {
    background-color: #1d90f5;
    transition: 0.3s;
    box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
    // box-shadow:  0 5px 20px rgba(251, 152, 11, .5);
    .info {
      .info-detail {
        .detail {
          color: #fff;
        }
      }
    }
  }
}
.activeCard {
  background-color: #1d90f5;
  transition: 0.3s;
  box-shadow: 3px 2px 10px 0px rgba(0, 136, 255);
  .info {
    .info-detail {
      .detail {
        color: #fff;
      }
    }
  }
}

.chat-window {
  width: 100%;
  height: 100%;
  position: relative;

  .top {
    margin: 20px;
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
      margin: 5px 20px 0;
      .name {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
      }
    }
  }

  .botoom {
    width: 100%;
    height: 70vh;
    background-color: rgb(50, 54, 68);
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    .chat-content {
      width: 100%;
      height: 85%;
      overflow-y: scroll;
      padding: 20px;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 0; /* Safari,Chrome 隐藏滚动条 */
        height: 0; /* Safari,Chrome 隐藏滚动条 */
        display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
      }
      .chat-wrapper {
        position: relative;
        word-break: break-all;
        .chat-friend {
          width: 100%;
          float: left;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          .chat-text {
            max-width: 90%;
            padding: 20px;
            border-radius: 20px 20px 20px 5px;
            background-color: rgb(56, 60, 75);
            color: #fff;
            &:hover {
              background-color: rgb(39, 42, 55);
            }
          }
          .info-time {
            margin: 10px 0;
            color: #fff;
            font-size: 14px;
            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
            }
            span:last-child {
              color: rgb(101, 104, 115);
              margin-left: 10px;
              vertical-align: middle;
            }
          }
        }
        .chat-me {
          width: 100%;
          float: right;
          margin-bottom: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-end;
          .chat-text {
            float: right;
            max-width: 90%;
            padding: 20px;
            border-radius: 20px 20px 5px 20px;
            background-color: rgb(29, 144, 245);
            color: #fff;
            &:hover {
              background-color: rgb(26, 129, 219);
            }
          }
          .info-time {
            margin: 10px 0;
            color: #fff;
            font-size: 14px;
            display: flex;
            justify-content: flex-end;

            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-right: 10px;
            }
            span {
              line-height: 30px;
            }
            span:first-child {
              color: rgb(101, 104, 115);
              margin-right: 10px;
              vertical-align: middle;
            }
          }
        }
      }
    }
    .chatInputs {
      width: 90%;
      position: absolute;
      bottom: 0;
      margin: 3%;
      display: flex;
      .boxinput {
        width: 50px;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 15px;
        border: 1px solid rgb(80, 85, 103);
        position: relative;
        cursor: pointer;
        img {
          width: 30px;
          height: 30px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .emoji {
        transition: 0.3s;
        &:hover {
          background-color: rgb(46, 49, 61);
          border: 1px solid rgb(71, 73, 82);
        }
      }

      .inputs {
        width: 90%;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 15px;
        border: 2px solid rgb(34, 135, 225);
        padding: 10px;
        box-sizing: border-box;
        transition: 0.2s;
        font-size: 20px;
        color: #fff;
        font-weight: 100;
        margin: 0 20px;
        &:focus {
          outline: none;
        }
      }
      .send {
        background-color: rgb(29, 144, 245);
        border: 0;
        transition: 0.3s;
        box-shadow: 0px 0px 5px 0px rgba(0, 136, 255);
        &:hover {
          box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
        }
      }
    }
  }
}
</style>
