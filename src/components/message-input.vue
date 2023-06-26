<template>
  <div>
    <div
      class="message-input-box"
      :style="device !== 'mobile' ? 'max-height: 300px' : ''"
      @touchmove="$root.handleTouch"
    >
      <div class="input-tools-right">
        <div style="width: 65px">
          <img
            class="plus-btn"
            :src="showMenuIcon()"
            alt=""
            @click="
              !['replyMsg', 'editMsg'].includes(replyMsg.clickType)
                ? (menuBoxShow = !menuBoxShow)
                : false
            "
          />
          <img
            src="./../../static/images/image.png"
            alt=""
            @click="uploadImgShow = true"
          />
          <!-- <img src="./../../static/images/camera.png" alt=""> -->
        </div>
      </div>
      <div class="text-send-box">
        <el-input
          id="input"
          v-model="textArea"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 5 }"
          resize="none"
          placeholder="Message..."
          maxlength="500"
          @keyup.native="device === 'pc' ? keyUp($event) : false"
        >
        </el-input>
        <div class="footer-tools" @touchmove="$root.handleTouch">
          <div class="face-other-btn" @click.stop="showDialog = !showDialog">
            <img
              v-if="!showDialog"
              src="./../../static/images/emoji.png"
              alt=""
            />
            <img v-else src="./../../static/images/keyboard.svg" alt="" />
          </div>
          <div class="face-icon" v-show="showDialog">
            <VEmojiPicker
              :showSearch="false"
              :showCategories="false"
              :emojisByRow="10"
              @select="selectEmoji"
            />
          </div>
        </div>
      </div>

      <div class="input-tools-left">
        <template v-if="device === 'mobile'">
          <div v-if="!textArea" @click="audioShow = true">
            <img src="./../../static/images/audio.png" alt="" />
          </div>
          <div
            v-else
            @click="!editMsg.innerText ? sendMessage() : editMessage()"
          >
            <img src="./../../static/images/send.png" alt="" />
          </div>
        </template>

        <template v-else>
          <div>
            <img
              src="./../../static/images/camera.png"
              alt=""
              @click="takePictureShow = true"
            />
          </div>
        </template>
      </div>

      <el-dialog
        title="上传图片"
        :before-close="closeModel"
        :visible.sync="uploadImgShow"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
        :class="{ 'el-dialog-loginOut': device === 'pc' }"
        v-loading.fullscreen.lock="fullscreenLoading"
        width="100%"
        class="el-upload-img"
        element-loading-text="圖片上传中"
        center
      >
        <div
          id="preview"
          class="preview-img"
          v-if="copyPicture"
          v-on:paste="onPasteUpload"
        >
          <span>将图片按Ctrl+V 粘贴至此处</span>
        </div>
        <el-upload
          class="upload-demo"
          action="#"
          :on-change="uploadImg"
          :on-remove="handleRemove"
          :on-exceed="limitCheck"
          :auto-upload="false"
          :file-list="fileList"
          list-type="picture"
          multiple
          :limit="10"
          v-else
        >
          <el-button type="primary">点击上传</el-button>
        </el-upload>

        <span slot="footer" class="dialog-footer">
          <template v-if="device === 'mobile'">
            <el-button
              type="success"
              @click="copyPicture ? copySubmitAvatar() : submitAvatar()"
              >确认</el-button
            >
            <el-button @click="closeModel()">取消</el-button>
          </template>
          <template v-else>
            <el-button class="background-gray" @click="closeModel()"
              >取消</el-button
            >
            <el-button
              class="background-orange"
              @click="copyPicture ? copySubmitAvatar() : submitAvatar()"
              >确认</el-button
            >
          </template>
        </span>
      </el-dialog>

      <message-record
        type="CLI_USER_AUDIO"
        :audioShow="audioShow"
        :roomInfo="userData"
        @audioDialogShow="audioDialogShow"
      />
      <el-dialog
        title="照相"
        :visible.sync="takePictureShow"
        width="100%"
        class="el-dialog-takePicture"
        center
        :close-on-click-modal="false"
      >
        <Photo
          chatType="CLI_USER_IMAGE"
          v-on:closePictureShow="pictureShow"
        ></Photo>
      </el-dialog>
      <el-dialog
        title="档案上传"
        :before-close="closeModel"
        :visible.sync="uploadFileShow"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
        :class="{ 'el-dialog-loginOut': device === 'pc' }"
        width="100%"
        class="el-upload-img"
        center
      >
        <el-upload
          class="upload-demo"
          action="#"
          accept=".zip, .rar, .txt,.pdf, .doc, .docx, .xls, .xlsx"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-exceed="limitFileCheck"
          :file-list="fileData"
          :auto-upload="false"
          :multiple="false"
          :limit="1"
        >
          <el-button type="primary">点击上传</el-button>
        </el-upload>
        <el-progress
          v-show="progressFlag"
          :stroke-width="16"
          :percentage="progressPercent"
        ></el-progress>

        <span slot="footer" class="dialog-footer">
          <template v-if="device === 'mobile'">
            <el-button
              type="success"
              :disabled="fileDisabled"
              @click="submitFile()"
              >确认</el-button
            >
            <el-button @click="closeModel()">取消</el-button>
          </template>
          <template v-else>
            <el-button class="background-gray" @click="closeModel()"
              >取消</el-button
            >
            <el-button
              class="background-orange"
              :disabled="fileDisabled"
              @click="submitFile()"
              >确认</el-button
            >
          </template>
        </span>
      </el-dialog>
      <el-dialog
        :title="device === 'pc' ? '评价调查' : ''"
        :visible.sync="evaluateShow"
        class="el-dialog-evaluate"
        :width="device === 'pc' ? '350px' : '80%'"
        :close-on-click-modal="false"
        append-to-body
        center
      >
        <div class="evaluate-box">
          <img src="./../../static/images/pc/userfeedback.png" alt="" />
          <span>是否向该用户发送评价调查？</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            :class="device === 'mobile' ? 'border-red' : 'background-gray'"
            @click="evaluateShow = false"
            >取消</el-button
          >
          <el-button class="background-red" @click="sendService()"
            >确认</el-button
          >
        </span>
      </el-dialog>

      <audio
        id="notify-send-audio"
        src="./../../static/wav/send.mp3"
        preload="none"
      ></audio>
    </div>

    <div class="chat-menu-box" v-show="menuBoxShow">
      <div class="chat-menu">
        <ul>
          <li class="menu-li" @click="uploadFileShow = true">
            <div>
              <img :src="pathIcon" alt="" />
            </div>
            档案
          </li>
          <li class="menu-li" @click="goCard()">
            <div>
              <img :src="cardIcon" alt="" />
            </div>
            联络人名片
          </li>
          <template
            v-if="myUserInfo.isCustomerService && !userData.isCustomerService"
          >
            <li class="menu-li" @click="evaluateShow = true">
              <div>
                <img :src="evaluateIcon" alt="" />
              </div>
              发送评价调查
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Socket from "@/utils/socket";
import Photo from "./Photo.vue";
import { getToken } from "_util/utils.js";
import { VEmojiPicker } from "v-emoji-picker";
import { mapState, mapMutations } from "vuex";
import { uploadMessageFile, uploadMessageImage } from "@/api/uploadController";
import { createCustomerRating } from "@/api/customerServiceController";
import { Encrypt } from "@/utils/AESUtils.js";
import { setStorage, removeStorage, getStorage } from "@/utils/storage";
import MessageRecord from "@/components/message-recording.vue";

export default {
  name: "MessageInput",
  data() {
    return {
      search: "",
      textArea: "",
      newEmoji:[],
      showDialog: false,
      menuBoxShow: false,
      sendAudioShow: false,
      uploadImgShow: false,
      uploadFileShow: false,
      takePictureShow: false,
      fullscreenLoading: false,
      fileDisabled: false,
      evaluateShow: false,
      fileList: [],
      fileData: [],
      file: {},
      copyPicture: false,
      device: localStorage.getItem("device"),
      audioShow: false,

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",

      source: null,
      progressFlag: false, //进度条初始值隐藏
      progressPercent: 0, //进度条初始值
      cardIcon: "",
      pathIcon: "",
      evaluateIcon: "",
    };
  },
  props: {
    // 当前用户
    userInfoData: {
      type: Object,
    },
    // 当前用户
    userData: {
      type: Object,
    },
  },
  watch: {
    editMsg(data) {
      if (!this.editMsg.edit) {
        this.getStorageTextArea();
      } else {
        this.textArea = data.innerText;
      }
    },
    userData() {
      this.menuBoxShow = false;
      this.getStorageTextArea();
    },
    textArea(val) {
      this.initialStorage(val)
    },
  },
  computed: {
    ...mapState({
      myUserInfo: (state) => state.ws.myUserInfo,
      replyMsg: (state) => state.ws.replyMsg,
      editMsg: (state) => state.ws.editMsg,
      soundNotify: (state) => state.ws.soundNotify,
    }),
  },
  mounted() {
    document.addEventListener("paste", this.onPasteUpload);
    document.addEventListener("click", this.onClickEvent);
    this.deviceIcon();
    this.getStorageTextArea();
  },
  beforeDestroy() {
    document.removeEventListener("click", this.onClickEvent);
    document.removeEventListener("paste", this.onPasteUpload);

  },
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
      setReplyMsg: "ws/setReplyMsg",
      setMsgInfoPage: "ws/setMsgInfoPage",
    }),
    onClickEvent(event){
      if (event.target.className !== "emoji border") {
        this.showDialog = false;
      }
      if (!["chat-menu-box", "plus-btn"].includes(event.target.className)) {
        this.menuBoxShow = false;
      }
    },
    initialStorage(val) {
      const roomData = this.userData;
      const timeStamp = this.$root.formatTimeS(new Date());
      const typingUser = this.myUserInfo.id;
      const list = {
        chatRoomId: roomData.toChatId,
        data: val,
        timeStamp: timeStamp,
        uid: typingUser,
      };
      if (!val) {
        removeStorage(roomData, "input");
      }
      setStorage(list, "input");
    },
    audioDialogShow(Boolean) {
      this.audioShow = Boolean;
    },
    getStorageTextArea() {
      this.textArea = getStorage(this.userData, "input");
    },
    sendService() {
      let memberId = this.userData.toChatId.replace("u", "");
      createCustomerRating({ memberId }).then((res) => {
        if (res.code === 200) {
          this.$message({ message: "发送成功", type: "success" });
          this.evaluateShow = false;
        }
      });
    },
    goCard() {
      if (this.device === "pc") {
        this.setInfoMsg({ infoMsgShow: true });
        this.setMsgInfoPage({
          pageShow: false,
          type: "MobileCard",
          userData: this.userData,
        });
      } else {
        this.setMsgInfoPage({ userData: this.userData });
        this.$router.push({ name: "MobileCard_H5" });
      }
    },
    deviceIcon() {
      if (this.device === "pc") {
        this.cardIcon = require("./../../static/images/phone_icon/card.png");
        this.pathIcon = require("./../../static/images/phone_icon/path.png");
        this.evaluateIcon = require("./../../static/images/phone_icon/userfeedback.png");
      } else {
        this.cardIcon = require("./../../static/images/card.png");
        this.pathIcon = require("./../../static/images/path.png");
        this.evaluateIcon = require("./../../static/images/userfeedback.png");
      }
    },
    showMenuIcon() {
      return !this.menuBoxShow
        ? require("./../../static/images/plus.png")
        : require("./../../static/images/close.png");
    },
    selectEmoji(emoji) {
      // 选择emoji后调用的函数
      // this.textArea += emoji.data;

      let input = document.getElementById("input")
      let startPos = input.selectionStart;
      let endPos = input.selectionEnd;
      let resultText = input.value.substring(0,startPos) + emoji.data + input.value.substring(endPos);
      input.value = resultText
      input.focus();
      input.selectionStart = startPos + emoji.data.length
      input.selectionEnd = startPos + emoji.data.length
      this.textArea = resultText
    },
    pictureShow(val) {
      this.takePictureShow = val;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleChange(file, fileList) {
      const fileFilter = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (file.name.length > 50) {
        this.$message.error("档案名称过长无法传送");
        fileList.splice(-1, 1);
        return false;
      } else if (["exe", "apk", "ipa"].includes(fileFilter)) {
        this.$message.error("不支援exe、apk、ipa档案格式上传");
        fileList.splice(-1, 1);
        return false;
      } else if ((file.size / (1024 * 1024)).toFixed(2) > 100) {
        this.$message.error("档案过大无法传送");
        fileList.splice(-1, 1);
        return false;
      }
      this.fileData = fileList;
    },
    // 选择的文件超出限制的文件总数量时触发
    limitCheck() {
      this.$message({ message: "最多只能上传10张图片", type: "warning" });
    },
    limitFileCheck() {
      this.$message({ message: "最多只能上传1个档案", type: "warning" });
    },
    // 取得圖片
    uploadImg(file, fileList) {
      this.fileList = fileList;
    },
    closeModel() {
      this.fileList = [];
      this.fileData = [];
      this.fileDisabled = false;
      this.copyPicture = false;
      this.uploadImgShow = false;
      this.uploadFileShow = false;
      this.fullscreenLoading = false;
      if (this.progressFlag) {
        this.source.cancel("Operation canceled by the user.");
      }
    },
    //貼上上傳圖片
    onPasteUpload(event) {
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;
      if (!items || items.length === 0) {
        this.$message.error("当前浏览器不支持本地");
        return;
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        return;
      } else {
        this.uploadImgShow = true;
        this.copyPicture = true;
      }
      // 此时file就是我们的剪切板中的图片对象
      // 如果需要预览，可以执行下面代码
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.innerHTML = `<img src="${event.target.result}">`;
      };
      reader.readAsDataURL(file);
      this.file = file;
    },
    copySubmitAvatar() {
      this.submitAvatarUpload(this.file);
    },
    submitAvatar() {
      this.fileList.forEach((data) => {
        this.submitAvatarUpload(data.raw);
      });
    },

    // 上傳圖片
    submitAvatarUpload(data) {
      let formData = new FormData();
      formData.append("file", data);
      this.fullscreenLoading = true;
      uploadMessageImage(formData).then((res) => {
        if (res.code === 200) {
          let message = {
            chatType: "CLI_USER_IMAGE",
            deviceId: localStorage.getItem("UUID"),
            fromChatId: "u" + localStorage.getItem("id"),
            id: Math.random(),

            text: Encrypt(res.data, this.aesKey, this.aesIv),
            toChatId: this.userData.toChatId,
            token: getToken("token"),
            tokenType: 0,
          };
          // message.text = res.data;
          // 发送服务器
          this.soundNotify.forEach((res) => {
            if (res.key === "private" && res.isNofity) this.audioAction();
          });
          Socket.send(message);
          this.fileList = [];
          this.uploadImgShow = false;
          this.fullscreenLoading = false;
          setTimeout(() => {
            this.copyPicture = false;
          }, 500);
        } else if (res.code === 40001) {
          this.fileList = [];
          this.fullscreenLoading = false;
          setTimeout(() => {
            this.copyPicture = false;
          }, 500);
        }
      });
    },

    submitFile() {
      let formData = new FormData();
      formData.append("file", this.fileData[0].raw);
      formData.append("type", "FILE");
      this.fullscreenLoading = true;
      const CancelToken = axios.CancelToken;
      this.source = CancelToken.source();

      uploadMessageFile(formData, {
        cancelToken: this.source.token,
        onUploadProgress: (progressEvent) => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          //进度条
          this.progressFlag = true;
          this.progressPercent =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          this.fileDisabled = true;
        },
      })
        .then((res) => {
          if (res.code === 200) {
            let fileSize =
              (this.fileData[0].size / (1024 * 1024)).toFixed(2) === "0.00"
                ? 0.01
                : (this.fileData[0].size / (1024 * 1024)).toFixed(2);
            this.menuBoxShow = false;
            let message = {
              chatType: "CLI_USER_FILE",
              deviceId: localStorage.getItem("UUID"),
              // fileSize: JSON.stringify(this.fileData[0].size),
              fileSize: fileSize,
              fromChatId: "u" + localStorage.getItem("id"),
              id: Math.random(),
              replyHistoryId: "",
              targetArray: [],
              text: Encrypt(res.data, this.aesKey, this.aesIv), //TODO 加密
              toChatId: this.userData.toChatId,
              token: getToken("token"),
              tokenType: 0,
            };
            Socket.send(message);
            this.uploadFileShow = false;
          } else if (res.code === 40001) {
          }
        })
        .finally(() => {
          this.fileData = [];
          this.fileDisabled = false;
          this.fullscreenLoading = false;
          this.progressFlag = false;
          this.progressPercent = 0;
        });
    },

    // 消息过滤
    textAreaTran() {
      return this.textArea
        .replace(/\n/g, "")
        .replace(new RegExp("<", "gm"), "&lt");
    },
    // 按Enter发送消息
    keyUp(event) {
      if (event.shiftKey && event.keyCode === 13) {
        return this.textArea;
      } else if (event.key === "Enter") {
        if (!this.textArea.replace(/\s+/g, "")) {
          this.$alert("不能发送空白消息", "提示", {
            confirmButtonText: "确定",
          }).then(() => {
            this.textArea = "";
          });
          event.target.blur();
          return false;
        } else if (
          this.replyMsg.clickType === "replyMsg" ||
          !this.replyMsg.clickType
        ) {
          this.sendMessage();
        } else {
          this.editMessage();
        }
      }
    },
    wrapToBr(textArea){
      let string = textArea
      try{
        string = string.replace(/\r\n/g, "<br>");
        string = string.replace(/\n/g, "<br>");
        string = string.replace(/\r/g, "<br>");
      }catch(e){
        console.log(e.message)
      }
      return string
    },
    // 发送消息
    sendMessage() {
      if (!this.textArea.replace(/\s+/g, "")) {
        this.$message.error("不能发送空白消息");
        this.textArea = "";
        return false;
      }
      let message = {
        chatType: "CLI_USER_SEND",
        id: Math.random(),
        tokenType: 0,
        toChatId: this.userData.toChatId,
        replyHistoryId:
          this.replyMsg.replyHistoryId
            ? this.replyMsg.replyHistoryId
            : "",
        targetArray: [],
        text: Encrypt(
          // this.textArea.replace(/(\s*$)/g, ""),
          this.textArea.trim(),
          this.aesKey,
          this.aesIv
        ), //TODO 加密
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
      };
      // 发送服务器
      this.soundNotify.forEach((res) => {
        if (res.key === "private" && res.isNofity) this.audioAction();
      });
      Socket.send(message);
      this.$root.closeReplyMessage();
      // 消息清空
      this.textArea = "";
      this.showDialog = false;
      removeStorage(this.userData, "input");
      removeStorage(this.userData, "editReplay");
    },
    audioAction() {
      let audioEl = document.getElementById("notify-send-audio");
      var playPromise = audioEl.play();
      if (playPromise) {
        playPromise
          .then((_) => {
            audioEl.pause();
          })
          .catch((error) => {});
      }
      audioEl.src = ""; // 移除src, 防止之后播放空白音频
      setTimeout(() => {
        // 用setTimeout模拟一个2秒的延迟
        audioEl.src = require("./../../static/wav/send.mp3");
        audioEl.play();
      }, 150);
    },
    editMessage() {
      let editMessage = {
        chatType: "CLI_CHAT_EDIT",
        id: Math.random(),
        tokenType: 0,
        fromChatId: "u" + this.userData.memberId,
        targetId: this.replyMsg.replyHistoryId,
        text: Encrypt(
          this.textArea.replace(/(\s*$)/g, ""),
          this.aesKey,
          this.aesIv
        ), //TODO 加密
        // text: this.textArea,

        toChatId: this.userData.toChatId,
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
      };
      // 发送服务器
      Socket.send(editMessage);
      this.closeReplyEdit();
      // 消息清空
    },
    closeReplyEdit(){
      const roomData = this.userData;
      this.textArea = ""
      removeStorage(roomData, "input");
      removeStorage(roomData,'editReplay');
      this.$root.closeReplyMessage()
    },
  },
  components: {
    VEmojiPicker,
    Photo,
    MessageRecord,
  },
};
</script>

<style lang="scss" scoped>
.face-pabel {
  .face {
    display: inline-block;
    width: 20px;
    height: 20px;
  }
}

.el-dialog__wrapper {
  .el-dialog {
    .el-dialog__body {
      .upload-demo {
        .el-upload-list {
          .el-upload-list__item {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
.winClass {
  width: 300px;
}
.hichat-mobile {
  .el-dialog__wrapper.el-upload-img {
    .el-dialog {
      .el-dialog__body {
        .upload-demo {
          .el-upload-list {
            .el-upload-list__item {
              width: 90%;
              float: none;
            }
          }
        }
      
      }
    }
  }
  .chat-menu-box {
    background-color: rgba(225, 225, 225, 0.95);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    left: 0;
    bottom: 55px;
    width: 100%;
    .chat-menu {
      padding: 20px;
      ul {
        display: flex;
        justify-content: space-around;
      }
      .menu-li {
        font-size: 14px;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        margin: 0px 10px;
        cursor: pointer;
        div {
          width: 45px;
          height: 45px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          border-radius: 10px;
          margin-bottom: 5px;
        }
        img {
          height: 20px;
        }
      }
    }
  }
}
.hichat-pc {
  .el-dialog__wrapper.el-dialog-takePicture {
    .el-dialog {
      width: 880px !important;
      margin-top: 3em !important;
      .el-dialog__footer {
        padding: 0 !important;
        .el-button {
          padding: 20px !important;
          border-radius: 0 !important;

          &:nth-child(2) {
            border-left: 1px solid #efefef;
          }
        }
      }
    }
  }
  .el-dialog__wrapper.el-upload-img {
    .el-dialog {
      width: 500px !important;
    }
  }
  .el-dialog__wrapper.el-dialog-evaluate {
    ::v-deep.el-dialog {
      .el-dialog__footer {
        padding: 0 !important;
      }
    }
  }

  .chat-menu-box {
    position: absolute;
    background-color: #ffffff;
    left: 35px;
    bottom: 80px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    width: 160px;
    .chat-menu {
      .menu-li {
        display: flex;
        cursor: pointer;
        padding: 15px;

        &:first-of-type {
          border-radius: 5px 5px 0 0;
        }
        &:last-of-type {
          border-radius: 0 0 5px 5px;
        }

        &:hover {
          background-color: #0000000d;
        }
        div {
          display: flex;
          align-items: center;
        }
        img {
          height: 20px;
          padding-right: 10px;
        }
      }
    }
  }
}
::v-deep.el-dialog__wrapper {
  overflow: hidden;

  .el-dialog {
    .el-dialog__header {
      .el-dialog__title {
        color: #10686e;
        font-weight: 600;
      }

      .el-dialog__headerbtn {
        position: inherit;
        float: left;

        .el-dialog__close {
          color: #f60;
        }
      }
    }

    .el-dialog__body {
      text-align: center;
      .preview-img {
        max-height: 450px;
        overflow: auto;
      }
      .qrcode-box {
        width: 15em;
        height: 15em;
        border: 2px solid #333;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          height: 14em;
        }
      }

      .qrcode-box-text {
        color: #0c0d0d;
        font-weight: 600;
        margin-top: 2em;
        display: block;
      }
      .promote-href-text {
        color: #10686e;
        font-weight: 600;
        position: relative;
        top: -15px;
        display: block;
      }
      .promote-box-text {
        color: #0c0d0d;
        font-weight: 600;
        margin-bottom: 1em;
        display: block;
      }
      .upload-demo {
        line-height: 1.5em;
        .el-upload-list {
          max-height: 400px;
          overflow: auto;
          .el-upload-list__item {
            margin-top: 0;
            width: 300px;
            display: inline-block;
            margin: 10px 5px 0 5px;
            .el-upload-list__item-name {
              font-size: 18px;
            }
          }
        }
        .hidden {
          visibility: hidden;
        }
      }
      .record-play {
        .record-play-box {
          margin-top: 1em;
          width: 100%;
        }
        .record-time {
          width: 100%;
          text-align: center;
          font-size: 2em;
          font-family: monospace;
        }
      }
    }

    .el-dialog__footer {
      padding: 20px 30px 20px 30px;

      .dialog-footer {
        display: flex;
        justify-content: space-between;

        .el-button {
          width: 90%;
        }

        img {
          height: 1em;
        }
      }
    }
  }
}
</style>
