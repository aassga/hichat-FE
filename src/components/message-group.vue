<template>
  <div class="message-pabel-box" @touchmove="$root.handleTouch" v-debounce="scrollHistoryBar">
    <ul class="message-styles-box">
      <div v-for="(item, index) in reversedMessage" :key="index">
        <div class="now-time">
          <span>{{ index }}</span>
        </div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="(el, index) in item" :key="el.historyId" :label="el"
            :disabled="showCheckBtn(checkBoxDisabled, el)" :class="judgeClass(item[index])">
            <li>
              <template v-if="srvData.includes(el.chatType)">
                <div :class="{ 'service-icon': el.isCustomerService }"></div>
                <img class="message-avatar" :src="groupIconShow(el)" @click="tagAction(el)" />
                <p :class="[
                  {
                    'reply-Audio':
                      el.isReply &&
                      el.isReply.chatType === 'SRV_GROUP_AUDIO' &&
                      device === 'mobile'
                  },
                  {
                    'reply': el.isReply,
                  },
                ]" :id="el.historyId">
                  <span v-if="el.chatType === 'SRV_GROUP_SEND'" class="message-classic" @contextmenu.prevent.stop="
                    checkBoxDisabled ? onContextmenu(el) : false
                    " @dblclick="replyMsgClick(el, 'replyMsg')">
                    <div class="message-box">
                      <div class="message-name" :style="IsURL(isBase64(el.message.content))
                          ? 'padding-right:36px'
                          : ''
                        ">
                        {{ groupName(el) }}
                        <span class="anthor-img"><span v-if="el.isAdmin">
                            <img src="./../../static/images/phone_icon/crown.png" alt="" /></span>
                          <span v-if="el.isManager">
                            <img src="./../../static/images/phone_icon/star.png" alt="" /></span></span>
                      </div>
                      <template v-if="el.isReply">
                        <div class="reply-box" @click="goAnchor(el.isReply.historyId)">
                          <div class="reply-img">
                            <div :class="{ 'service-icon': el.isReply.isCustomerService }"></div>
                            <img :src="groupIconShow(el.isReply)" alt="" />
                          </div>
                          <div class="reply-msg">
                            <div style="color: rgba(0, 0, 0, 0.4)">
                              {{ replyName(el.isReply) }}
                              <span class="anthor-img"><span v-if="el.isReply.fromChatIsAdmin">
                                  <img src="./../../static/images/phone_icon/crown.png" alt="" /></span>
                                <span v-if="el.isReply.fromChatIsManager">
                                  <img src="./../../static/images/phone_icon/star.png" alt="" /></span></span>
                            </div>
                            <div>
                              <div class="goAnchor-box">
                                <span v-if="el.isReply.chatType === 'SRV_GROUP_SEND'
                                  " class="goAnchor">{{ isBase64(el.isReply.text) }}</span>
                                <img v-else-if="el.isReply.chatType === 'SRV_GROUP_IMAGE'
                                  " :src="isBase64(el.isReply.text)" style="border-radius: 5px" />
                                <span v-else-if="el.isReply.chatType === 'SRV_GROUP_AUDIO'
                                  ">
                                  <div class="reply-audio-box"></div>
                                  <!-- <mini-audio
                                    :audio-source="isBase64(el.isReply.text)"
                                  ></mini-audio> -->
                                  <audio controls="controls" class="user-audio">
                                    <source :src="isBase64(el.isReply.text)" type="audio/mpeg">
                                  </audio>
                                </span>
                                <div v-else-if="el.isReply.chatType === 'SRV_GROUP_FILE'
                                  " class="message-file-box" id="file-download">
                                  <div class="file-message" style="padding-left: 0">
                                    <span>{{
                                      fileData(
                                        isBase64(el.isReply.text),
                                        "content"
                                      )
                                    }}</span>
                                    <span>档案大小　:
                                      {{
                                        fileData(el.isReply.fileSize, "size")
                                      }}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>

                      <div :class="[
                            {
                              'reply-content': el.isReply,
                            },
                            { 'mobile-message-box': device === 'mobile' },
                          ]">
                        <span v-for="(item, index) in el.newContent" :key="index" :class="{
                          'message-touch-carte':
                            item.startsWith('@') && item.length > 1,
                        }">
                          <template v-if="device === 'pc'">
                            <vue-markdown :anchor-attributes="linkAttrs"
                              v-html="calloutTextAreaConvert(item)"></vue-markdown>
                          </template>
                          <template v-else>
                            <!-- 手机版-对话Section -->
                            <div v-if="!IsURL(item)" @click.prevent.stop="
                              checkBoxDisabled ? onContextmenu(el) : false
                              ">
                              <!--全形空白替换成半型-->
                              <div v-for="(text, idx) in item.replace(/\u3000/g, ' ').split('\n').filter(str => !!str)"
                                :key="`${idx}_${text}`">
                                <vue-markdown :anchor-attributes="linkAttrs">
                                  {{ calloutTextAreaConvert(text) }}
                                </vue-markdown>
                              </div>
                            </div>
                            <div v-else-if="IsURL(item)">
                              <div class="images-more-btn" style="top: 5px" @click.prevent.stop="
                                device === 'mobile' && checkBoxDisabled
                                  ? onContextmenu(el)
                                  : false
                                ">
                                <i class="el-icon-more"></i>
                              </div>
                              <!--全形空白替换成半型-->
                              <div v-for="(text, idx) in item.replace(/\u3000/g, ' ').split('\n').filter(str => !!str)"
                                :key="`${idx}_${text}`">
                                <vue-markdown class="link-style" :anchor-attributes="linkAttrs">
                                  {{ text }}
                                </vue-markdown>
                              </div>

                            </div>
                            <span v-else> {{ calloutTextAreaConvert(item) }}</span>
                          </template>
                        </span>
                      </div>
                    </div>
                  </span>
                  <span class="message-classic" v-else-if="el.chatType === 'SRV_GROUP_FILE'" @contextmenu.prevent.stop="
                    checkBoxDisabled ? onContextmenu(el) : false
                    " @dblclick="replyMsgClick(el, 'replyMsg')" @click.prevent.stop="
    device === 'mobile' && checkBoxDisabled
      ? onContextmenu(el)
      : false
    ">
                    <div class="message-box">
                      <div class="message-name" style="padding: 0 0 10px 0">
                        {{ groupName(el) }}
                        <span class="anthor-img"><span v-if="el.isAdmin">
                            <img src="./../../static/images/phone_icon/crown.png" alt="" /></span>
                          <span v-if="el.isManager">
                            <img src="./../../static/images/phone_icon/star.png" alt="" /></span></span>
                      </div>
                      <div class="message-file-box" id="file-download">
                        <div class="file-box"></div>
                        <div class="file-message">
                          <span>{{
                            fileData(isBase64(el.message.content), "content")
                          }}</span>
                          <span>档案大小　:
                            {{ fileData(el.fileSize, "size") }}</span>
                        </div>
                      </div>
                    </div>
                  </span>
                  <span class="message-audio" v-else-if="el.chatType === 'SRV_GROUP_AUDIO'" @contextmenu.prevent.stop="
                    checkBoxDisabled ? onContextmenu(el) : false
                    " @dblclick="replyMsgClick(el, 'replyMsg')">
                    <div class="message-box">
                      <div class="message-name">
                        {{ groupName(el) }}
                        <span class="anthor-img"><span v-if="el.isAdmin">
                            <img src="./../../static/images/phone_icon/crown.png" alt="" /></span>
                          <span v-if="el.isManager">
                            <img src="./../../static/images/phone_icon/star.png" alt="" /></span></span>
                      </div>
                      <div v-if="device === 'mobile'" class="images-more-btn" @click.prevent.stop="
                        device === 'mobile' && checkBoxDisabled
                          ? onContextmenu(el)
                          : false
                        ">
                        <i class="el-icon-more"></i>
                      </div>
                      <!-- <mini-audio
                        :audio-source="isBase64(el.message.content)"
                      ></mini-audio> -->
                      <audio controls="controls" class="user-audio">
                        <source :src="isBase64(el.message.content)" type="audio/mpeg">
                      </audio>
                    </div>
                  </span>
                  <span class="message-image" v-else-if="el.chatType === 'SRV_GROUP_IMAGE'" @contextmenu.prevent.stop="
                    checkBoxDisabled ? onContextmenu(el) : false
                    " @dblclick="replyMsgClick(el, 'replyMsg')">
                    <div class="message-box">
                      <div class="message-name" style="padding-right: 36px">
                        {{ groupName(el) }}
                        <span class="anthor-img"><span v-if="el.isAdmin">
                            <img src="./../../static/images/phone_icon/crown.png" alt="" /></span>
                          <span v-if="el.isManager">
                            <img src="./../../static/images/phone_icon/star.png" alt="" /></span></span>
                      </div>
                      <div v-if="device === 'mobile'" class="images-more-btn" @click.prevent.stop="
                        device === 'mobile' && checkBoxDisabled
                          ? onContextmenu(el)
                          : false
                        ">
                        <i class="el-icon-more"></i>
                      </div>
                      <el-image :src="isBase64(el.message.content)"
                        :preview-src-list="[isBase64(el.message.content)]"></el-image>
                    </div>
                  </span>

                  <span class="nickname-time">{{
                    $root.formatTimeSecound(el.message.time)
                  }}</span>
                </p>

                <div class="read-check-box">
                  <span class="read-check" v-if="el.isRead"><img src="./../../static/images/check.png" alt="" /></span>
                  <span class="read-check2"><img src="./../../static/images/check.png" alt="" /></span>
                </div>
              </template>
              <div v-else-if="otherDataType.includes(el.chatType)" class="top-msg-style">
                <span>{{ filterChatType(el) }}</span>
              </div>
            </li>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </ul>
    <div style="width: 90%; text-align: right">
      <el-button class="scroll-bottom-btn" v-show="showScrollBar" size="medium" icon="el-icon-arrow-down" circle
        @click="$root.gotoBottom()"></el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { copyPaste } from "@/utils/urlCopy.js";
import {
  pinHistory,
  unpinHistory,
  deleteRecentChat,
} from "@/api/chatController";
import { fileBoxName, formatFileSize } from "@/utils/FileSizeName.js";
import { saveAs } from "file-saver";
import { unique } from "@/utils/unique";
import AESBase64 from "@/utils/AESBase64.js";
import VueMarkdown from "vue-markdown";
import voiceStatus from "@/utils/voiceStatus";
import { groupIcon } from "@/utils/icon";
import { audioPlay,removeAudioPlay } from "@/utils/audio";
import { setStorage, getStorage } from "@/utils/storage";
import { nameTidy, nameTidy2 } from "@/utils/name";

export default {
  name: "MessagePabel",
  props: {
    userInfoData: {
      type: Object,
    },
    messageData: {
      type: Array,
    },
    showCheckBoxBtn: {
      type: Boolean,
    },
    checkDataList: {
      type: Array,
    },
    historyMsgLength: {
      type: Number,
    },
  },
  data() {
    return {
      srvData: [
        "SRV_GROUP_SEND",
        "SRV_GROUP_FILE",
        "SRV_GROUP_AUDIO",
        "SRV_GROUP_IMAGE",
      ],
      otherDataType: [
        "SRV_CHAT_PIN",
        "SRV_GROUP_DEL",
        "SRV_GROUP_JOIN",
        "SRV_GROUP_ADD_MANAGER_HISTORY",
        "SRV_GROUP_REMOVE_MANAGER_HISTORY",
        "SRV_GROUP_CHANGE_ADMIN_HISTORY",
        "SRV_GROUP_CALL_HISTORY", // 群組播出通話
        "SRV_GROUP_CALL_FINISH_HISTORY", // 群組結束通話
        "SRV_GROUP_VIDEO_HISTORY", // 群組播出視訊通話
        "SRV_GROUP_VIDEO_FINISH_HISTORY", // 群組結束視訊通話
      ],
      newArr: [],
      newData: [],
      message: [],
      fileList: [],
      checkList: [],
      tagList: [],
      textArea: "",
      newMessageData: {},
      checkBoxDisabled: true,
      isChatTop: false,
      fullscreenLoading: false,
      device: localStorage.getItem("device"),
      showScrollBar: false,
      linkAttrs: {
        target: "_blank",
        class: "linkified",
      },
      device: localStorage.getItem("device"),
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  created() {
    // this.getGroupAuthority();
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      authority: (state) => state.ws.authority,
      myUserInfo: (state) => state.ws.myUserInfo,
      tapDataList: (state) => state.ws.tapDataList,
      contactListData: (state) => state.ws.contactListData,
      goAnchorMessage: (state) => state.ws.goAnchorMessage,
      authorityGroupData: (state) => state.ws.authorityGroupData,
    }),
    reversedMessage: function () {
      this.newMessageData = {};
      //去除重复
      this.message = unique(this.messageData, "historyId");
      this.message.forEach((el) => {
        // el.message.content = this.wrapToBr(el.message.content)
        this.newMessageData[this.$root.formatTimeDay(el.message.time)] = [];
      });

      for (let item in this.newMessageData) {
        this.newMessageData[item] = this.message.filter((res) => {
          return item === this.$root.formatTimeDay(res.message.time);
        });
      }
      if (!this.showScrollBar) this.$root.gotoBottom();
      return this.newMessageData;
    },
  },
  watch: {
    showCheckBoxBtn(val) {
      this.checkBoxDisabled = val;
    },
    checkList(val) {
      this.$emit("isCheckDataList", val);
    },
    checkDataList(val) {
      this.checkList = val;
    },
    groupUser() {
      this.textArea = "";
      this.tagList = [];
      this.$root.gotoBottom();
      this.getStorageTextArea();
    },
    tapDataList(val) {
      if (!val.textArea) {
        this.textArea = "";
        this.tagList = [];
      } else {
        this.textArea = val.textArea;
      }
    },
  },
  mounted() {
    this.goAnchorHistoryId()
    this.getStorageTextArea();
    setTimeout(() => {
      audioPlay()
    }, 1000);
  },
  beforeDestroy() {
    removeAudioPlay()
  },
  methods: {
    ...mapMutations({
      setEditMsg: "ws/setEditMsg",
      setReplyMsg: "ws/setReplyMsg",
      setTapDataList: "ws/setTapDataList",
      setGoAnchorMessage: "ws/setGoAnchorMessage",
    }),
    wrapToBr(textArea) {
      let string = textArea
      try {
        string = string.replace(/\r\n/g, "<br>");
        string = string.replace(/\n/g, "<br>");
        string = string.replace(/\r/g, "<br>");
      } catch (e) {
        console.log(e.message)
      }
      return string
    },
    goAnchorHistoryId() {
      if (this.goAnchorMessage.historyId) {
        setTimeout(() => {
          this.goAnchor(this.goAnchorMessage.historyId);
          this.setGoAnchorMessage({});
        }, 3000);
      }
    },
    tagAction(item) {
      this.textArea = this.textArea + "@" + this.groupName(item) + " ";
      this.tapDataList.tapData.push(item.userChatId);
      let tapParams = {
        textArea: this.textArea,
        tapData: this.tapDataList.tapData,
      };
      this.setTapDataList(tapParams);
    },
    groupIconShow(data) {
      let groupUser = this.groupUser;
      let authority = this.authority;
      let authorityGroupData = this.authorityGroupData;
      return groupIcon(data, { groupUser, authority, authorityGroupData });
    },

    replyName(el) {
      let name = !el.fromChatGroupNumber
        ? "未知成员"
        : "成员" + el.fromChatGroupNumber;
      let showGroupNumber = this.authorityGroupData.showGroupNumber;
      let editGroupNickname = this.authorityGroupData.editGroupNickname;
      return nameTidy2({ name, el, showGroupNumber, editGroupNickname })
    },
    groupName(el) {
      let name = !el.groupNumber ? "未知成员" : el.groupNumber;
      let showGroupNumber = this.authorityGroupData.showGroupNumber;
      let editGroupNickname = this.authorityGroupData.editGroupNickname;
      return nameTidy({ name, el, showGroupNumber, editGroupNickname })
    },
    filterChatType(el) {
      let type = el.chatType;
      if (voiceStatus.includes(type)) {
        return "网页版不支援通话功能，请至APP中进行操作。";
      } else {
        const authority =
          this.authorityGroupData.showGroupNumber &&
          !this.authorityGroupData.editGroupNickname;
        const typeData = {
          "SRV_CHAT_PIN": this.pinUserName(el) + "置顶了一則訊息",
          "SRV_GROUP_DEL": this.pinUserName(el) + "離開了聊天室",
          "SRV_GROUP_JOIN": this.pinUserName(el) + "加入了聊天室",
          "SRV_GROUP_ADD_MANAGER_HISTORY": this.pinUserName(el) + "已被指定为管理员",
          "SRV_GROUP_REMOVE_MANAGER_HISTORY": this.pinUserName(el) + "已被解除管理员身份",
          "SRV_GROUP_CHANGE_ADMIN_HISTORY": authority ? "群主已变更" : "群主变更为" + this.pinUserName(el)
        };
        return typeData[type];
      }
    },
    scrollHistoryBar() {
      let scrollTop = document.querySelector(".message-pabel-box");
      if (scrollTop) {
        this.showScrollBar = !(
          scrollTop.scrollHeight - scrollTop.scrollTop - 1 <=
          scrollTop.clientHeight
        );
        if (scrollTop.scrollTop < 378 && this.historyMsgLength === 50) {
          this.$emit("scrollHistory", this.message[0].historyId);
        }
        this.$emit("scrollBar", this.showScrollBar);
      }
    },
    calloutTextAreaConvert(data) {
      // const newData = this.wrapToBr(data)
      if (!data.match("@") || ["@所有成员", "@所有成员"].includes(data)) {
        return data;
      } else {
        this.newArr = this.contactListData.find((el) => {
          return "@" + el.memberId + "\u200B" === data;
        });
        if (this.newArr) {
          return (data = "@" + this.newArr.name);
        }
        return data;
      }
    },
    fileData(data, type) {
      if (type === "content") {
        return fileBoxName(data);
      }
      return formatFileSize(data);
    },
    showCheckBtn(status, data) {
      if (status || (!status && this.srvData.includes(data.chatType))) {
        return status;
      }
      return !status;
    },
    IsURL(str_url) {
      var strRegex =
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
      var re = new RegExp(strRegex);
      if (re.test(str_url)) {
        return true;
      } else {
        return false;
      }
    },
    uploadImg(file, fileList) {
      this.fileList = fileList;
    },
    pinUserName(data) {
      const my = data.userChatId === "u" + this.myUserInfo.id
      if (my) {
        return "你";
      }
      return this.groupName(data);
    },
    goAnchor(data) {
      if (!document.getElementById(data)) {
        this.$message({ message: "讯息过久，无法查询", type: "error" });
        return;
      } else {
        document.getElementById(data).classList.add("blink");
        document.getElementById(data).scrollIntoView(true);
        setTimeout(() => {
          document.getElementById(data).classList.remove("blink");
        }, 3000);
      }
    },
    //判斷是否base64
    isBase64(data) {
      return AESBase64(data, this.aesKey, this.aesIv);
    },
    audioAction() {
      let audioEl = document.getElementById("notify-send-audio");
      var playPromise = audioEl.play();
      if (playPromise) {
        playPromise
          .then((_) => {
            audioEl.pause();
          })
          .catch((error) => { });
      }
      audioEl.src = ""; // 移除src, 防止之后播放空白音频
      setTimeout(() => {
        // 用setTimeout模拟一个2秒的延迟
        audioEl.src = require("./../../static/wav/send.mp3");
        audioEl.play();
      }, 150);
    },
    // 判断讯息Class名称
    judgeClass(item) {
      const my = item.userChatId === "u" + localStorage.getItem("id")
      if (my) {
        return "message-layout-right";
      }
      return "message-layout-left";
    },
    replyMsgClick(event, type) {
      const data = {
        chatType: event.chatType,
        clickType: type,
        innerText: this.isBase64(event.message.content),
        data: event.message.content,
        replyHistoryId: event.historyId,
        groupNickname: event.groupNickname,
        groupNumber: event.groupNumber,
        isAdmin: event.isAdmin,
        isManager: event.isManager,
        isCustomerService: event.isCustomerService,
        name: event.name,
        icon: event.icon,
        fileSize: event.fileSize,
        chatRoomId: event.toChatId
      }
      this.setEditReply(data)
      this.setReplyMsg(data);
    },
    getStorageTextArea() {
      const data = getStorage(this.groupUser, "editReplay")
      if (data) {
        this.setReplyMsg(data)
      } else {
        this.$root.closeReplyMessage()
      }
    },
    setEditReply(data) {
      setStorage(data, "editReplay");
    },
    onContextItem(data) {
      const item = [
        {
          name: "reply",
          label: "回复",
          icon: "el-icon-reply",
          onClick: () => {
            this.replyMsgClick(data, "replyMsg");
          },
        },
        {
          name: "copy",
          label: "复制",
          icon: "el-icon-copy",
          onClick: () => {
            copyPaste(
              this.isBase64(data.message.content).replace(/(\s*$)/g, "")
            );
          },
        },
        {
          name: "edit",
          label: "编辑",
          icon: "el-icon-edit",
          onClick: () => {
            this.replyMsgClick(data, "editMsg");
            this.setEditMsg({ edit: true, innerText: this.isBase64(data.message.content) });
          },
        },
        {
          name: "download",
          label: "下载",
          icon: "el-icon-download",
          onClick: () => {
            this.downloadFile(
              this.isBase64(data.message.content),
              this.fileData(this.isBase64(data.message.content), "content")
            );
          },
        },
        {
          name: "upDown",
          label: data.isPing ? "取消置顶" : "置顶",
          icon: data.isPing ? "el-icon-unpin" : "el-icon-pin",
          onClick: () => {
            this.topMsgAction(data, data.isPing);
          },
        },
        {
          name: "deleteAllChat",
          label: "对所有人刪除",
          icon: "el-icon-trash-all",
          divided: true,
          onClick: () => {
            this.deleteRecent(data, "all");
          },
        },
        {
          name: "deleteMyChat",
          label: "只对我删除",
          icon: "el-icon-trash",
          divided: true,
          onClick: () => {
            this.deleteRecent(data, "only");
          },
        },
        {
          name: "choose",
          label: "选择",
          icon: "el-icon-choose",
          onClick: () => {
            this.checkList = [];
            this.checkBoxDisabled = !this.checkBoxDisabled;
            this.$emit("checkBoxDisabled", this.checkBoxDisabled);
          },
        },
      ];
      return item
    },
    onContextmenu(data) {
      const isAdmin = JSON.parse(localStorage.getItem("groupData")).isAdmin;
      const isManager = JSON.parse(localStorage.getItem("groupData")).isManager;
      const isAuthority = isAdmin || (isManager && JSON.parse(localStorage.getItem("authority")).delUserMessage)
      if (data.userChatId !== "u" + localStorage.getItem("id")) {
        if (data.chatType === "SRV_GROUP_AUDIO") {
          if (isAuthority) {
            this.newItem = this.onContextItem(data).filter(
              (list) => !["edit", "copy", "download"].includes(list.name)
            );
          } else {
            this.newItem = this.onContextItem(data).filter(
              (list) =>
                !["deleteAllChat", "edit", "copy", "download"].includes(
                  list.name
                )
            );
          }
        } else if (
          data.chatType === "SRV_GROUP_IMAGE" ||
          data.chatType === "SRV_GROUP_FILE"
        ) {
          if (isAuthority) {
            this.newItem = this.onContextItem(data).filter(
              (list) => !["edit", "copy"].includes(list.name)
            );
          } else {
            this.newItem = this.onContextItem(data).filter(
              (list) => !["deleteAllChat", "edit", "copy"].includes(list.name)
            );
          }
        } else {
          if (isAuthority) {
            this.newItem = this.onContextItem(data).filter(
              (list) => !["edit", "download"].includes(list.name)
            );
          } else {
            this.newItem = this.onContextItem(data).filter(
              (list) =>
                !["deleteAllChat", "edit", "download"].includes(list.name)
            );
          }
        }
      } else {
        if (data.chatType === "SRV_GROUP_AUDIO") {
          this.newItem = this.onContextItem(data).filter(
            (list) => !["edit", "copy", "download"].includes(list.name)
          );
        } else if (
          data.chatType === "SRV_GROUP_IMAGE" ||
          data.chatType === "SRV_GROUP_FILE"
        ) {
          this.newItem = this.onContextItem(data).filter(
            (list) => !["edit", "copy"].includes(list.name)
          );
        } else {
          this.newItem = this.onContextItem(data).filter((list) => {
            return list.name !== "download";
          });
        }
      }

      if (isManager) {
        if (
          JSON.parse(localStorage.getItem("groupAuthority")).pin ||
          JSON.parse(localStorage.getItem("authority")).pin
        ) {
          this.newItem = this.newItem.filter((list) => {
            return list.name !== "edit";
          });
        } else {
          this.newItem = this.newItem.filter((list) => {
            return list.name !== "edit" && list.name !== "upDown";
          });
        }
      } else if (!isAdmin && !isManager) {
        if (!JSON.parse(localStorage.getItem("groupAuthority")).pin) {
          this.newItem = this.newItem.filter((list) => {
            return list.name !== "upDown";
          });
        }
      }

      const menuData = {
        items: this.newItem,
        // event,
        x: event.clientX,
        y: event.clientY,
        customClass: "custom-class",
        zIndex: 3,
        minWidth: 230,
      }
      this.$contextmenu(menuData);
      return false;
    },
    topMsgAction(data, key) {
      let param = {
        historyId: data.historyId,
        toChatId: data.toChatId,
      };
      if (key) {
        unpinHistory(param).then((res) => {
          if (res.code === 200) {
            this.$emit("resetPinMsg");
          }
        });
      } else {
        pinHistory(param).then((res) => {
          if (res.code === 200) {
            this.$emit("resetPinMsg");
          }
        });
      }
    },
    downloadFile(href, filename) {
      saveAs(href, filename);
    },
    deleteRecent(data, type) {
      let params = {
        fullDelete: type === "all",
        historyId: data.historyId,
        toChatId: data.toChatId,
      };
      deleteRecentChat(params)
        .then((res) => {
          if (res.code === 200) {
            this.$emit("deleteMsgHistoryData", data);
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
        });
    },
  },
  components: {
    VueMarkdown,
  },
};
</script>

<style lang="scss" scoped>
.hichat-pc {
  .message-pabel-box {
    .message-styles-box {

      .message-layout-left,
      .message-layout-right {
        ::v-deep.el-checkbox__input {
          .el-checkbox__inner {
            width: 20px;
            height: 20px;

            &:after {
              height: 12px;
              width: 6px;
              left: 5px;
            }
          }
        }
      }
    }
  }
}

.message-pabel-box {
  padding: 0 10px 0 20px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  .now-time {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin: 2em 0;

    span {
      background-color: rgba(0, 0, 0, 0.05);
      padding: 4px 15px;
      border-radius: 10px;
    }
  }

  .message-styles-box {
    margin-bottom: 20px;

    .message-layout-left,
    .message-layout-right {
      margin-top: 20px;
      width: 100%;
      //TODO
      display: flex;
      align-items: center;

      ::v-deep.el-checkbox__input {
        .el-checkbox__inner {
          border-radius: 10px;
        }
      }

      ::v-deep.el-checkbox__label {
        width: 100%;
        white-space: normal;
        cursor: initial;
      }

      ::v-deep.is-disabled {
        display: none;
      }
    }

    .message-layout-left {
      p {
        display: flex;
        align-items: flex-end;
        user-select: text;

        .message-audio {
          border-radius: 0 10px 10px 10px;
          background-color: rgba(0, 0, 0, 0.05);
          height: auto;
          padding: 9px 12px;

          .message-box {
            .message-name {
              font-size: 13px;
              color: #919191;
              padding-bottom: 5px;
            }

            audio {
              width: 190px;
            }
          }
        }

        .images-more-btn {
          top: 10px;
        }
      }

      .reply {
        .message-classic {
          padding: 0;

          .message-box {
            .message-name {
              padding: 8px 12px 0px 12px;
            }
          }
        }
      }

      .message-avatar {
        float: left;
        margin-right: 10px;
        border-radius: 10px;
        border: 0;
      }

      .message-box {
        .message-name {
          font-size: 13px;
          color: #919191;
        }

        .mobile-message-box {
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;

          span {
            padding-right: 5px;
          }
        }
      }

      .message-classic {
        background-color: rgba(0, 0, 0, 0.05);
        line-height: 1.4rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        border-radius: 0 8px 8px 8px;
        user-select: text;
      }

      .nickname-time {
        color: #777777;
        font-size: 12px;
        padding-left: 10px;
      }

      .read-check-box {
        display: none;
      }

      .message-image {
        position: relative;
        display: inline-block;
        padding: 9px 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 0 8px 8px 8px;

        .message-box {
          .message-name {
            padding: 0 0 10px 0;
          }

          .el-image {
            width: -webkit-fill-available !important;
            height: 9em !important;
            top: 0;

            ::v-deep.el-image__inner {
              height: unset;
            }
          }
        }
      }
    }

    .message-layout-right {
      p {
        display: flex;
        align-items: flex-end;
        flex-flow: row-reverse;
        user-select: text;

        .message-audio {
          border-radius: 10px 0px 10px 10px;
          background-color: rgba(0, 0, 0, 0.05);

          audio {
            width: 190px;
          }
        }
      }

      .reply {
        .message-classic {
          padding: 0;

          .message-box {
            .message-name {
              padding: 8px 12px 0px 12px;
            }
          }
        }
      }

      .message-avatar,
      .message-name {
        display: none;
      }

      .message-box {
        .mobile-message-box {
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;

          span {
            padding-right: 5px;
          }
        }
      }

      .message-classic {
        text-align: left;
        color: #000000;
        line-height: 1.4rem;
        font-weight: 600;
        background-color: #ffffff;
        letter-spacing: 0.5px;
        border-radius: 8px 0 8px 8px;
        user-select: text;
      }

      .nickname-time {
        color: #777777;
        font-size: 12px;
        padding-right: 10px;
      }

      .read-check-box {
        display: flex;
        justify-content: flex-end;

        span {
          img {
            height: 1em;
          }
        }

        .read-check {
          position: relative;
          left: 0.5em;
        }

        .read-check2 {
          left: 1em;
        }
      }

      .message-image {
        position: relative;
        display: inline-block;
        padding: 5px 6px 2px 6px;
        color: #333333;
        background-color: #e5e4e4;
        border-radius: 8px 0 8px 8px;
        font-weight: 600;

        .el-image {
          width: -webkit-fill-available !important;
          height: 9em !important;
          top: 0;

          ::v-deep.el-image__inner {
            height: unset;
          }
        }
      }
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid #eeeeee;
    }

    .vueAudioBetter {
      margin: 0;
      box-shadow: none;
      background-image: none;

      ::v-deep.operate {
        span {
          &:nth-child(3) {
            color: rgba(0, 0, 0, 0.8) !important;
          }
        }
      }
    }

    .message-classic,
    .message-disabled {
      position: relative;
      max-width: 100%;
      display: inline-block;
      padding: 9px 12px;
      font-size: 14px;
      color: #333333;
      word-break: break-all;

      .red {
        height: 1.5em;
      }

      img {
        height: 6em;
      }
    }

    .message-classic {
      .message-file-box {
        display: flex;
        align-items: center;
        padding-right: 45px;

        .file-box {
          width: 4em;
          height: 4em;
          background-color: #000;
          border-radius: 10px;
          background-image: url("./../../static/images/icon_file.svg");
          background-repeat: no-repeat;
          background-size: 65%;
          background-position: center;
        }

        .file-message {
          display: flex;
          flex-direction: column;
          padding-left: 10px;
        }
      }

      .message-box {
        .phone-bodx {
          display: flex;

          .phone-icon {
            height: 1.5em;
            padding-left: 5px;
          }
        }
      }
    }

    .message-audio {
      width: 190px;
      display: inline-block;
      position: relative;

      .images-more-btn {
        top: 10px !important;
      }
    }
  }

  .vueAudioBetter {
    box-shadow: none;
    background-image: none;
    width: auto;
    margin: 0;

    ::v-deep.operate {
      span {
        &:nth-child(3) {
          color: rgba(0, 0, 0, 0.8) !important;
        }
      }
    }

    ::v-deep.slider {
      display: none;
    }

    ::v-deep.icon-notificationfill {
      &:before {
        content: "\E66A";
        display: none;
      }
    }
  }
}

.hichat-pc {
  .message-pabel-box {
    .message-styles-box {
      .message-layout-left {
        p {
          .message-image {
            .message-box {
              .el-image {
                width: 15em !important;
                height: 11em !important;
                top: 0;

                ::v-deep.el-image__inner {
                  height: 100%;
                }
              }
            }
          }
        }
      }

      .message-layout-right {
        p {
          .el-image {
            width: -webkit-fill-available !important;
            height: 11em !important;
            top: 0;

            ::v-deep.el-image__inner {
              height: 100%;
            }
          }
        }
      }

      .message-layout-left,
      .message-layout-right {
        ::v-deep.el-checkbox__label {
          cursor: pointer;
        }
      }

      .el-checkbox.is-disabled {
        ::v-deep.el-checkbox__label {
          cursor: auto;
        }
      }
    }
  }
}

.message-touch-carte {
  color: #10686e;
  cursor: pointer;
  display: inline-block;
  margin-right: 6px;
}

.reply-Audio {
  .message-classic {
    max-width: 100% !important;
  }
}

.images-more-btn {
  width: 2em;
  cursor: pointer;
  border-radius: 5px;
  position: absolute;
  top: 17px;
  right: 10px;
  z-index: 9;
  text-align: center;
  background-color: #fff;
  color: #000;

  .el-icon-more {
    font-size: 20px;
  }
}

.reply-box {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;

  .reply-msg {
    padding: 9px 12px 9px 5px;
  }

  .reply-img {
    margin-right: 5px;
    padding: 9px 0px 9px 12px;

    img {
      width: 3em !important;
      height: 3em !important;
      border-radius: 10px;
    }
  }

  .goAnchor-box {
    .goAnchor {
      color: rgba(0, 0, 0, 0.8);
      text-decoration: none;
    }

    .reply-audio-box {
      display: block;
      height: 40px;
      position: absolute;
      z-index: 9;
    }

    .message-audio {
      height: 2.5em !important;
      padding: 0 !important;
      border: none !important;
      background-color: none;
    }

    .vueAudioBetter {
      box-shadow: none;
      background-image: none;
      width: auto;
      margin: 0;

      ::v-deep.operate {
        span {
          &:nth-child(3) {
            color: rgba(0, 0, 0, 0.8) !important;
          }
        }
      }

      ::v-deep.slider {
        display: none;
      }

      ::v-deep.icon-notificationfill {
        &:before {
          content: "\E66A";
          display: none;
        }
      }
    }
  }
}

.reply-content {
  padding: 5px 12px 5px 12px;
}

/* 定义keyframe动画，命名为blink */
@keyframes blink {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

/* 添加兼容性前缀 */
@-webkit-keyframes blink {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@-moz-keyframes blink {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@-ms-keyframes blink {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@-o-keyframes blink {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.blink {
  color: red;
  background: #0000000d;
  animation: blink 2s linear 1;
  /* 其它浏览器兼容性前缀 */
  -webkit-animation: blink 2s linear 1;
  -moz-animation: blink 2s linear 1;
  -ms-animation: blink 2s linear 1;
  -o-animation: blink 2s linear 1;
}

.scroll-bottom-btn {
  position: fixed;
  right: 30px;
  bottom: 80px;
  border-radius: 50px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 9;
}

.link-style {
  padding: 15px 0 7px 0;
}

::v-deep.linkified {
  color: #10686e;
  text-decoration: none;
}

.top-msg-style {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin: 0.5em 0;
  color: #000000;

  span {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 4px 15px;
    border-radius: 10px;
  }
}

.anthor-img {
  img {
    height: 15px !important;
  }
}

.message-layout-right {
  .service-icon {
    display: none;
  }

  .reply-box {
    .reply-img {
      .service-icon {
        display: block;
      }
    }
  }
}

.message-layout-left {
  .reply-box {
    .reply-img {
      .service-icon {
        display: block;
      }
    }
  }
}
</style>
