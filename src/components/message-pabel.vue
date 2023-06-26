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
                <p :class="[
                  {
                    'reply-Audio':
                      el.isReply &&
                      el.isReply.chatType === 'SRV_USER_AUDIO' &&
                      device === 'mobile',
                  },
                  {
                    reply: el.isReply,
                  },
                ]" :id="el.historyId" ref="viewBox">
                  <span class="message-classic" v-if="el.chatType === 'SRV_USER_SEND'" @contextmenu.prevent.stop="
                    checkBoxDisabled ? onContextmenu(el) : false
                    " @dblclick="replyMsgClick(el, 'replyMsg')">
                    <template v-if="el.isReply">
                      <div class="reply-box" @click="goAnchor(el.isReply.historyId)">
                        <!-- <div class="reply-img">
                          <img :src="noIconShow(el.isReply)" alt="" />
                        </div> -->
                        <div class="reply-msg">
                          <div style="color: rgba(0, 0, 0, 0.4)">
                            {{ el.isReply.nickName }}
                          </div>
                          <div>
                            <div class="goAnchor-box">
                              <span v-if="el.isReply.chatType === 'SRV_USER_SEND'" class="goAnchor">{{
                                isBase64(el.isReply.text) }}</span>
                              <img v-else-if="el.isReply.chatType === 'SRV_USER_IMAGE'
                                " :src="isBase64(el.isReply.text)" style="border-radius: 5px" />
                              <span v-else-if="el.isReply.chatType === 'SRV_USER_AUDIO'
                                ">
                                <div class="reply-audio-box"></div>
                                <!-- <mini-audio :audio-source="isBase64(el.isReply.text)"></mini-audio> -->
                                <audio controls="controls" class="user-audio">
                                  <source :src="isBase64(el.isReply.text)" type="audio/mpeg">
                                </audio>
                              </span>
                              <div v-else-if="el.isReply.chatType === 'SRV_USER_FILE'
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
                              <span v-if="el.isReply.chatType === 'SRV_CONTACT_CARD'
                                  " class="goAnchor">联络人名片</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <div :class="{
                      'reply-content': el.isReply,
                    }">
                      <span v-if="!IsURL(el.message.content)" @click.prevent.stop="
                        device === 'mobile' && checkBoxDisabled
                          ? onContextmenu(el)
                          : false
                        ">
                        <!--全形空白替换成半型-->
                        <div v-for="(text, idx) in el.message.content
                          .replace(/\u3000/g, ' ')
                          .split('\n')
                          .filter((str) => !!str)" :key="`${idx}_${text}`">
                          <vue-markdown :anchor-attributes="linkAttrs" :class="IsURL(text) ? 'link-style' : ''">
                            {{ text }}
                          </vue-markdown>
                        </div>
                      </span>
                      <div v-else-if="IsURL(el.message.content)">
                        <div v-if="device === 'mobile'" class="images-more-btn" style="top: 5px" @click.prevent.stop="
                          device === 'mobile' && checkBoxDisabled
                            ? onContextmenu(el)
                            : false
                          ">
                          <i class="el-icon-more"></i>
                        </div>
                        <!--全形空白替换成半型-->
                        <div v-for="(text, idx) in el.message.content
                          .replace(/\u3000/g, ' ')
                          .split('\n')
                          .filter((str) => !!str)" :key="`${idx}_${text}`">
                          <vue-markdown :anchor-attributes="linkAttrs" :class="device === 'mobile' ? 'link-style' : ''">
                            {{ text }}
                          </vue-markdown>
                        </div>
                      </div>
                    </div>
                  </span>
                  <span class="message-classic" v-else-if="el.chatType === 'SRV_USER_FILE'" @contextmenu.prevent.stop="
                    checkBoxDisabled ? onContextmenu(el) : false
                    " @dblclick="replyMsgClick(el, 'replyMsg')" @click.prevent.stop="
    device === 'mobile' && checkBoxDisabled
      ? onContextmenu(el)
      : false
    ">
                    <div class="message-file-box" id="file-download">
                      <div class="file-box"></div>
                      <div class="file-message">
                        <span>{{
                          fileData(isBase64(el.message.content), "content")
                        }}</span>
                        <span>档案大小　: {{ fileData(el.fileSize, "size") }}</span>
                      </div>
                    </div>
                  </span>

                  <span class="message-mini-audio" v-else-if="el.chatType === 'SRV_USER_AUDIO'" @contextmenu.prevent.stop="
                    checkBoxDisabled ? onContextmenu(el) : false
                    " @dblclick="replyMsgClick(el, 'replyMsg')">
                    <div v-if="device === 'mobile'" class="images-more-btn" @click.prevent.stop="
                      device === 'mobile' && checkBoxDisabled
                        ? onContextmenu(el)
                        : false
                      ">
                      <i class="el-icon-more"></i>
                    </div>
                    <!-- <mini-audio
                      class="message-audio"
                      :audio-source="el.message.content"
                    ></mini-audio> -->
                    <audio controls="controls" class="user-audio">
                      <source :src="el.message.content" type="audio/mpeg">
                    </audio>
                  </span>

                  <span class="message-image" v-else-if="el.chatType === 'SRV_USER_IMAGE'" @contextmenu.prevent.stop="
                    checkBoxDisabled ? onContextmenu(el) : false
                    " @dblclick="replyMsgClick(el, 'replyMsg')">
                    <div v-if="device === 'mobile'" class="images-more-btn" @click.prevent.stop="
                      device === 'mobile' && checkBoxDisabled
                        ? onContextmenu(el)
                        : false
                      ">
                      <i class="el-icon-more"></i>
                    </div>
                    <el-image :src="el.message.content" :preview-src-list="[el.message.content]" />
                  </span>
                  <span class="message-contact" v-else-if="el.chatType === 'SRV_CONTACT_CARD'" @contextmenu.prevent.stop="
                    checkBoxDisabled ? onContextmenu(el) : false
                    ">
                    <div class="contact-message-box">
                      <div @click.prevent.stop="
                        device === 'mobile' && checkBoxDisabled
                          ? onContextmenu(el)
                          : false
                        ">
                        <div class="le35" :class="{
                          'service-icon': el.contactCard.isCustomerService,
                        }"></div>
                        <div class="contact-icon">
                          <img :src="noIconShow(el.contactCard, 'user')" />
                          <div class="contact-name">
                            <span>{{ el.contactCard.nickname }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="contact-btn" @click="goContactCard(el.contactCard)">
                        查看联络人名片
                      </div>
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
import {
  pinHistory,
  unpinHistory,
  deleteRecentChat,
} from "@/api/chatController";
import { fileBoxName, formatFileSize } from "@/utils/FileSizeName.js";
import { copyPaste } from "@/utils/urlCopy.js";
import { saveAs } from "file-saver";
import AESBase64 from "@/utils/AESBase64.js";
import VueMarkdown from "vue-markdown";
import voiceStatus from "@/utils/voiceStatus";
import { unique } from "@/utils/unique";
import { showIcon } from "@/utils/icon";
import { audioPlay,removeAudioPlay } from "@/utils/audio";
import { setStorage, getStorage } from "@/utils/storage";
export default {
  name: "MessagePabel",
  props: {
    userInfoData: {
      type: Object,
    },
    // 当前用户
    userData: {
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
      count: 0,
      srvData: [
        "SRV_USER_SEND",
        "SRV_USER_FILE",
        "SRV_USER_AUDIO",
        "SRV_USER_IMAGE",
        "SRV_CONTACT_CARD",
      ],
      otherDataType: [
        "SRV_CHAT_PIN",
        "SRV_CALL_HISTORY", // 播出通話
        "SRV_CALL_CANCEL_HISTORY", // 語音通話取消訊息
        "SRV_CALL_NO_RESPONSE_HISTORY", // 通話無回應訊息
        "SRV_VIDEO_HISTORY", // 播出視訊通話
        "SRV_VIDEO_CANCEL_HISTORY", // 視訊通話取消訊息
      ],
      newData: [],
      message: [],
      checkList: [],
      newMessageData: {},
      checkBoxDisabled: true,
      fullscreenLoading: false,

      device: localStorage.getItem("device"),
      showScrollBar: false,
      isPlaying: false,
      linkAttrs: {
        target: "_blank",
        class: "linkified",
      },
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  computed: {
    ...mapState({
      soundNotify: (state) => state.ws.soundNotify,
      myUserInfo: (state) => state.ws.myUserInfo,
      goAnchorMessage: (state) => state.ws.goAnchorMessage,
      myContactDataList: (state) => state.ws.myContactDataList,
    }),
    reversedMessage: function () {
      this.newMessageData = {};
      //去除重复
      this.message = unique(this.messageData, "historyId");
      this.message.forEach((el) => {
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
    userData() {
      this.$root.gotoBottom();
      this.getStorageTextArea();
    },
  },
  mounted() {
    this.goAnchorHistoryId();
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
      setInfoMsg: "ws/setInfoMsg",
      setMsgInfoPage: "ws/setMsgInfoPage",
    }),
    goAnchorHistoryId() {
      if (this.goAnchorMessage.historyId) {
        setTimeout(() => {
          this.goAnchor(this.goAnchorMessage.historyId);
          this.setGoAnchorMessage({});
        }, 3000);
      }
    },
    goContactCard(data) {
      let user = data
      if (!user.icon) {
        user.icon = require("./../../static/images/image_user_defult.png");
      }
      user.toChatId = data.chatId;
      user.name = data.nickname
      if (this.device === "pc") {
        this.infoMsgShow(user);
      } else {
        this.$router.push({ name: "ContactPage", params: user });
      }
    },

    infoMsgShow(data) {
      this.setMsgInfoPage({ pageShow: true, type: "contactCard", data: data });
      this.setInfoMsg({
        infoMsgShow: true,
        infoMsgNav: "ContactPage",
        infoMsgChat: true,
        infoMsgMap: "address",
      });
    },
    filterChatType(el) {
      let type = el.chatType;
      if (voiceStatus.includes(type)) {
        return "网页版不支援通话功能，请至APP中进行操作。";
      } else if (type === "SRV_CHAT_PIN") {
        return this.pinUserName(el) + "置顶了一則訊息";
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
    fileData(data, type) {
      if (type === "content") {
        return fileBoxName(data);
      }
      return formatFileSize(data);
    },
    showCheckBtn(status, data) {
      if (status) {
        return status;
      } else if (!status) {
        return this.srvData.includes(data.chatType) ? status : !status
      }
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
    pinUserName(data) {
      const my = data.userChatId === "u" + this.myUserInfo.id
      if (my) {
        return "你";
      }
      return data.name;
    },

    goAnchor(data) {
      document.getElementById(data).classList.add("blink");
      document.getElementById(data).scrollIntoView(true);
      setTimeout(() => {
        document.getElementById(data).classList.remove("blink");
      }, 3000);
    },
    //判斷是否base64
    isBase64(data) {
      return AESBase64(data, this.aesKey, this.aesIv);
    },
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
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
    mouseClick(event) {
      for (let item in this.newMessageData) {
        this.newMessageData[item].forEach((res) => {
          if (res.historyId === event.historyId) {
            return (res.isMoreSetUp = true);
          } else {
            return (res.isMoreSetUp = false);
          }
        });
      }
    },
    replyMsgClick(event, type) {
      const data = {
        chatType: event.chatType,
        clickType: type,
        innerText: event.message.content,
        data: event.historyId,
        replyHistoryId: event.historyId,
        isCustomerService: event.isCustomerService,
        contactId: event.userChatId.replace("u", ""),
        name: event.name,
        icon: event.icon,
        fileSize: event.fileSize,
        chatRoomId: event.toChatId,
      };
      this.setEditReply(data);
      this.setReplyMsg(data);
    },
    getStorageTextArea() {
      const data = getStorage(this.userData, "editReplay");
      if (data) {
        this.setReplyMsg(data);
      } else {
        this.$root.closeReplyMessage();
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
            copyPaste(data.message.content.replace(/(\s*$)/g, ""));
          },
        },
        {
          name: "edit",
          label: "编辑",
          icon: "el-icon-edit",
          onClick: () => {
            this.replyMsgClick(data, "editMsg");
            this.setEditMsg({ edit: true, innerText: data.message.content });
          },
        },
        {
          name: "download",
          label: "下载",
          icon: "el-icon-download",
          onClick: () => {
            this.downloadFile(
              data.message.content,
              this.fileData(data.message.content, "content")
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
          label: "对所有人删除",
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
      return item;
    },
    onContextmenu(data) {
      //右鍵可使用功能 別人
      const noMyData = {
        SRV_USER_SEND: ["reply", "copy", "upDown", "deleteMyChat", "choose"],
        SRV_USER_IMAGE: ["reply", "download", "upDown", "deleteMyChat", "choose"],
        SRV_USER_FILE: ["reply", "download", "upDown", "deleteMyChat", "choose"],
        SRV_USER_AUDIO: ["reply", "upDown", "deleteMyChat", "choose"],
        SRV_CONTACT_CARD: ["reply", "deleteMyChat", "choose"],
      };
      //右鍵可使用功能 自己
      const myData = {
        SRV_USER_SEND: ["reply", "edit", "copy", "upDown", "deleteAllChat", "deleteMyChat", "choose"],
        SRV_USER_IMAGE: ["reply", "download", "upDown", "deleteAllChat", "deleteMyChat", "choose"],
        SRV_USER_FILE: ["reply", "download", "upDown", "deleteAllChat", "deleteMyChat", "choose"],
        SRV_USER_AUDIO: ["reply", "upDown", "deleteAllChat", "deleteMyChat", "choose"],
        SRV_CONTACT_CARD: ["reply", "deleteAllChat", "deleteMyChat", "choose"],
      };
      const noMy = data.userChatId !== "u" + localStorage.getItem("id");
      const contextData = noMy ? noMyData : myData;
      this.newItem = this.onContextItem(data).filter(
        (list) => contextData[data.chatType].includes(list.name)
      );
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
.le35 {
  left: 48px;
}

.hichat-pc {
  .message-pabel-box {
    .message-styles-box {
      .message-layout-left {
        p {
          user-select: text;

          .el-image {
            width: -webkit-fill-available !important;
            height: 11em !important;
            top: 0;

            ::v-deep.el-image__inner {
              height: 100%;
            }
          }
        }

        .reply {
          .message-classic {
            padding: 0;
          }
        }
      }

      .message-layout-right {
        p {
          user-select: text;

          .el-image {
            width: -webkit-fill-available !important;
            height: 11em !important;
            top: 0;

            ::v-deep.el-image__inner {
              height: 100%;
            }
          }
        }

        .reply {
          .message-classic {
            padding: 0;
          }
        }

        .message-image {
          background-color: #ffffff;
        }
      }

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

      .el-checkbox.is-disabled {
        ::v-deep.el-checkbox__label {
          cursor: auto;
        }
      }

      .message-contact {
        background: rgb(255, 255, 255) !important;
      }

      .message-audio {
        width: 190px;
        display: flex;
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

    ::v-deep.el-dialog-takePicture {
      .el-dialog {
        width: 450px !important;
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
      }

      ::v-deep.is-disabled {
        display: none;
      }
    }

    .message-layout-left {
      p {
        display: flex;
        align-items: flex-end;

        .message-audio {
          border-radius: 0 10px 10px 10px;
          background-color: rgba(0, 0, 0, 0.05);
        }

        audio {
          width: 210px;
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

      .message-avatar {
        float: left;
        margin-right: 10px;
        border-radius: 10px;
        border: 0;
      }

      .message-contact {
        position: relative;
        display: inline-block;
        padding: 5px 6px 2px 6px;
        color: #333333;
        background: rgba(255, 255, 255, 1);
        border-radius: 0 8px 8px 8px;
        font-weight: 600;

        .contact-message-box {
          padding: 10px;
          text-align: center;

          .contact-icon {
            img {
              width: 4em;
              height: 4em;
              border-radius: 10px;
            }
          }

          .contact-name {
            color: rgba(0, 0, 0, 0.8);
          }

          .contact-btn {
            padding: 5px 10px;
            margin-top: 10px;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.05);
            cursor: pointer;
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
    }

    .click-more-btn {
      width: 180px;
      background-color: #ffffffcb;
      box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.4);
      position: relative;
      border-radius: 5px;
      padding: 10px;

      ul {
        li {
          line-height: 2em;
          font-size: 14px;
          font-weight: 600;
          padding: 5px;
          color: #403f3f;
          cursor: pointer;

          &:hover {
            background-color: #dadadacb;
            border-radius: 5px;
          }
        }
      }
    }

    .message-layout-right {
      p {
        display: flex;
        align-items: flex-end;
        flex-flow: row-reverse;

        .message-audio {
          border-radius: 10px 0px 10px 10px;
          background-color: rgba(0, 0, 0, 0.05);

          audio {
            width: 190px;
          }
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

      .message-avatar {
        float: right;
        margin-left: 10px;
      }

      .message-contact {
        position: relative;
        display: inline-block;
        padding: 5px 6px 2px 6px;
        color: #333333;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 8px 0 8px 8px;
        font-weight: 600;

        .contact-message-box {
          padding: 10px;
          text-align: center;

          .contact-icon {
            img {
              width: 4em;
              height: 4em;
              border-radius: 10px;
            }
          }

          .contact-name {
            color: rgba(0, 0, 0, 0.8);
          }

          .contact-btn {
            padding: 5px 10px;
            margin-top: 10px;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.05);
            cursor: pointer;
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
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid #eeeeee;
    }

    .message-classic,
    .message-disabled {
      position: relative;
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
    }

    .message-image {
      position: relative;
      display: inline-block;
      padding: 5px 6px 2px 6px;
      color: #333333;
      background-color: #e5e4e4;
      border-radius: 10px;
      font-weight: 600;

      img {
        border-radius: 8px;
        width: 6em;
      }
    }

    .message-mini-audio {
      position: relative;

      display: inline-block;
      border-radius: 10px;
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

  .el-icon-more {
    font-size: 20px;
  }
}

.reply-box {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;

  .reply-msg {
    padding: 9px 12px;
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
    cursor: pointer;

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
      width: 200px !important;
      border: 0 !important;
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
</style>
