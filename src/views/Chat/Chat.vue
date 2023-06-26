<template>
  <div class="wrapper">
    <el-container v-if="topMsgShow">
      <el-main style="overflow-y: auto; overflow-x: hidden">
        <el-header class="PC-header" height="70px">
          <div class="home-header-pc">
            <span class="home-photo-link" @click="infoMsgShow">
              <div class="home-user-photo">
                <img :src="noIconShow(groupUser, 'group')" />
              </div>
              <span>{{ groupUser.groupName }}</span>
            </span>

            <el-dropdown trigger="click" v-if="showCheckBoxBtn">
              <div class="el-dropdown-link">
                <div class="home-user-more"></div>
              </div>
              <el-dropdown-menu slot="dropdown" class="chat-more">
                <el-dropdown-item>
                  <div class="logout-btn" @click="isMuteDialogShow = true">
                    <img
                      :src="!groupUser.setting.prompt ? muteImg : noMuteImg"
                    />
                    <span>{{
                      !groupUser.setting.prompt ? "开启通知" : "关闭通知"
                    }}</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div
                    class="logout-btn"
                    v-if="groupUser.isAdmin"
                    @click="changeGroupAdminShow"
                  >
                    <img src="./../../../static/images/shield.png" alt="" />
                    <span>转移群主权限</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div class="logout-btn" @click="deleteGroupDialogShow = true">
                    <img src="./../../../static/images/pc/trash.png" alt="" />
                    <span style="color: #ee5253">删除聊天室</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div class="logout-btn" @click="leaveGroupDialogShow = true">
                    <img src="./../../../static/images/pc/logout.png" alt="" />
                    <span style="color: #ee5253">退出群组</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span
              class="el-dropdown close-choose"
              v-else
              @click="closeChooseAction"
              >取消</span
            >
          </div>
        </el-header>
        <el-main
          v-loading="loading"
          element-loading-text="讯息加载中"
          element-loading-background="rgba(255, 255, 255, 0.5)"
        >
          <!-- 置頂訊息 -->
          <div
            class="top-msg"
            v-if="pinMsg !== '' && showCheckBoxBtn && pinDataList.length !== 0"
            @click="goTopMsgShow"
          >
            <div class="top-msg-left">
              <img src="./../../../static/images/pin.png" alt="" />
              <span v-if="pinDataList[0].chatType === 'SRV_GROUP_IMAGE'">
                <img :src="isBase64(pinMsg)" alt="" />
              </span>
              <span v-else>{{ isBase64(pinMsg) }}</span>
            </div>
            <img
              class="top-msg-right"
              src="./../../../static/images/next.png"
              alt=""
            />
          </div>
          <message-pabel
            :messageData="messageData"
            :userInfoData="userInfoData"
            :checkDataList="checkDataList"
            :showCheckBoxBtn="showCheckBoxBtn"
            :historyMsgLength="historyMsgLength"
            @deleteMsgHistoryData="deleteMsgData"
            @checkBoxDisabled="checkBoxDisabled"
            @isCheckDataList="isCheckDataList"
            @resetPinMsg="getPinList"
            @scrollBar="scrollBar"
            @scrollHistory="scrollHistory"
          />
          <div
            class="reply-message"
            v-if="
              replyMsg.clickType === 'replyMsg' ||
              replyMsg.clickType === 'editMsg'
            "
          >
            <template v-if="replyMsg.clickType === 'replyMsg'">
              <div
                :class="{ 'service-icon': replyMsg.isCustomerService }"
              ></div>
              <el-image
                :src="groupIconShow(replyMsg)"
                class="reply-message__style"
              />
            </template>

            <img
              v-if="replyMsg.clickType === 'editMsg'"
              src="./../../../static/images/group_edit.png"
              alt=""
              class="reply-message__style"
            />
            <div class="reply-message-box">
              <span
                >{{ groupName(replyMsg)
                }}<span class="anthor-img"
                  ><span v-if="replyMsg.isAdmin">
                    <img
                      src="./../../../static/images/phone_icon/crown.png"
                      alt=""
                  /></span>
                  <span v-if="replyMsg.isManager">
                    <img
                      src="./../../../static/images/phone_icon/star.png"
                      alt="" /></span></span
              ></span>
              <span v-if="replyMsg.chatType === 'SRV_GROUP_SEND'">{{
                replyMsg.innerText.length > 110
                  ? replyMsg.innerText.substr(0, 110) + " ..."
                  : replyMsg.innerText
              }}</span>
              <span
                v-else-if="replyMsg.chatType === 'SRV_GROUP_IMAGE'"
                class="replyMsg-Img"
              >
                <img :src="replyMsg.innerText" alt="" />
              </span>
              <span v-else-if="replyMsg.chatType === 'SRV_GROUP_AUDIO'"
                >回復語音訊息</span
              >
              <div
                v-else-if="replyMsg.chatType === 'SRV_GROUP_FILE'"
                class="replyMsg-file"
              >
                <span>{{ fileData(replyMsg.innerText, "content") }}</span>
                <span
                  >档案大小　: {{ fileData(replyMsg.fileSize, "size") }}</span
                >
              </div>
            </div>
            <div class="reply-close-btn" @click="closeReplyEdit()">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div
            class="checkbox-btn"
            v-if="!showCheckBoxBtn"
            @click="chooseDeleteAction"
          >
            <img src="./../../../static/images/icon_defalt.svg" alt="" />
            <span>{{
              checkDataList.length === 0
                ? "选择讯息"
                : `已选择${checkDataList.length}则讯息`
            }}</span>
          </div>
          <message-input
            v-else
            :userInfoData="userInfoData"
            :groupData="groupUser"
            :authorityGroupData="authorityGroupData"
            :authority="authority"
          />
        </el-main>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-main style="overflow-y: auto; overflow-x: hidden">
        <el-header class="PC-header" height="70px">
          <div class="home-header-pc">
            <span class="home-photo-link" @click="setTopMsgShow(true)">
              <span
                ><img src="./../../../static/images/pc/arrow-left.png" alt=""
              /></span>
              <span>置顶訊息</span>
            </span>
            <el-dropdown trigger="click">
              <div class="el-dropdown-link">
                <div class="home-user-more"></div>
              </div>
              <el-dropdown-menu slot="dropdown" class="chat-more">
                <el-dropdown-item>
                  <div
                    class="logout-btn"
                    v-if="groupUser.isAdmin"
                    @click="changeGroupAdminShow"
                  >
                    <img src="./../../../static/images/shield.png" alt="" />
                    <span>转移群主权限</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div class="logout-btn" @click="leaveGroupDialogShow = true">
                    <img src="./../../../static/images/pc/trash.png" alt="" />
                    <span style="color: #ee5253">退出群组</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <message-pin :userInfoData="userInfoData" @resetPinMsg="getPinList" />
        <div class="top-msg-bottom" @click="isTopMsgShow = true" v-if="authorityGroupPin(groupUser)">
          <span>取消所有置顶讯息(共 {{ pinDataList.length }} 則)</span>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      title="取消置頂"
      :visible.sync="isTopMsgShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <span>确认是否取消置頂？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-gray" @click="isTopMsgShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="untopMsgAction"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="刪除對話"
      :visible.sync="deleteGroupDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <span>确认是否刪除對話？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="background-gray"
          @click="deleteGroupDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="deleteRecent">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="isChooseDeleteShow"
      class="el-dialog-choose-delete"
      width="100%"
      :modal="false"
      :show-close="false"
      :close-on-click-modal="false"
      :append-to-body="false"
      center
    >
      <div class="loginOut-box">
        <img src="./../../../static/images/warn.png" alt="" />
        <span class="choose-delete-title">刪除所選的訊息？</span>
        <el-button
          type="danger"
          v-show="!allHistoryShow"
          @click="deleteMessage('all')"
          >在所有人对话纪录中删除</el-button
        >
        <el-button type="danger" @click="deleteMessage('only')"
          >只在我的对话纪录中删除</el-button
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="footer-button" @click="isChooseDeleteShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="退出群組"
      :visible.sync="leaveGroupDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <span v-if="groupUser.isAdmin">
          <span>管理者退出將解散群組</span>
          <span>确认是否退出？</span>
        </span>
        <span v-else>确认是否退出群組？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-gray" @click="leaveGroupDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="submitBtn">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="退出群組"
      :visible.sync="isLeaveGroupShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <span>你已不在群組內</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-red" @click="leaveGroupAction"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="`${!groupUser.setting.prompt ? '开启' : '关闭'}通知`"
      :visible.sync="isMuteDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <span
          >确认是否{{
            !groupUser.setting.prompt ? "开启通知" : "关闭通知"
          }}</span
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-gray" @click="isMuteDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="muteAction(groupUser)"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <audio
      id="notify-receive-audio"
      muted="muted"
      src="./../../../static/wav/receive.mp3"
    ></audio>
  </div>
</template>

<script>
import resStatus from '@/constants/resStatus'
import Socket from "@/utils/socket";
import AESBase64 from "@/utils/AESBase64.js";
import {
  pinList,
  deleteRecentChatMul,
  getChatHistory,
  unpinHistory,
  deleteRecentChat,
} from "@/api/chatController";
import { mapState, mapMutations } from "vuex";
import {
  listMember,
  leaveGroup,
  getGroupAuthoritySetting,
  updateGroup,
} from "@/api/groupController";
import { fileBoxName, formatFileSize } from "@/utils/FileSizeName.js";
import { getToken } from "_util/utils.js";
import MessagePabel from "@/components/message-group";
import MessageInput from "@/components/message-group-input";
import MessagePin from "@/components/message-group-pin";
import { showIcon, groupIcon } from "@/utils/icon";
import { removeStorage} from "@/utils/storage";
import { nameTidy } from "@/utils/name";

export default{
  name: "ChatGroupMsg",
  data() {
    return {
      messageData: [],
      userInfoData: {
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
        tokenType: 0,
      },
      pinMsg: "",
      readMsgData: [],
      contactList: [],
      checkDataList: [],
      historyMsgLength: 0,
      loading: false,
      isTopMsgShow: false,
      isScrollbar: false,
      showCheckBoxBtn: true,
      isChooseDeleteShow: false,

      allHistoryShow: false,
      isMuteDialogShow: false,
      isLeaveGroupShow: false,
      deleteGroupDialogShow: false,
      leaveGroupDialogShow: false,
      pinDataList: [],
      muteImg: require("./../../../static/images/pc/bell.png"),
      noMuteImg: require("./../../../static/images/pc/bell-off.png"),
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  watch: {
    topMsgShow(val) {
      val ? this.getChatHistoryMessage() : false;
    },
    messageData(val) {
      val.forEach((data) => {
        this.pinDataList.forEach((list) => {
          if (data.chatType !== "SRV_CHAT_PIN" && (data.historyId === list.historyId)) {
            data.isPing = true;
          }
        });
      });
    },
    checkBoxBtn(val) {
      this.showCheckBoxBtn = val;
    },
    showCheckBoxBtn(val) {
      if (val) this.isChooseDeleteShow = false;
    },
    groupUser() {
      this.messageData = [];
      this.pinMsg = "";
      this.init()
    },
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      groupUser: (state) => state.ws.groupUser,
      hichatNav: (state) => state.ws.hichatNav,
      replyMsg: (state) => state.ws.replyMsg,
      myUserInfo: (state) => state.ws.myUserInfo,
      topMsgShow: (state) => state.ws.topMsgShow,
      contactListData: (state) => state.ws.contactListData,
      authority: (state) => state.ws.authority,
      checkBoxBtn: (state) => state.ws.checkBoxBtn,
      authorityGroupData: (state) => state.ws.authorityGroupData,
    }),
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
      setInfoMsg: "ws/setInfoMsg",
      setChatGroup: "ws/setChatGroup",
      setHichatNav: "ws/setHichatNav",
      setTopMsgShow: "ws/setTopMsgShow",
      setMsgInfoPage: "ws/setMsgInfoPage",
      setAuthority: "ws/setAuthority",
      setAuthorityGroupData: "ws/setAuthorityGroupData",
      setContactListData: "ws/setContactListData",
      setCheckBoxBtn: "ws/setCheckBoxBtn",
    }),
    init(){
      this.getGroupListMember();
      this.getGroupAuthority();
      this.getPinList();
      this.getChatHistoryMessage();
    },
    closeReplyEdit(){
      const roomData = this.groupUser;
      removeStorage(roomData,'editReplay');
      this.$root.closeReplyMessage()
    },
    authorityGroupPin(user) {
      return (
        user.isAdmin ||
        (user.isManager &&
          (this.authority.pin || this.authorityGroupData.pin)) ||
        this.authorityGroupData.pin
      );
    },
    groupIconShow(data) {
      let groupUser = this.groupUser;
      let authority = this.authority;
      let authorityGroupData = this.authorityGroupData;
      return groupIcon(data, { groupUser, authority, authorityGroupData });
    },
    groupName(el) {
      let name = !el.groupNumber ? "未知成员" : el.groupNumber;
      let showGroupNumber = this.authorityGroupData.showGroupNumber;
      let editGroupNickname = this.authorityGroupData.editGroupNickname;
      return nameTidy({name,el,showGroupNumber,editGroupNickname})
    },
    muteAction(item) {
      let params = {
        groupId: item.groupId,
        groupName: item.groupName,
        icon: item.icon,
        setting: {
          prompt: !item.setting.prompt,
        },
      };
      updateGroup(params).then((res) => {
        if (res.code === 200) {
          this.isMuteDialogShow = false;
          this.$message({
            message: !item.setting.prompt ? "开启通知" : "关闭通知",
            type: !item.setting.prompt ? "success" : "warning",
          });
          if (this.groupUser.toChatId === item.toChatId) {
            this.groupUser.setting.prompt = !item.setting.prompt;
            this.setChatGroup(this.groupUser);
          }
          this.$root.getHiChatDataList();
        }
      });
    },
    scrollHistory(val) {
      this.getChatHistoryMessage(val);
    },
    //獲取歷史訊息
    getChatHistoryMessage(data) {
      this.loading = true;
      let params = {
        toChatId: this.groupUser.toChatId,
        historyId: data ? data : "",
        order: 0,
        pageSize: 50,
      };
      getChatHistory(params).then((res) => {
        if (res.code === 200) {
          const historyMsgList = Object.freeze(res.data);
          let myMsg = historyMsgList.filter(msg => msg.chat.fromChatId !== "u" + localStorage.getItem("id")).some(data => !data.isRead)
          if(myMsg) this.readMsgShow(historyMsgList[0]);
          this.historyMsgLength = historyMsgList.length;
          historyMsgList.forEach((el) => {
            this.base64Msg = this.isBase64(el.chat.text);
            el.chat.newContent = this.base64Msg.split(" ");
            this.messageList(el);
            this.messageData.unshift(this.chatRoomMsg);
          });
          this.loading = false;
        }
      });
    },
    //上傳檔案及名稱
    fileData(data, type) {
      if (type === "content") {
        return fileBoxName(data);
      } 
      return formatFileSize(data);
    },
    closeChooseAction() {
      this.showCheckBoxBtn = true;
      this.$root.gotoBottom();
    },
    //勾選訊息
    chooseDeleteAction() {
      if (this.checkDataList.length === 0) {
        this.$message({ message: "請勾選訊息", type: "error" });
        return false;
      } else {
        this.isChooseDeleteShow = true;
      }
    },
    //離開群組
    leaveGroupAction() {
      this.isLeaveGroupShow = false;
      this.$root.getHiChatDataList();
      this.setNavGo("address");
      this.setChatGroup({});
      this.setInfoMsg({ infoMsgShow: false, infoMsgChat: false });
    },
    setNavGo(type) {
      this.setHichatNav({ type: type, num: 1 });
    },
    checkBoxDisabled(data) {
      this.showCheckBoxBtn = data;
      this.setCheckBoxBtn(data);
    },
    isCheckDataList(data) {
      this.checkDataList = data;
      if (
        (this.groupUser.isManager && !this.authority.delUserMessage) ||
        (!this.groupUser.isManager && !this.groupUser.isAdmin)
      ) {
        this.allHistoryShow = this.checkDataList.some(
          (el) => el.userChatId !== "u" + this.myUserInfo.id
        );
      }
    },
    deleteMessage(type) {
      this.historyIdData = [];
      this.checkDataList.forEach((el) => {
        this.historyIdData.push(el.historyId);
      });
      let params = {
        fullDelete: type === "all", // 是否完整删除,搭配historyId
        haveOtherChat: type === "only", // 是否有不是自己的訊息
        historyId: this.historyIdData, // 历史记录ID
        toChatId: this.checkDataList[0].toChatId, // 删除目标ID
      };
      deleteRecentChatMul(params)
        .then((res) => {
          if (res.code === 200) {
            if (res.data.isCompletely) {
              this.$message({ message: "訊息删除成功", type: "success" });
            } else {
              this.$message({ message: "部分訊息無法刪除", type: "warning" });
            }
            this.isChooseDeleteShow = false;
            this.closeChooseAction();
            this.$root.gotoBottom();
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
        });
    },
    getGroupAuthority() {
      let groupId = this.groupUser.groupId;
      getGroupAuthoritySetting({ groupId }).then((res) => {
        if (res.code === 200) {
          if (!res.data) {
            this.authorityGroup = {
              checkUserInfo: true,
              pin: true,
              sendMessage: true,
            };
          } else {
            this.authorityGroup = res.data;
          }
          this.setAuthorityGroupData(this.authorityGroup);
        }
      });
    },
    scrollBar(val) {
      this.isScrollbar = val;
    },
    goTopMsgShow() {
      this.setTopMsgShow(false);
      this.showCheckBoxBtn = true;
    },
    untopMsgAction() {
      let param = {
        toChatId: this.groupUser.toChatId,
      };
      unpinHistory(param).then((res) => {
        if (res.code === 200) {
          this.setTopMsgShow(true);
          this.isTopMsgShow = false;
          this.getPinList();
        }
      });
    },
    deleteMsgData(data) {
      this.messageData = this.messageData.filter((item) => {
        return item.historyId !== data.historyId;
      });
      this.$root.getHiChatDataList();
    },
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    getPinList() {
      let params = {
        toChatId: this.groupUser.toChatId,
        order: 1,
      };
      pinList(params).then((res) => {
        if (res.code === 200) {
          this.pinDataList = res.data;
          this.pinDataList.forEach((list) => {
            this.messageData.forEach((data) => {
              if (data.chatType !== "SRV_CHAT_PIN") {
                if (list.historyId === data.historyId) {
                  data.isPing = true;
                }
              }
            });
          });
          if (this.pinDataList.length !== 0) {
            if (this.pinDataList[0].chatType === "SRV_GROUP_AUDIO") {
              this.pinMsg = "語音訊息";
            } else if (this.pinDataList[0].chatType === "SRV_GROUP_FILE") {
              this.pinMsg = this.fileData(
                this.isBase64(this.pinDataList[0].chat.text),
                "content"
              );
            } else {
              this.pinMsg = this.pinDataList[0].chat.text;
            }
          }
          !this.isScrollbar ? this.$root.gotoBottom() : false;
        }
      });
    },
    getGroupListMember() {
      let groupId = this.groupUser.toChatId.replace("g", "");
      listMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((item) => {
          item.groupNumber = "成员" + item.groupNumber;
          if (item.memberId === this.groupUser.memberId) {
            this.groupUser.isAdmin = item.isAdmin;
            this.groupUser.isBanPost = item.isBanPost;
            this.groupUser.isManager = item.isManager;
            this.groupUser.groupNickname = item.groupNickname;
            this.groupUser.groupNumber = item.groupNumber;
            if (item.memberId === Number(localStorage.getItem("id"))) {
              if (item.isAdmin) {
                localStorage.removeItem("authority");
              } else if (item.isManager) {
                this.setAuthority(item.authority);
              } else if (!item.isAdmin && !item.isManager) {
                localStorage.removeItem("authority");
              }
            }
          }
          if (!item.icon) {
            item.icon = require("./../../../static/images/image_user_defult.png");
          }
        });
        this.setChatGroup(this.groupUser);
        this.setContactListData(this.contactList);
      });
    },
    // 訊息統一格式
    messageList(data) {
      this.chatRoomMsg = {
        chatType: data.chat.chatType,
        historyId: data.chat.historyId,
        message: {
          time: this.$root.formatTimeS(data.chat.sendTime),
          content: data.chat.text,
        },
        isRead: data.isRead,
        userChatId: data.chat.fromChatId,
        toChatId: data.chat.toChatId,
        icon: data.chat.icon,
        isCustomerService: false,
        isAdmin: data.chat.fromChatIsAdmin,
        isManager: data.chat.fromChatIsManager,
        groupNickname: !data.chat.fromChatGroupNickname ? undefined : data.chat.fromChatGroupNickname,
        groupNumber: !data.chat.fromChatGroupNumber ? undefined : "成员" + data.chat.fromChatGroupNumber,
        name: data.chat.fromChatNickname,
        username: data.chat.username,
        newContent: data.chat.newContent,
        isReply: data.replyChat,
        isPing: false,
        fileSize: data.chat.fileSize ? data.chat.fileSize : "",
      };
      this.messageReorganization(this.chatRoomMsg);
    },
    // 訊息過濾比對名稱
    messageReorganization(data) {
      const newItem = this.contactListData.find(item => data.userChatId === "u" + item.memberId)
      const newReply = this.contactListData.find(res => data.isReply && data.isReply.fromChatId === "u" + res.memberId)
      const isReply = data.isReply
      if(newItem) {
        data.icon = newItem.icon;
        data.isCustomerService = newItem.isCustomerService;
      }
      if(isReply){
        data.isReply.icon = newReply.icon;
        data.isReply.isCustomerService = newReply.isCustomerService;
      }
    },
    //判斷是否base64
    isBase64(data) {
      return AESBase64(data, this.aesKey, this.aesIv);
    },
    // 已讀
    readMsgShow(data) {
      let sendReadMessageData = this.userInfoData;
      sendReadMessageData.chatType = "CLI_MSG_READ";
      sendReadMessageData.id = Math.random();
      sendReadMessageData.targetId = data.historyId;
      sendReadMessageData.toChatId = data.toChatId;
      Socket.send(sendReadMessageData);
      this.$root.getHiChatDataList();
    },
    audioAction() {
      let audioEl = document.getElementById("notify-receive-audio");
      const playPromise = audioEl.play();
      if (playPromise) {
        playPromise
          .then((_) => {
            audioEl.src = ""; // 移除src, 防止之后播放空白音频
            setTimeout(() => {
              // 用setTimeout模拟一个2秒的延迟
              audioEl.src = require("./../../../static/wav/receive.mp3");
            }, 150);
          })
          .catch((error) => {
            audioEl.pause();
          });
      }
    },
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        case "SRV_ERROR_MSG":
          let message = resStatus[userInfo.text]
          this.$message({ message: message, type: "error" });
          break;     
        // 发送影片照片讯息成功
        // 发送讯息成功
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
        case "SRV_GROUP_FILE":
        case "SRV_GROUP_JOIN":
        case "SRV_GROUP_DEL":
        case "SRV_CHAT_PIN":
        case "SRV_GROUP_REMOVE_MANAGER_HISTORY":
        case "SRV_GROUP_ADD_MANAGER_HISTORY":
        case "SRV_GROUP_CHANGE_ADMIN_HISTORY":
        case "SRV_CALL_HISTORY": // 播出通話
        case "SRV_CALL_CANCEL_HISTORY": // 語音通話取消訊息
        case "SRV_CALL_NO_RESPONSE_HISTORY": // 通話無回應訊息
        case "SRV_VIDEO_HISTORY": // 播出視訊通話
        case "SRV_VIDEO_CANCEL_HISTORY": // 視訊通話取消訊息
        case "SRV_GROUP_CALL_HISTORY": // 群組播出通話
        case "SRV_GROUP_CALL_FINISH_HISTORY": // 群組結束通話
        case "SRV_GROUP_VIDEO_HISTORY": // 群組播出視訊通話
        case "SRV_GROUP_VIDEO_FINISH_HISTORY": // 群組結束視訊通話
          if (userInfo.chatType === "SRV_GROUP_JOIN") {
            this.getGroupListMember();
          }
          if (this.groupUser.toChatId === userInfo.toChatId) {
            if (userInfo.chat.text) {
              this.base64Msg = this.isBase64(userInfo.chat.text);
              userInfo.chat.newContent = this.base64Msg.split(" ");
            }
            this.messageList(userInfo);
            this.messageData.push(this.chatRoomMsg);
            if (userInfo.chat.fromChatId !== "u" + localStorage.getItem("id")) {
              this.audioAction();
              this.$root.getHiChatDataList();
              this.readMsgShow(userInfo);
            }
          }
          if (userInfo.chatType === "SRV_GROUP_DEL") {
            if (
              userInfo.chat.fromChatId === "u" + this.groupUser.memberId &&
              userInfo.chat.toChatId === this.groupUser.toChatId
            ) {
              this.isLeaveGroupShow = true;
            }
          }

          if (userInfo.chatType === "SRV_CHAT_PIN") {
            this.getPinList();
          }
          break;
        //變更權限
        case "SRV_GROUP_AUTHORITY":
          this.getGroupAuthority();
          break;
        case "SRV_GROUP_MANAGER_AUTHORITY":
        case "SRV_GROUP_ADMIN_CHANGE":
        case "SRV_GROUP_BAN_POST":
          setTimeout(() => {
            this.getGroupListMember();
          }, 500);
          if (userInfo.chatType === "SRV_GROUP_MANAGER_AUTHORITY") {
            this.checkDataList = [];
            this.isChooseDeleteShow = false;
          }
          break;
        // 移除置頂
        case "SRV_CHAT_UNPIN":
          this.messageData.forEach((res) => {
            if (res.historyId === userInfo.replyHistoryId) {
              res.isPing = false;
            }
          });
          this.getPinList();
          break;
        // 已讀
        case "SRV_MSG_READ":
          setTimeout(() => {
            this.messageData.forEach((res) => {
              res.isRead = true;
            });
          }, 500);

          this.$root.getHiChatDataList();
          break;
        // 編輯訊息
        case "SRV_CHAT_EDIT":
          this.messageData.forEach((res) => {
            if (res.historyId === userInfo.historyId) {
              res.message.content = userInfo.chat.text;
              res.newContent = this.isBase64(userInfo.chat.text).split(" ");
            }
          });
          const newData = this.messageData
          
          this.messageData=[]
          this.messageData = newData
          this.$root.getHiChatDataList();
          this.getPinList();
        // 刪除訊息
        case "SRV_CHAT_DEL":
          this.messageData.forEach((res, index) => {
            if (res.historyId === userInfo.targetId) {
              this.messageData.splice(index, 1);
            }
          });
          this.$root.getHiChatDataList();
          this.getPinList();
          break;
        //多選刪除
        case "SRV_CHAT_MUL_DEL":
          this.messageData = this.messageData.filter(
            (item) => !userInfo.targetArray.includes(item.historyId)
          );
          this.checkDataList = this.checkDataList.filter(
            (item) => !userInfo.targetArray.includes(item.historyId)
          );
          this.$root.getHiChatDataList();
          this.getPinList();

          break;
      }
    },
    deleteRecent() {
      let params = {
        fullDelete: true,
        historyId: "",
        toChatId: this.groupUser.toChatId,
      };
      deleteRecentChat(params).then((res) => {
        if (res.code === 200) {
          localStorage.removeItem("groupData");
          this.setNavGo("group");
          this.setChatGroup({});
          this.$root.getHiChatDataList();
        }
      });
    },

    changeGroupAdminShow() {
      this.setMsgInfoPage({ pageShow: false, type: "AdminChange" });
      this.setInfoMsgNavGroup();
    },
    infoMsgShow() {
      this.setMsgInfoPage({ pageShow: true, type: "" });
      this.setInfoMsgNavGroup();
    },
    setInfoMsgNavGroup() {
      this.setInfoMsg({
        infoMsgShow: true,
        infoMsgNav: "GroupPage",
        infoMsgChat: true,
      });
    },
    submitBtn() {
      let groupId = this.groupUser.groupId;
      leaveGroup({ groupId })
        .then((res) => {
          if (res.code === 200) {
            this.leaveGroupDialogShow = false;
            this.setNavGo("group");
            this.setChatGroup({});
          }
        })
        .catch((err) => {
          return false;
        });
    },
  },
  components: {
    MessagePabel,
    MessageInput,
    MessagePin,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 100%;
  width: 100%;
  background-color: #eef7fb;
  overflow: hidden;
  .el-container {
    .el-main {
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      ::v-deep.el-row {
        float: right;
        .el-button {
          background-image: linear-gradient(#579fff, #3481e8);
          color: #ffffff;
        }
        .el-checkbox__inner {
          border-radius: 0;
          border: 1px solid #dcdfe6;
          &::after {
            border: 1px solid #4fba00;
            border-left: 0;
            border-top: 0;
          }
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #ffffff;
        }
        .el-checkbox__label {
          color: #fff;
        }
      }
    }
    .el-aside {
      border-radius: 6px 0px 6px 6px;
    }
    .el-main {
      border-radius: 0px 6px 6px 6px;
    }
    .el-aside {
      background: rgba(235, 233, 232, 0.8);
    }
    .el-main {
      padding: 0;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
    .el-header {
      padding: 0;
      position: relative;
      overflow: hidden;
      .home-header {
        margin: 1.5em 1em 1em 1em;
        display: flex;
        align-items: center;
        .home-user-link {
          position: absolute;
          .home-user {
            width: 2em;
            height: 2em;
            border-radius: 10px;
            background-color: #fff;
            background-image: url("./../../../static/images/back.png");
            background-size: 50%;
            background-position: center;
            background-repeat: no-repeat;
          }
        }
        .home-header-title {
          margin: 0 auto;
          color: #10686e;
          font-weight: 600;
        }
        .home-user-photo,
        .home-user-search {
          width: 2em;
          height: 2em;
          border-radius: 10px;
          background-size: 50%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .home-user-search {
          margin-right: 10px;
          position: absolute;
          right: 50px;
          background-image: url("./../../../static/images/search_icon.png");
        }
        .home-photo-link {
          position: absolute;
          right: 14px;
          .home-user-photo {
            text-align: center;
            overflow: hidden;
            img {
              top: 0;
              height: 2em;
              border-radius: 6px;
            }
          }
        }
      }

      img {
        position: relative;
        top: 7px;
      }
      .online-img {
        position: relative;
        top: 9px;
      }
      .title,
      .icon-message {
        color: #ffffff;
      }
      .icon-message {
        font-size: 20px;
        vertical-align: middle;
      }
      .title {
        display: inline-block;
        margin-left: 5px;
        font-size: 16px;
        letter-spacing: 1px;
      }
    }
    .PC-header {
      position: relative;
      padding: 0;
      background-color: #ffffff;
      display: flex;
      .home-header-pc {
        margin: 1em;
        display: flex;
        align-items: center;
        .home-user-link {
          position: absolute;
          .home-user {
            width: 2em;
            height: 2em;
            border-radius: 10px;
            background-color: #fff;
            background-image: url("./../../../static/images/back.png");
            background-size: 50%;
            background-position: center;
            background-repeat: no-repeat;
          }
        }
        .home-header-title {
          margin: 0 auto;
          color: #10686e;
          font-weight: 600;
        }
        .home-user-photo,
        .home-user-search,
        .home-user-more {
          width: 2em;
          height: 2em;
          border-radius: 10px;
          background-size: 70%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .home-user-search {
          position: absolute;
          right: 70px;
          background-image: url("./../../../static/images/pc/search.png");
          cursor: pointer;
        }
        .home-user-more {
          background-image: url("./../../../static/images/pc/more.png");
          cursor: pointer;
        }
        .home-photo-link {
          position: absolute;
          left: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          .home-user-photo {
            text-align: center;
            overflow: hidden;
            img {
              top: 0;
              width: 2em;
              height: 2em;
              border-radius: 6px;
              width: inherit;
            }
            .service-icon{
              width: 2em;
              height: 2em;
            }
          }
          span {
            font-size: 15px;
            padding-left: 10px;
            font-weight: 600;
          }
        }
      }

      img {
        position: relative;
        top: 7px;
      }
      .online-img {
        position: relative;
        top: 9px;
      }
      .title,
      .icon-message {
        color: #ffffff;
      }
      .icon-message {
        font-size: 20px;
        vertical-align: middle;
      }
      .title {
        display: inline-block;
        margin-left: 5px;
        font-size: 16px;
        letter-spacing: 1px;
      }
    }
    .contact-box {
      background-color: #ffffff;
      width: 100vw;
      ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        height: 3em;
        width: 55vw;
        margin: 0 auto;
        font-weight: 550;
        li {
          &:nth-child(1) {
            color: #ee5253;
          }
          &:nth-child(2) {
            color: #363636;
          }
        }
      }
    }
  }
  .footer {
    position: absolute;
    bottom: -23px;
    right: 0;
    left: 0;
    margin: auto;
    font-size: 13px;
    width: 150px;
    color: #ffffff;
    text-align: center;
    a {
      color: #ffffff;
      &:hover {
        color: #377ec8;
      }
    }
  }
}
.disabled-user,
.checkbox-btn {
  height: 60px;
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  color: #959393;
  align-items: center;
  padding: 0 10px;
  img {
    height: 1.5em;
    margin-left: 5px;
    cursor: pointer;
  }
  span {
    margin: 0 auto;
    color: rgba(0, 0, 0, 0.8);
    letter-spacing: 2px;
  }
}

.top-msg-bottom {
  height: 59px;
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  color: #959393;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}
.top-msg {
  background-color: #ffffff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.01em solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  .top-msg-left {
    display: flex;
    align-items: center;
    img {
      height: 1.5em;
    }
  }
  .top-msg-right {
    height: 1.2em;
  }
}
.close-choose {
  font-size: 16px;
  cursor: pointer;
}
.el-dialog-choose-delete {
  z-index: 2001;
  position: absolute;
  top: 0;
  left: 300px;
  width: 85%;
  height: 100%;
  display: flex;
  flex-direction: row;
  background: rgba(0, 0, 0, 0.6);
  align-items: center;
  ::v-deep.el-dialog {
    margin-top: 0 !important;
    .el-dialog__header {
      padding: 0;
      padding-bottom: 0;
      border-bottom: 0;
    }
    .el-dialog__body {
      padding: 20px 30px 0 30px !important;
      border-bottom: 0;
      text-align: center;
      .loginOut-box {
        background: #ffffff;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        .choose-delete-title {
          color: rgba(0, 0, 0, 0.8);
          margin: 0 0 20px 0;
        }
        img {
          height: 5em;
          margin-bottom: 1.2em;
        }
        .el-button {
          width: 100%;
          padding: 15px 0 !important;
          margin-bottom: 10px;
        }
        .el-button + .el-button {
          margin-left: 0;
        }
      }
    }
    .el-dialog__footer {
      padding: 0 30px 20px 30px;

      .dialog-footer {
        justify-content: center !important;
        .el-button.footer-button {
          width: 100% !important;
          color: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(0, 0, 0, 0.4) !important;
          font-size: 15px;
          padding: 15px 0 !important;
          &:nth-child(1) {
            border-radius: 10px !important;
          }
        }
      }
    }
  }
}
.anthor-img {
  img {
    height: 15px !important;
  }
}

</style>
