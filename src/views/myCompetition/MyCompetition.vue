<template>
  <div style="width: 80%; margin: 10px auto">
    <el-card>
      <el-tabs v-model="activeName" style="padding: 0 20px">
        <el-tab-pane label="我参加的竞赛" name="join">
          <div v-for="item in joinComs" :key="item.comId">
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
                  <span style="font-size: 14px; color: #22bfa7">{{
                    item.comState
                  }}</span>
                  {{ item.comName }}
                </h1>
                <p style="font-size: 14px; color: #aaaaaa">
                  个人状态
                  <span style="font-size: 14px; color: #22bfa7">{{
                    item.state
                  }}</span>
                </p>
                <p style="font-size: 14px; color: #aaaaaa">
                  主办方 {{ item.absComHost }}
                </p>
                <p style="font-size: 14px; color: #aaaaaa">
                  竞赛级别 {{ item.absComLevel }}
                </p>
                <p style="font-size: 14px; color: #aaaaaa; margin: 0">
                  报名时间 {{ item.comLoginstarttime }} ~
                  {{ item.comLoginendtime }}
                </p>
                <p style="font-size: 14px; color: #aaaaaa; margin: 0">
                  比赛时间 {{ item.comDostarttime }} ~ {{ item.comDoendtime }}
                </p>
              </div>
              <div style="float: right; text-align: right">
                <el-button
                  style="
                    background-color: #22bfa7;
                    color: #ffffff;
                    width: 160px;
                    height: 50px;
                  "
                  @click="joinCom(item)"
                  v-if="item.state == '进行中'"
                  >参加比赛</el-button
                >
                <p @click="toComInfor(item)" style="color: #666666">
                  <el-link
                    :underline="false"
                    :class="{ isSignText: item.state != '正在报名' }"
                    >竞赛详情<i class="el-icon-arrow-right"></i
                  ></el-link>
                </p>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我订阅的竞赛" name="subscribe">
          <div v-for="item in subscribeComs" :key="item.comId">
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
                  <span style="font-size: 14px; color: #22bfa7">{{
                    item.state
                  }}</span>
                  {{ item.conInfor.comName }}
                </h1>
                <p style="font-size: 14px; color: #aaaaaa">
                  主办方 {{ item.conInfor.absComHost }}
                </p>
                <p style="font-size: 14px; color: #aaaaaa">
                  竞赛级别 {{ item.conInfor.absComLevel }}
                </p>
                <p style="font-size: 14px; color: #aaaaaa; margin: 0">
                  报名时间 {{ item.conInfor.comLoginstarttime }} ~
                  {{ item.conInfor.comLoginendtime }}
                </p>
                <p style="font-size: 14px; color: #aaaaaa; margin: 0">
                  比赛时间 {{ item.conInfor.comDostarttime }} ~
                  {{ item.conInfor.comDoendtime }}
                </p>
              </div>
              <div style="float: right; text-align: right">
                <el-button
                  style="
                    background-color: #22bfa7;
                    color: #ffffff;
                    width: 160px;
                    height: 50px;
                  "
                  @click="sighUp(item.conInfor)"
                  :disabled="
                    (item.signUpText != '正在报名' &&
                      item.signUpText != '待支付') ||
                    $store.getters.getUser.roleName == '老师' ||
                    $store.getters.getUser.roleName == '管理员'
                  "
                  v-if="item.conInfor.state == '正在报名'"
                  >{{ item.conInfor.signUpText }}</el-button
                >
                <p
                  style="font-size: 14px; color: #666666"
                  v-if="item.conInfor.state == '正在报名' && item.conInfor.remain&gt;=0"
                >
                  距离报名截止还有{{ item.conInfor.remain }}天
                </p>
                <p @click="toComInfor(item.conInfor)" style="color: #666666">
                  <el-link
                    :underline="false"
                    :class="{ isSignText: item.conInfor.state != '正在报名' }"
                    >竞赛详情<i class="el-icon-arrow-right"></i
                  ></el-link>
                </p>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="我发起的竞赛"
          name="post"
          v-if="$store.getters.getUser.roleName == '老师'"
        >
          <el-table
            size="mini"
            :data="postComs"
            border
            stripe
            style="width: 100%; box-sizing: border-box; margin-bottom: 15px"
          >
            <el-table-column
              label="竞赛名称"
              prop="comName"
              width="150"
            ></el-table-column>
            <el-table-column
              label="比赛类型"
              prop="comType"
              width="80"
            ></el-table-column>
            <el-table-column
              label="比赛级别"
              prop="absComLevel"
              width="80"
            ></el-table-column>
            <el-table-column
              label="报名开始时间"
              prop="comLoginstarttime"
              width="100"
            ></el-table-column>
            <el-table-column
              label="报名结束时间"
              prop="comLoginendtime"
              width="100"
            ></el-table-column>
            <el-table-column
              label="比赛开始时间"
              prop="comDostarttime"
              width="100"
            ></el-table-column>
            <el-table-column
              label="比赛结束时间"
              prop="comDoendtime"
              width="100"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 认定评委按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-user"
                  size="mini"
                  @click="openJudge(scope.row)"
                  >评委
                </el-button>
                <!-- 公告管理按钮 -->
                <el-button
                  type="warning"
                  icon="el-icon-folder"
                  size="mini"
                  @click="inAnInfor(scope.row.absComId, scope.row.comId)"
                  >公告
                </el-button>
                <!-- 优秀作品管理按钮 -->
                <el-button
                  type="success"
                  icon="el-icon-crop"
                  size="mini"
                  @click="inWorkList(scope.row.comId)"
                  >优秀作品
                </el-button>
                <!-- 查看所有参赛记录按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit-outline"
                  size="mini"
                  @click="openJoin(scope.row)"
                  >参赛记录
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="我评审的竞赛"
          name="judge"
          v-if="
            $store.getters.getUser.roleName == '老师' &&
            $store.getters.getUser.isjudge == '是'
          "
        >
          <el-table :data="judgeComs" border stripe style="margin-bottom: 15px">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column
              label="竞赛名称"
              prop="comName"
              width="350"
            ></el-table-column>
            <el-table-column
              label="比赛类型"
              prop="comType"
              width="100"
            ></el-table-column>
            <el-table-column
              label="报名开始时间"
              prop="comLoginstarttime"
              width="120"
            ></el-table-column>
            <el-table-column
              label="报名结束时间"
              prop="comLoginendtime"
              width="120"
            ></el-table-column>
            <el-table-column
              label="比赛开始时间"
              prop="comDostarttime"
              width="120"
            ></el-table-column>
            <el-table-column
              label="比赛结束时间"
              prop="comDoendtime"
              width="120"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 查看评审记录按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-user"
                  size="mini"
                  @click="lookForJudge(scope.row)"
                  >评审记录
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 认定评委对话框 -->
    <el-dialog
      title="认定评委"
      :visible.sync="addJudgeDialog"
      width="30%"
      @close="addJudgeDialogClosed"
      append-to-body
    >
      <!-- 内容主体区域 -->
      <el-form :model="addJudgeForm" label-width="100px">
        <el-form-item label="指导老师">
          <el-select
            v-model="addJudgeForm.judgeId"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in teachers"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addJudgeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addJudge">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看参赛记录对话框 -->
    <el-dialog
      title="参赛记录"
      :visible.sync="joinRecordDialog"
      width="80%"
      @close="joinRecordDialogClosed"
      append-to-body
      id="joinRecordDialog"
    >
      <el-table :data="joinRecord" border stripe v-if="comType == '个人赛'">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          label="参赛学生"
          prop="stuName"
          width="80"
        ></el-table-column>
        <el-table-column
          label="报名时间"
          prop="signtime"
          width="100"
        ></el-table-column>
        <el-table-column
          label="比赛状态"
          prop="state"
          width="80"
        ></el-table-column>
        <el-table-column
          label="比赛开始时间"
          prop="starttime"
          width="120"
        ></el-table-column>
        <el-table-column
          label="比赛结束时间"
          prop="endtime"
          width="120"
        ></el-table-column>
        <el-table-column
          label="参赛作品路径"
          prop="filePath"
          width="150"
        ></el-table-column>
        <el-table-column label="评委" prop="judge" width="70"></el-table-column>
        <el-table-column
          label="比赛成绩"
          prop="grade"
          width="80"
        ></el-table-column>
        <el-table-column
          label="得奖情况"
          prop="level"
          width="80"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 下载参赛作品按钮 -->
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              :disabled="scope.row.state != '已完成'"
              @click="downloadPartiWorkById(scope.row.recordId)"
            >
              下载参赛作品
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="joinRecord" border stripe v-else>
        <el-table-column type="index" width="30"></el-table-column>
        <el-table-column
          label="团队名称"
          prop="teamName"
          width="80"
        ></el-table-column>
        <el-table-column
          label="指导老师"
          prop="instruName"
          width="80"
        ></el-table-column>
        <el-table-column
          label="队长"
          prop="capital"
          width="50"
        ></el-table-column>
        <el-table-column
          label="队员"
          prop="stuStr"
          width="50"
        ></el-table-column>
        <el-table-column
          label="报名时间"
          prop="signtime"
          width="80"
        ></el-table-column>
        <el-table-column
          label="比赛状态"
          prop="state"
          width="80"
        ></el-table-column>
        <el-table-column
          label="开始时间"
          prop="starttime"
          width="80"
        ></el-table-column>
        <el-table-column
          label="结束时间"
          prop="endtime"
          width="80"
        ></el-table-column>
        <el-table-column
          label="参赛作品路径"
          prop="filePath"
          width="130"
        ></el-table-column>
        <el-table-column label="评委" prop="judge" width="50"></el-table-column>
        <el-table-column
          label="比赛成绩"
          prop="grade"
          width="80"
        ></el-table-column>
        <el-table-column
          label="得奖情况"
          prop="level"
          width="80"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 下载参赛作品按钮 -->
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              :disabled="scope.row.state != '已完成'"
              @click="downloadPartiWorkById(scope.row.recordId)"
            >
              下载参赛作品
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="joinRecordDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 查看评审记录对话框 -->
    <el-dialog
      title="评审记录"
      :visible.sync="myJudgeDialog"
      width="70%"
      @close="myJudgeDialogClosed"
      append-to-body
    >
      <el-table :data="myJudge" border stripe>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          label="评审记录Id"
          prop="recordId"
          width="100"
        ></el-table-column>
        <el-table-column
          label="开始时间"
          prop="starttime"
          width="120"
        ></el-table-column>
        <el-table-column
          label="结束时间"
          prop="endtime"
          width="120"
        ></el-table-column>
        <el-table-column
          label="比赛状态"
          prop="state"
          width="100"
        ></el-table-column>
        <el-table-column
          label="得分"
          prop="grade"
          width="100"
        ></el-table-column>
        <el-table-column
          label="得奖情况"
          prop="level"
          width="100"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 下载参赛文件按钮 -->
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              :disabled="scope.row.state != '已完成'"
              @click="downloadPartiWorkById(scope.row.recordId)"
              >下载参赛文件
            </el-button>
            <!-- 评审按钮 -->
            <el-button
              type="primary"
              icon="el-icon-user"
              size="mini"
              :disabled="scope.row.state != '已完成'"
              @click="editJudge(scope.row)"
              >打分
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="myJudgeDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 打分对话框 -->
    <el-dialog
      title="打分"
      :visible.sync="judgeDialog"
      width="30%"
      @close="judgeDialogClosed"
      append-to-body
    >
      <!-- 内容主体区域 -->
      <el-form :model="judgeForm" label-width="100px">
        <el-form-item label="分数">
          <el-input v-model="judgeForm.grade"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="judgeDialog = false">取 消</el-button>
        <el-button type="primary" @click="judge">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 优秀作品对话框 -->
    <el-dialog
      title="优秀作品"
      :visible.sync="workDialog"
      width="55%"
      append-to-body
      id="workDialog"
    >
      <el-upload
        class="upload-demo"
        action="#"
        multiple
        :http-request="httpRequest2"
        ref="upload2"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary" id="leftButton"
          >选择添加文件</el-button
        >
        <el-button size="small" type="primary" @click="makeSureUpload1"
          >确定上传</el-button
        >
      </el-upload>

      <!-- 附件表格信息列表 -->
      <el-table :data="excellentWorkList" border stripe>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          label="作品标题"
          prop="fileName"
          width="100"
        ></el-table-column>
        <el-table-column
          label="发表时间"
          prop="fileLoadtime"
          width="140"
        ></el-table-column>
        <el-table-column
          label="文件路径"
          prop="filePath"
          width="220"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="downloadWorkById(scope.row.fileId, scope.row.filePath)"
              >下载文件
            </el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeWorkById(scope.row.fileId)"
            >
              删除文件
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="workDialog = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 公告对话框 -->
    <el-dialog
      title="公告"
      :visible.sync="annDialog"
      width="80%"
      append-to-body
      id="annListDialog"
    >
      <el-button
        type="primary"
        @click="addAnnDialog = true"
        style="margin-bottom: 20px"
        >添加公告</el-button
      >
      <!-- 竞赛公告信息列表 -->
      <el-table :data="announceList" border stripe>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          label="标题"
          prop="noteTitle"
          width="200"
        ></el-table-column>
        <el-table-column
          label="正文"
          prop="distributeText"
          width="350"
        ></el-table-column>
        <el-table-column
          label="发表时间"
          prop="distributeTime"
          width="130"
        ></el-table-column>
        <el-table-column
          label="访问量"
          prop="visitCount"
          width="70"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showAnnEditDialog(scope.row.noteId)"
              >修改
            </el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeAnnById(scope.row.noteId)"
            >
              删除
            </el-button>
            <!-- 返回上一级 -->
            <el-button
              type="warning"
              icon="el-icon-folder"
              size="mini"
              @click="searchAppdix(scope.row.noteId)"
              >查看附件
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="annDialog = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 添加竞赛公告对话框 -->
    <el-dialog
      title="添加竞赛公告"
      :visible.sync="addAnnDialog"
      width="40%"
      @close="addAnnDialogClosed"
      append-to-body
      id="ann"
    >
      <!-- 内容主体区域 -->
      <el-form :model="addAnnForm" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="addAnnForm.noteTitle"></el-input>
        </el-form-item>
        <el-form-item label="正文">
          <Editor ref="myEditor" />
        </el-form-item>
        <el-form-item label="文件">
          <el-upload
            class="upload-demo"
            action="#"
            multiple
            :http-request="httpRequest"
            ref="upload"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAnnDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAnn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改竞赛公告对话框 -->
    <el-dialog
      title="修改竞赛公告"
      :visible.sync="editAnnDialog"
      width="40%"
      @close="editAnnDialogClosed"
      append-to-body
      id="editAnn"
    >
      <!-- 内容主体区域 -->
      <el-form :model="editAnnForm" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="editAnnForm.noteTitle"></el-input>
        </el-form-item>
        <el-form-item label="正文">
          <Editor ref="myEditEditor" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAnnDialog = false">取 消</el-button>
        <el-button type="primary" @click="editAnn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看附件对话框 -->
    <el-dialog
      title="查看附件"
      :visible.sync="appdixDialog"
      width="50%"
      append-to-body
      id="appdixDialog"
    >
      <el-upload
        class="upload-demo"
        action="#"
        multiple
        :http-request="httpRequest1"
        ref="upload1"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary" id="leftButton1"
          >选择添加文件</el-button
        >
        <el-button size="small" type="primary" @click="makeSureUpload"
          >确定上传</el-button
        >
      </el-upload>

      <!-- 附件表格信息列表 -->
      <el-table :data="appdixArray" border stripe>
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column
          label="附件名称"
          prop="appendixName"
          width="110"
        ></el-table-column>
        <el-table-column
          label="附件路径"
          prop="appendixPath"
          width="240"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="success"
              icon="el-icon-download"
              size="mini"
              @click="downloadAppdixById(scope.row.appendixId)"
              >下载附件
            </el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeAppdixById(scope.row.appendixId)"
            >
              删除附件
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="appdixDialog = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Editor from "../../components/Editor.vue";
export default {
  name: "MyCompetition",
  components: { Editor },
  data() {
    return {
      comType: "",
      joinRecordDialog: false,
      joinRecord: [],
      myJudgeDialog: false,
      myJudge: [],
      allComs: [],
      activeName: "subscribe",
      joinComs: [],
      subscribeComs: [],
      postComs: [],
      teachers: [],
      judgeComs: [],
      addJudgeDialog: false,
      addJudgeForm: {
        judgeId: [],
        comId: "",
        fromuser: "",
      },
      //优秀作品
      comId: "",
      excellentWorkList: [],
      workDialog: false,
      exWork: {},
      //公告
      absComId: "",
      noteId: "",
      announceList: [],
      appdixArray: [],
      annDialog: false,
      addAnnDialog: false,
      //添加竞赛公告对话框表单
      addAnnForm: {
        noteTitle: "",
      },
      //修改公告对话框
      editAnnForm: {
        noteTitle: "",
      },
      editAnnDialog: false,
      appdixDialog: false,
      addAppdix: {},
      //评审
      judgeDialog: false,
      judgeForm: {
        grade: "",
      },
      judgeComId: "",
    };
  },
  created() {
    this.getAllComConInfor();
    this.getMyJoinComs();
    this.getMypostComs();
    if (this.$store.getters.getUser.isjudge == "是") this.getMyJudgeComs();
    this.getAllTeachers();
  },
  methods: {
    async judge() {
      const { data: res } = await this.$http.post(
        "process/givegrade",
        this.judgeForm
      );
      console.log("打分返回信息", res);
      this.judgeDialog = false;
      this.getMyJudgeComs();
    },
    judgeDialogClosed() {
      this.judgeForm = { grade: "" };
    },
    //删除某个附件且同步附件表格
    async removeAppdixById(id) {
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
      const { data: res } = await this.$http.post("note/deleteappendix", {
        appendixId: id,
      });
      this.inAnInfor(this.absComId, this.comId);
    },
    //根据附件id下载附件
    downloadAppdixById(id) {
      var download = document.createElement("a");
      download.setAttribute(
        "href",
        "https://4wr6987968.yicp.fun/note/downloadappendix?appendixId=" + id
      );
      download.click();
    },
    //确认上传文件
    async makeSureUpload() {
      this.$refs.upload1.submit();
      let fd = new FormData();
      // 将data转换为form-data
      for (let i in this.addAppdix) {
        fd.append(i, this.addAppdix[i]);
      }
      fd.append("noteId", this.noteId);

      const { data: res } = await this.$http.post("note/addappendix", fd);
      //更新列表
      this.inAnInfor(this.absComId, this.comId);
    },
    //文件上传自定义1
    httpRequest1(param) {
      this.addAppdix.file = param.file;
    },
    //展示某个公告的附件列表
    searchAppdix(id) {
      for (let ann of this.announceList) {
        if (ann.noteId == id) {
          this.appdixArray = ann.appendix;
        }
        this.noteId = id;
        this.appdixDialog = true;
        return;
      }
    },
    //删除公告信息
    async removeAnnById(id) {
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
      const { data: res } = await this.$http.post("note/deletenote", {
        noteId: id,
      });
      this.inAnInfor(this.absComId, this.comId);
    },
    //提交修改公告
    async editAnn() {
      const { data: res } = await this.$http.post("note/updatenote", {
        noteId: this.editAnnForm.noteId,
        noteTitle: this.editAnnForm.noteTitle,
        distributeText: this.$refs.myEditEditor.html,
      });
      this.editAnnDialog = false;
      this.inAnInfor(this.absComId, this.comId);
    },
    //修改对话框关闭
    editAnnDialogClosed() {
      this.$refs.myEditEditor.html = "";
      this.editAnnForm = {
        noteTitle: "",
      };
    },
    //打开修改公告对话框
    showAnnEditDialog(id) {
      for (let note of this.announceList) {
        if (note.noteId == id) {
          this.editAnnForm = {
            noteId: id,
            noteTitle: note.noteTitle,
          };
          //定时器模拟异步操作
          setTimeout(() => {
            this.$refs.myEditEditor.html = note.distributeText;
          });
          this.editAnnDialog = true;
          return;
        }
      }
    },
    //添加竞赛公告
    async addAnn() {
      this.$refs.upload.submit();
      let fd = new FormData();
      // 将data转换为form-data
      for (let i in this.addAnnForm) {
        fd.append(i, this.addAnnForm[i]);
      }
      fd.append("absComId", this.absComId);
      fd.append("comId", this.comId);
      fd.append("distributeText", this.$refs.myEditor.html);
      console.log("添加公告参数", fd);

      const { data: res } = await this.$http.post("note/addnote", fd);
      console.log("添加公告信息返回信息", res);

      this.addAnnDialog = false;
      this.inAnInfor(this.absComId, this.comId);
    },
    //文件上传自定义方法
    httpRequest(param) {
      this.addAnnForm.file = param.file;
    },
    //添加竞赛公告对话框关闭
    addAnnDialogClosed() {
      this.$refs.myEditor.html = "";
      this.addAnnForm = {
        noteTitle: "",
      };
    },
    //查看竞赛公告列表
    async inAnInfor(id, id2) {
      const { data: res } = await this.$http.get("note/getnote?absComId=" + id);
      this.announceList = res.data;
      console.log("获取公告列表", this.announceList);
      if (this.noteId) {
        for (let note of this.announceList) {
          if (note.noteId == this.noteId) {
            this.appdixArray = note.appendix;
            return;
          }
        }
      }
      this.absComId = id;
      this.comId = id2;
      this.annDialog = true;
    },
    //删除优秀作品并同步表格
    async removeWorkById(id) {
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
      const { data: res } = await this.$http.post("competition/deleteitem", {
        fileId: id,
      });
      this.inWorkList(this.comId);
    },
    //下载优秀作品
    downloadWorkById(id) {
      var download = document.createElement("a");
      download.setAttribute(
        "href",
        "https://4wr6987968.yicp.fun/competition/downloaditem?fileId=" + id
      );
      download.click();
    },
    //上传优秀作品
    async makeSureUpload1() {
      this.$refs.upload2.submit();
      let fd = new FormData();
      // 将data转换为form-data
      for (let i in this.exWork) {
        fd.append(i, this.exWork[i]);
      }
      fd.append("comId", this.comId);

      const { data: res } = await this.$http.post("competition/uploaditem", fd);
      //更新列表
      this.inWorkList(this.comId);
    },
    httpRequest2(param) {
      this.exWork.file = param.file;
    },
    //查看优秀作品列表
    async inWorkList(id) {
      const { data: res } = await this.$http.get(
        "competition/getiteminfo?comId=" + id
      );
      this.comId = id;
      this.excellentWorkList = res.data;
      this.workDialog = true;
    },
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
      this.$router.push("/comInfor");
      this.$emit("changeInd");
    },
    //下载参赛作品
    downloadPartiWorkById(id) {
      var download = document.createElement("a");
      download.setAttribute(
        "href",
        "https://4wr6987968.yicp.fun/competition/downloadrecord?recordId=" + id
      );
      download.click();
    },
    joinRecordDialogClosed() {
      this.joinRecord = [];
    },
    //查看所有参赛记录
    async openJoin(com) {
      this.comType = com.comType;
      const { data: res } = await this.$http.get(
        "competition/getrecord?comId=" + com.comId
      );
      this.joinRecord = res.data;
      console.log("参赛记录", this.joinRecord);
      this.joinRecordDialog = true;
    },
    editJudge(item) {
      this.judgeForm.recordId = item.recordId;
      this.judgeDialog = true;
    },
    //评审记录对话框关闭
    myJudgeDialogClosed() {
      this.myJudge = [];
    },
    //查看评审记录
    lookForJudge(com) {
      this.myJudge = com.myjudge;
      this.judgeComId = com.comId;
      console.log("我的评审记录", this.myJudge);
      this.myJudgeDialog = true;
    },
    //打开认定评委对话框
    async openJudge(com) {
      this.addJudgeForm.comId = com.comId;
      this.addJudgeForm.fromuser = com.absComHost;
      const { data: res } = await this.$http.get(
        "process/getjudge?comId=" + com.comId
      );
      this.addJudgeForm.judgeId = res.idArray;
      this.addJudgeDialog = true;
    },
    //认定评委
    async addJudge() {
      const { data: res } = await this.$http.post(
        "process/appointedjudge",
        this.addJudgeForm
      );
      this.addJudgeDialog = false;
    },
    //认定评委对话框关闭
    addJudgeDialogClosed() {
      this.addJudgeForm = {
        judgeId: [],
        comId: "",
        fromuser: "",
      };
    },
    //获取所有老师
    async getAllTeachers() {
      const { data: res } = await this.$http.get("user/getteacher");
      this.teachers = res.data;
      // for (let i = 0; i < this.teachers.length; i++) {
      //   if (this.teachers[i].userId == this.$store.getters.getUser.userId) {
      //     this.teachers.splice(i, 1);
      //     break;
      //   }
      // }
    },
    //参加比赛界面
    joinCom(item) {
      this.$store.dispatch("asyncUpdateRecord", item);
      this.$router.push("/joinCompetition");
      this.$emit("changeInd");
    },
    //报名
    sighUp(competition) {
      this.$store.dispatch("asyncUpdateCompetition", competition);
      if (competition.comType == "个人赛") {
        this.$router.push("/personalSignUp");
      } else {
        this.$router.push("/teamSignUp");
      }
      this.$emit("changeInd");
    },
    //获取竞赛详情信息
    toComInfor(competition) {
      competition.comLoginstarttime = competition.comLoginstarttime.substr(
        0,
        10
      );
      competition.comLoginendtime = competition.comLoginstarttime.substr(0, 10);
      competition.comDostarttime = competition.comLoginstarttime.substr(0, 10);
      competition.comDoendtime = competition.comLoginstarttime.substr(0, 10);
      this.$store.dispatch("asyncUpdateCompetition", competition);
      this.$router.push("/comInfor");
      this.$emit("changeInd");
    },
    //获取所有竞赛信息
    async getAllComConInfor() {
      const { data: res } = await this.$http.get(
        "competition/getcompetitionbysubjectandlevel?subjectId=&level="
      );
      this.allComs = res.data;
      this.getMySubscribeComs();
    },
    //获取我参加的竞赛
    async getMyJoinComs() {
      const { data: res } = await this.$http.get(
        "competition/getmyparticipant?userId=" +
          this.$store.getters.getUser.userId
      );
      this.joinComs = res.data;
    },
    //获取我订阅的竞赛
    async getMySubscribeComs() {
      const { data: res } = await this.$http.get(
        "note/getsub?userId=" + this.$store.getters.getUser.userId
      );
      this.subscribeComs = res.data;
      this.getConInfor();
    },
    //匹配竞赛列表和订阅竞赛列表
    getConInfor() {
      for (let subCom of this.subscribeComs) {
        const comId = subCom.comId;
        for (let com of this.allComs) {
          if (comId == com.comId) {
            subCom.conInfor = com;
            subCom.conInfor.isSub = "已订阅";
          }
        }
        if (subCom.conInfor.state == "正在报名") {
          if (this.$store.getters.getUser.userId == undefined) {
            subCom.conInfor.signUpText = "报名请登录";
            continue;
          } else {
            for (let joinCom of this.joinComs) {
              if (joinCom.comId == comp.comId) {
                if (joinCom.state == "待支付") {
                  comp.signUpText = "待支付";
                  break;
                } else {
                  comp.signUpText = "已报名";
                  break;
                }
              }
            }
          }
        }
        if (subCom.conInfor.signUpText == undefined)
          subCom.conInfor.signUpText = subCom.conInfor.state;
      }
    },
    //获取我发起的竞赛
    async getMypostComs() {
      const { data: res } = await this.$http.get(
        "competition/getmypost?userId=" + this.$store.getters.getUser.userId
      );
      this.postComs = res.data;
      console.log("我发起的竞赛", this.postComs);
    },
    //获取我评审的竞赛
    async getMyJudgeComs() {
      const { data: res } = await this.$http.post("process/assignitem", {
        userId: this.$store.getters.getUser.userId,
      });
      this.getMyJudgeComs2();
    },
    async getMyJudgeComs2() {
      const { data: res } = await this.$http.get(
        "process/getmyjudge?userId=" + this.$store.getters.getUser.userId
      );
      this.judgeComs = res.data;
      if (this.judgeComId != "") {
        for (let com of this.judgeComs) {
          if (this.judgeComId == com.comId) {
            this.myJudge = com.myjudge;
            break;
          }
        }
      }
      console.log("我评审的竞赛", this.judgeComs);
    },
  },
};
</script>

<style scoped>
.isSignText {
  font-size: 22px;
}

#workDialog .upload-demo {
  margin-bottom: 15px;
}
#workDialog /deep/ .el-dialog__body {
  padding: 10px 20px;
}
#leftButton {
  margin-right: 10px;
}
#leftButton1 {
  margin-right: 10px;
}

#ann .el-dialog__body {
  padding: 5px 40px 0 0;
}
#ann .el-form-item {
  margin-bottom: 5px;
}
#editAnn /deep/ .el-dialog__body {
  padding: 5px 40px 5px 0;
}
#editAnn .el-form-item {
  margin-bottom: 5px;
}
#appdixDialog .upload-demo {
  margin-bottom: 15px;
}
#appdixDialog /deep/ .el-dialog__body {
  padding: 5px 15px;
}
#annListDialog /deep/ .el-dialog__body {
  padding: 5px 15px;
}

#joinRecordDialog /deep/ .el-dialog__body {
  padding: 10px 20px;
}
</style>
