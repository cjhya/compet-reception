<template>
  <div style="width: 80%; margin: 10px auto">
    <el-card>
      <el-tabs v-model="activeName" style="padding: 0 20px">
        <el-tab-pane label="我报名的活动" name="sign">
          <div v-for="item in signActs" :key="item.activityId">
            <el-card
              style="
                width: 90%;
                margin: 10px 0 10px 40px;
                padding: 10px;
                box-sizing: border-box;
              "
            >
              <div style="float: left">
                <h1 style="margin: 0; font-size: 20px">
                  {{ item.activityName }}
                </h1>
                <p style="font-size: 14px; color: #aaaaaa">
                  主办方 {{ item.activityHost }}
                </p>
                <p style="font-size: 14px; color: #aaaaaa; margin: 2px 0">
                  活动分类 {{ item.activityInterest }}
                </p>
                <p style="font-size: 14px; color: #aaaaaa; margin: 2px 0">
                  活动地点 {{ item.activityLevel }}
                </p>
                <p style="font-size: 14px; color: #aaaaaa; margin: 2px 0">
                  活动方式 {{ item.activityWay }}
                </p>
                <p style="font-size: 14px; color: #aaaaaa; margin: 0">
                  活动时间 {{ item.activityDostarttime }} ~
                  {{ item.activityDoendtime }}
                </p>
                <p style="font-size: 14px; color: #aaaaaa; margin: 0">
                  报名时间 {{ item.activityLoginstarttime }} ~
                  {{ item.activityLoginendtime }}
                </p>
              </div>
              <div style="float: right; text-align: right">
                <p @click="toActInfor(item)" style="color: #666666">
                  <el-link :underline="false"
                    >活动详情<i class="el-icon-arrow-right"></i
                  ></el-link>
                </p>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="我发起的活动"
          name="post"
          v-if="$store.getters.getUser.roleName == '老师'"
        >
          <!-- 活动信息列表区域 -->
          <el-table :data="actInforList" border stripe>
            <el-table-column type="index" width="30"></el-table-column>
            <el-table-column
              label="活动名称"
              prop="activityName"
              width="100"
            ></el-table-column>
            <el-table-column
              label="活动简介"
              prop="activityIntro"
              width="100"
              :formatter="stateFormat"
            ></el-table-column>
            <el-table-column
              label="主办方"
              prop="activityHost"
              width="100"
            ></el-table-column>
            <el-table-column
              label="报名开始时间"
              prop="activityLoginstarttime"
              width="120"
            ></el-table-column>
            <el-table-column
              label="报名结束时间"
              prop="activityLoginendtime"
              width="120"
            ></el-table-column>
            <el-table-column
              label="活动开始时间"
              prop="activityDostarttime"
              width="120"
            ></el-table-column>
            <el-table-column
              label="活动结束时间"
              prop="activityDoendtime"
              width="120"
            ></el-table-column>
            <el-table-column
              label="链接"
              prop="activityLink"
              width="100"
              :formatter="stateFormat"
            ></el-table-column>
            <el-table-column
              label="分类"
              prop="activityInterest"
              width="60"
            ></el-table-column>
            <el-table-column
              label="级别"
              prop="activityLevel"
              width="50"
            ></el-table-column>
            <el-table-column
              label="方式"
              prop="activityWay"
              width="50"
            ></el-table-column>
            <el-table-column
              label="联系电话"
              prop="activityPhone"
              width="80"
            ></el-table-column>
            <el-table-column
              label="联系邮箱"
              prop="activityGroup"
              width="80"
            ></el-table-column>
            <el-table-column
              label="所有名额"
              prop="allnumber"
              width="80"
            ></el-table-column>
            <el-table-column
              label="剩余名额"
              prop="remainnumber"
              width="80"
            ></el-table-column>
            <el-table-column
              label="活动状态"
              prop="state"
              width="80"
            ></el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button
                  type="primary"
                  size="mini"
                  @click="showActEditDialog(scope.row.activityId)"
                  >修改
                </el-button>
                <!-- 编辑按钮 -->
                <el-button
                  type="primary"
                  size="mini"
                  @click="getSignDialog(scope.row.activityId)"
                  style="margin: 10px 0 0"
                  >获取报名记录
                </el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  size="mini"
                  @click="removeActById(scope.row.activityId)"
                  style="margin: 10px 0 0"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 修改活动对话框 -->
    <el-dialog
      title="修改活动"
      :visible.sync="editActDialogVisible"
      width="50%"
      @close="editActDialogClosed"
      append-to-body
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        label-width="100px"
        style="margin: 10px auto; width: 500px"
      >
        <el-form-item label="活动名称">
          <el-input v-model="editForm.activityName"></el-input
        ></el-form-item>
        <el-form-item label="活动简介">
          <Editor ref="editActInforEditor" />
        </el-form-item>
        <el-form-item label="主办方">
          <el-input v-model="editForm.activityHost"></el-input
        ></el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editForm.activityPhone"></el-input
        ></el-form-item>
        <el-form-item label="QQ群">
          <el-input v-model="editForm.activityGroup"></el-input
        ></el-form-item>
        <el-form-item label="级别">
          <el-select v-model="editForm.activityLevel" placeholder="请选择">
            <el-option
              v-for="item in levels"
              :key="item.way"
              :label="item.way"
              :value="item.way"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="editForm.activityLink"></el-input
        ></el-form-item>
        <el-form-item label="方式">
          <el-select v-model="editForm.activityWay" placeholder="请选择">
            <el-option
              v-for="item in ways"
              :key="item.way"
              :label="item.way"
              :value="item.way"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="editForm.activityInterest" placeholder="请选择">
            <el-option
              v-for="item in ints"
              :key="item.amId"
              :label="item.amName"
              :value="item.amName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报名开始时间">
          <el-date-picker
            v-model="editForm.activityLoginstarttime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名结束时间">
          <el-date-picker
            v-model="editForm.activityLoginendtime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动开始时间">
          <el-date-picker
            v-model="editForm.activityDostarttime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间">
          <el-date-picker
            v-model="editForm.activityDoendtime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所有名额">
          <el-input v-model="editForm.allnumber"></el-input
        ></el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="editActDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAct">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看参赛记录对话框 -->
    <el-dialog
      title="参赛记录"
      :visible.sync="signDialog"
      width="50%"
      @close="signDialogClosed"
      append-to-body
      id="joinRecordDialog"
    >
      <el-table :data="signRecord" border stripe>
        <el-table-column type="index" width="80"></el-table-column>
        <el-table-column
          label="报名学生"
          prop="userName"
          width="130"
        ></el-table-column>
        <el-table-column
          label="活动时长"
          prop="duration"
          width="130"
        ></el-table-column>
        <el-table-column
          label="状态"
          prop="state"
          width="130"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editById(scope.row.arId)"
            >
              修改
            </el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteById(scope.row.arId)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="signDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改参赛记录 -->
    <el-dialog
      title="修改报名记录"
      :visible.sync="editRecordDialog"
      width="30%"
      @close="editRecordDialogClosed"
      append-to-body
      id="edit"
    >
      <!-- 内容主体区域 -->
      <el-form :model="editRecordForm" label-width="100px">
        <el-form-item label="活动时长">
          <el-input v-model="editRecordForm.duration"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="editRecordForm.state"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRecordDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRecord">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Editor from "../../components/Editor.vue";
export default {
  name: "ActivityInfor",
  components: { Editor },
  data() {
    return {
      activeName: "post",
      actInforList: [],
      //添加活动
      ways: [{ way: "线上" }, { way: "线下" }],
      levels: [{ way: "校内" }, { way: "校外" }],
      ints: [],
      //修改活动
      editActDialogVisible: false,
      editForm: {},
      //报名记录
      signDialog: false,
      signRecord: [],
      editRecordDialog: false,
      editRecordForm: {},
      activityId: "",
      //报名活动
      signActs: [],
    };
  },
  created() {
    this.getAllInts();
    this.getAllAct();
    this.getAllSignActs();
  },
  methods: {
    toActInfor(act) {
      this.$store.dispatch("asyncUpdateActivity", act);
      this.$router.push("/actInfor");
      this.$emit("changeInd");
    },
    async getAllSignActs() {
      const { data: res } = await this.$http.get(
        "activity/getmyparticipantactivity?userId=" +
          this.$store.getters.getUser.userId
      );
      console.log("我报名的活动返回信息", res);
      this.signActs = res.data;
      console.log("我报名的活动", this.signActs);
    },
    async editRecord() {
      const { data: res } = await this.$http.post(
        "activity/updateactivityrecord",
        this.editRecordForm
      );
      console.log("修改返回信息", res);
      this.editRecordDialog = false;
      this.getSignDialog(this.activityId);
    },
    editRecordDialogClosed() {
      this.editRecordForm = {};
    },
    editById(id) {
      for (let i of this.signRecord) {
        if (i.arId == id) {
          this.editRecordForm = {
            arId: i.arId,
            duration: i.duration,
            state: i.state,
          };
          this.editRecordDialog = true;
          return;
        }
      }
    },
    async deleteById(id) {
      //弹框提示是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果确认删除，则返回值为字符串confirm
      //如果取消删除，则返回值为字符串cancel
      if (confirmResult !== "confirm") {
        return this.$message({
          showClose: true,
          message: "已取消删除",
          type: "info",
        });
      }
      const { data: res } = await this.$http.post(
        "activity/deleteactivityrecord",
        { arId: id }
      );
      console.log("删除返回信息", res);
      this.getSignDialog(this.activityId);
    },
    signDialogClosed() {
      this.signRecord = [];
    },
    async getSignDialog(id) {
      this.activityId = id;
      const { data: res } = await this.$http.get(
        "activity/getactivityrecord?activityId=" + id
      );
      console.log("报名记录返回信息", res);
      this.signRecord = res.data;
      this.signDialog = true;
    },
    async getAllInts() {
      const { data: res } = await this.$http.get("activity/getactivitymanage");
      console.log("所有分类返回信息", res);
      for (let i of res.data) {
        if (i.amName == "分类") {
          this.ints = i.children;
        }
      }
      console.log("分类表格", this.ints);
    },
    async editAct() {
      this.editForm.activityIntro = this.$refs.editActInforEditor.html;
      const { data: res } = await this.$http.post(
        "activity/updateactivity",
        this.editForm
      );
      console.log("修改活动返回信息", res);
      this.editActDialogVisible = false;
      this.getAllAct();
    },
    editActDialogClosed() {
      this.editForm = {};
      this.$refs.editActInforEditor.html = "";
    },
    showActEditDialog(id) {
      console.log("活动id", id);
      for (let i of this.actInforList) {
        console.log("每次循环对象", i);
        if (i.activityId == id) {
          this.editForm = {
            activityId: i.activityId,
            activityName: i.activityName,
            activityIntro: "",
            activityHost: i.activityHost,
            activityPhone: i.activityPhone,
            activityGroup: i.activityGroup,
            activityLevel: i.activityLevel,
            activityLink: i.activityLink,
            activityWay: i.activityWay,
            activityInterest: i.activityInterest,
            activityTeacherId: i.activityTeacherId,
            activityLoginstarttime: i.activityLoginstarttime,
            activityLoginendtime: i.activityLoginendtime,
            activityDostarttime: i.activityDostarttime,
            activityDoendtime: i.activityDoendtime,
            allnumber: i.allnumber,
          };
          //定时器模拟异步操作
          setTimeout(() => {
            this.$refs.editActInforEditor.html = i.activityIntro;
          });
          this.editActDialogVisible = true;
          console.log("修改活动", this.editForm);
          return;
        }
      }
    },
    async removeActById(id) {
      //弹框提示是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果确认删除，则返回值为字符串confirm
      //如果取消删除，则返回值为字符串cancel
      if (confirmResult !== "confirm") {
        return this.$message({
          showClose: true,
          message: "已取消删除",
          type: "info",
        });
      }
      const { data: res } = await this.$http.post("activity/deleteactivity", {
        activityId: id,
      });
      console.log("删除活动返回信息", res);
      this.getAllAct();
    },
    stateFormat(row, column, cellValue) {
      if (!cellValue) return "";
      if (cellValue.length > 50) {
        //最长固定显示10个字符
        return cellValue.slice(0, 50) + "...";
      }
      return cellValue;
    },
    async getAllAct() {
      const { data: res } = await this.$http.get(
        "activity/getactivity?way=&level=&interest=&query="
      );
      console.log("获取返回信息", res);
      this.actInforList = [];
      for (let i of res.data) {
        if (i.activityTeacherId == this.$store.getters.getUser.userId) {
          this.actInforList.push(i);
        }
      }
    },
  },
};
</script>

<style></style>
