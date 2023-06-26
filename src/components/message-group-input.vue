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
            v-if="authorityGroupSendLink(groupData)"
            :src="showMenuIcon()"
            alt=""
            @click="
              !['replyMsg', 'editMsg'].includes(replyMsg.clickType)
                ? ((menuBoxShow = !menuBoxShow), (calloutShow = false))
                : false
            "
          />
          <template v-if="authorityGroupSendImg(groupData)">
            <img
              src="./../../static/images/image.png"
              alt=""
              @click="uploadImgShow = true"
            />
          </template>
          <!-- <img src="./../../static/images/camera.png" alt=""> -->
        </div>
      </div>
      <div class="text-send-box">
        <div
          v-if="authorityGroupSendMessage(groupData, 'disable')"
          class="disable-box"
          @click="disableTouch"
        >
          已禁止發言
        </div>
        <template v-else>
          <el-input
            id="input"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 1, maxRows: 5 }"
            placeholder="Message..."
            maxlength="500"
            v-model="textArea"
            @focus="menuBoxShow = false"
            @keyup.native="device === 'mobile' ? callout() : keyUp($event)"
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
        </template>
      </div>
      <div class="input-tools-left">
        <template v-if="device === 'mobile'">
          <div
            v-if="!textArea && authorityGroupSendImg(groupData)"
            @click="audioShow = true"
          >
            <img src="./../../static/images/audio.png" alt="" />
          </div>
          <div
            v-else-if="authorityGroupSendMessage(groupData, 'send')"
            @click="!editMsg.innerText ? sendMessage() : editMessage()"
          >
            <img src="./../../static/images/send.png" alt="" />
          </div>
        </template>
        <template
          v-else-if="device === 'pc' && authorityGroupSendImg(groupData)"
        >
          <!-- <img
          src="./../../static/images/image.png"
          alt=""
          @click="uploadImgShow = true"
        /> -->
          <img
            src="./../../static/images/camera.png"
            alt=""
            @click="takePictureShow = true"
          />
        </template>
      </div>

      <div
        class="callout-message"
        v-show="calloutShow && searchContactData.length > 0"
      >
        <ul>
          <li
            @click="markPeople(searchContactData)"
            v-if="groupData.isAdmin || groupData.isManager"
          >
            <div class="callout-message-box"><span>標記所有成员</span></div>
          </li>
          <li
            v-for="(item, index) in searchContactData"
            :key="index"
            @click="checkCallout(item)"
          >
            <div>
              <el-avatar
                shape="square"
                size="small"
                :src="groupIconShow(item)"
              ></el-avatar>
              <img
                v-if="item.isCustomerService"
                src="./../../static/images/service.png"
                alt=""
                style="
                  position: relative;
                  height: 10px;
                  left: -28px;
                  top: -18px;
                "
              />
            </div>

            <div class="callout-message-box">
              <span>{{ groupName(item) }} </span>
            </div>
          </li>
        </ul>
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
        :roomInfo="groupData"
        @audioDialogShow="audioDialogShow"
      />
      <el-dialog
        title="照相"
        :visible.sync="takePictureShow"
        :close-on-click-modal="false"
        width="100%"
        class="el-dialog-takePicture"
        center
      >
        <Photo
          chatType="CLI_GROUP_IMAGE"
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
          :multiple="false"
          :auto-upload="false"
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
      <audio
        id="notify-send-audio"
        src="./../../static/wav/send.mp3"
        preload="none"
      ></audio>
    </div>
    <div
      class="chat-menu-box"
      v-show="menuBoxShow"
      :style="device === 'pc' ? 'position: absolute;' : ''"
    >
      <div class="chat-menu">
        <ul>
          <li class="menu-li" @click="uploadFileShow = true">
            <div>
              <img :src="pathIcon" alt="" />
            </div>
            档案
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Socket from "@/utils/socket";
import Photo from "./Photo.vue";
import { VEmojiPicker } from "v-emoji-picker";
import { getToken } from "_util/utils.js";
import { mapState, mapMutations } from "vuex";
import { getGroupDisabledWord } from "@/api/groupController";
import { uploadMessageImage, uploadMessageFile } from "@/api/uploadController";
import { Encrypt } from "@/utils/AESUtils.js";
import { groupIcon } from "@/utils/icon";
import { setStorage, removeStorage, getStorage } from "@/utils/storage";
import { nameTidy } from "@/utils/name";
import MessageRecord from "@/components/message-recording.vue";

export default {
  name: "MessageInput",
  data() {
    return {
      search: "",
      textArea: "",
      showDialog: false,
      menuBoxShow: false,
      calloutShow: false,
      uploadImgShow: false,
      uploadFileShow: false,
      takePictureShow: false,
      fullscreenLoading: false,
      fileDisabled: false,
      banMessage: [],
      checkName: [],
      fileList: [],
      fileData: [],
      file: {},
      copyPicture: false,
      targetArray: [],
      searchContactData: [],
      device: localStorage.getItem("device"),
      audioShow: false,

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",

      source: null,
      progressFlag: false, //进度条初始值隐藏
      progressPercent: 0, //进度条初始值
      pathIcon: "",
      blank:[],
    };
  },
  props: {
    // 当前用户
    userInfoData: {
      type: Object,
    },
    // 当前用户
    groupData: {
      type: Object,
    },
    unGroupDisabledWord: {
      type: Boolean,
    },
    authority: {
      type: Object,
    },
  },
  computed: {
    ...mapState({
      replyMsg: (state) => state.ws.replyMsg,
      editMsg: (state) => state.ws.editMsg,
      soundNotify: (state) => state.ws.soundNotify,
      myUserInfo: (state) => state.ws.myUserInfo,
      tapDataList: (state) => state.ws.tapDataList,
      authorityGroupData: (state) => state.ws.authorityGroupData,
      contactListData: (state) => state.ws.contactListData,
    }),
  },
  watch: {
    editMsg(data) {
      if (!this.editMsg.edit) {
        this.getStorageTextArea();
      } else {
        this.textArea = data.innerText;
      }
    },
    groupData() {
      this.menuBoxShow = false;
      this.getStorageTextArea();
    },
    textArea(val) {
      this.tapMessage(val);
      this.initialStorage(val);
    },
    tapDataList(val) {
      this.textArea = val.textArea;
    },
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
    this.getDisabledWord();
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
    document.removeEventListener("paste", this.onPasteUpload);
    document.removeEventListener("click", this.onClickEvent);

  },
  mounted() {
    document.addEventListener("paste", this.onPasteUpload);
    document.addEventListener("click", this.onClickEvent);
    this.deviceIcon();
    this.getStorageTextArea();
  },
  methods: {
    ...mapMutations({
      setReplyMsg: "ws/setReplyMsg",
      setTapDataList: "ws/setTapDataList",
    }),

    tapMessage(val) {
      const storage = localStorage.getItem("storageData");
      const storageData = JSON.parse(storage) ? JSON.parse(storage) : [];
      const findStorage = storageData["input"].find(
        (item) => item.chatRoomId === this.groupData.toChatId
      );
      const tapParams = {
        textArea: "",
        tapData: [],
      };
      if (!val) {
        this.calloutShow = false;
        if (findStorage && !findStorage.data) {
          this.setTapDataList(tapParams);
        }
      } else {
        const textAreaSearchData = val.split(" ");
        textAreaSearchData.forEach((el) => {
          this.searchContactData = this.contactListData.filter((item) => {
            const tagName = this.groupName(item).toLowerCase()
            const elText = el.replace("@", "").toLowerCase()
            return tagName.indexOf(elText) !== -1;
          });
        });
      }
    },
    onClickEvent(event){
      if (event.target.className !== "emoji border") {
        this.showDialog = false;
      }
      if (!["chat-menu-box", "plus-btn"].includes(event.target.className)) {
        this.menuBoxShow = false;
      }
    },
    initialStorage(val) {
      const roomData = this.groupData;
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
      this.textArea = getStorage(this.groupData, "input");
    },
    deviceIcon() {
      if (this.device === "pc") {
        this.cardIcon = require("./../../static/images/phone_icon/card.png");
        this.pathIcon = require("./../../static/images/phone_icon/path.png");
      } else {
        this.cardIcon = require("./../../static/images/card.png");
        this.pathIcon = require("./../../static/images/path.png");
      }
    },
    showMenuIcon() {
      return !this.menuBoxShow
        ? require("./../../static/images/plus.png")
        : require("./../../static/images/close.png");
    },
    audioDialogShow(Boolean) {
      this.audioShow = Boolean;
    },
    groupIconShow(data) {
      let groupUser = this.groupData;
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
    authorityGroupSendImg(user) {
      return (
        user.isAdmin ||
        (user.isManager &&
          (this.authority.sendImage || this.authorityGroupData.sendImage)) ||
        this.authorityGroupData.sendImage
      );
    },
    authorityGroupSendLink(user) {
      return (
        user.isAdmin ||
        (user.isManager &&
          (this.authority.sendLink || this.authorityGroupData.sendLink)) ||
        this.authorityGroupData.sendLink
      );
    },
    authorityGroupSendMessage(user, type) {
      if (type === "send") {
        return (
          user.isAdmin ||
          (user.isManager &&
            (this.authority.sendMessage ||
              this.authorityGroupData.sendMessage)) ||
          this.authorityGroupData.sendMessage
        );
      } else {
        return (
          (user.isBanPost) ||
          (user.isManager && !this.authority.sendMessage) ||
          (!user.isAdmin &&
            !user.isManager &&
            !this.authorityGroupData.sendMessage)
        );
      }
    },
    // 选择的文件超出限制的文件总数量时触发
    limitCheck() {
      this.$message({ message: "最多只能上传10张图片", type: "warning" });
    },
    limitFileCheck() {
      this.$message({ message: "最多只能上传1个档案", type: "warning" });
    },
    selectEmoji(emoji) {
      // 选择emoji后调用的函数
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
    disableTouch() {
      this.$message({ message: "已禁止發言", type: "warning" });
    },
    markPeople(data) {
      data.forEach((el) => {
        this.tapDataList.tapData.push("u" + el.memberId);
      });
      this.textArea = this.textArea + "所有成员 ";
      this.calloutShow = false;
      let tapParams = {
        textArea: this.textArea,
        tapData: this.tapDataList.tapData,
      };
      this.setTapDataList(tapParams);
    },
    // \u200B
    checkCallout(data) {
      this.calloutShow = false;
      this.textArea = (this.textArea.slice(0, -1) + " @" + this.groupName(data) + " ").trim();
      this.tapDataList.tapData.push("u" + data.memberId);
      this.targetArray.concat(this.tapDataList.tapData);
      let tapParams = {
        textArea: this.textArea,
        tapData: this.tapDataList.tapData,
      };
      this.setTapDataList(tapParams);
    },

    handleGetMessage(msg) {
      let userInfo = JSON.parse(msg);
      if (userInfo.chatType === "SRV_GROUP_DISABLE_WORD") {
        this.getDisabledWord();
      }
    },
    getDisabledWord() {
      let groupId = this.groupData.groupId;
      getGroupDisabledWord({ groupId }).then((res) => {
        if (res.code === 200) {
          this.banMessage = res.data;
        }
      });
    },
    pictureShow(val) {
      this.takePictureShow = val;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleChange(file, fileList) {
      let fileFilter = file.name.substring(file.name.lastIndexOf(".") + 1);
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
      if (
        ((!this.groupData.isAdmin && !this.groupData.isManager) ||
          (this.groupData.isManager && !this.authority.sendImage)) &&
        !this.authorityGroupData.sendImage
      ) {
        this.$message.error("群組已禁止發送圖片訊息");
        this.fileList = [];
        this.uploadImgShow = false;
        this.fullscreenLoading = false;
        return false;
      }
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
          const message = {
            chatType: "CLI_GROUP_IMAGE",
            deviceId: localStorage.getItem("UUID"),
            fromChatId: "u" + localStorage.getItem("id"),
            id: Math.random(),
            text: Encrypt(res.data, this.aesKey, this.aesIv),
            toChatId: "g" + this.groupData.groupId,
            token: getToken("token"),
            tokenType: 0,
          };
          // message.text = res.data,
          // 发送服务器
          this.soundNotify.forEach((res) => {
            if (res.key === "group" && res.isNofity) this.audioAction();
          });
          Socket.send(message);
          this.fileList = [];
          this.uploadImgShow = false;
          this.fullscreenLoading = false;
        } else if (res.code === 40001) {
          this.fileList = [];
          this.fullscreenLoading = false;
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
              chatType: "CLI_GROUP_FILE",
              deviceId: localStorage.getItem("UUID"),
              // fileSize: JSON.stringify(this.fileData[0].size),
              fileSize: fileSize,
              fromChatId: "u" + localStorage.getItem("id"),
              id: Math.random(),
              replyHistoryId: "",
              targetArray: [],
              text: Encrypt(res.data, this.aesKey, this.aesIv), //TODO 加密
              toChatId: "g" + this.groupData.groupId,
              token: getToken("token"),
              tokenType: 0,
            };
            Socket.send(message);
            this.uploadFileShow = false;
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

    callout() {
      this.textArea.split(" ").forEach((res) => {
        this.calloutShow = res.startsWith("@");
      });
    },

    keyUp(event) {
      this.callout();
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
        } else if (["", "replyMsg"].includes(this.replyMsg.clickType)) {
          this.sendMessage();
        } else {
          this.editMessage();
        }
      }
    },

    filterTag(){
      const textAreaData = this.textArea.replace(/(\n*$)/g, "").split(" ");
      let newArea = []
      let showGroupNumber = this.authorityGroupData.showGroupNumber;
      let editGroupNickname = this.authorityGroupData.editGroupNickname;
     
      textAreaData.forEach((res)=>{
        this.contactListData.forEach((item) => {
          if(res.startsWith("@")){
            let filterName = ""
            if (showGroupNumber && editGroupNickname) {
              if (!item.groupNickname) {
                filterName = item.groupNumber;
              } else {
                filterName = item.groupNickname;
              }
            } else if (showGroupNumber && !editGroupNickname) {
              filterName = item.groupNumber;
            } else if (!showGroupNumber && !editGroupNickname) {
              filterName = item.name
            }           
            if(filterName === res.replace("@", "")){
              newArea.push("u" + item.memberId)
            }
          }
        })
      })
      
      this.tapDataList.tapData = newArea
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
      // const dictionary = this.textArea.replace(/(\n*$)/g, "").split(" ");
      // //先找到x的位置，等會要用c來取代x
      // this.contactListData.forEach((item) => {
      //   const xIndex = dictionary.indexOf("@" + item.name);
      //   if (xIndex > -1) {
      //     this.tapDataList.tapData.push("u" + item.memberId);
      //     this.targetArray.concat(this.tapDataList.tapData);
      //     dictionary.splice(xIndex, 1, "@" + item.memberId + "\u200B");
      //   }
      // });
      // this.calloutTextArea = dictionary.toString().replace(/,/g, " ");
  
      this.filterTag()
      if (!this.textArea.replace(/\s+/g, "")) {
        this.$message.error("不能发送空白消息");
        this.textArea = "";
        return false;
      } else if (
        ((!this.groupData.isAdmin && !this.groupData.isManager) ||
          (this.groupData.isManager && !this.authority.sendLink)) &&
        !this.authorityGroupData.sendLink
      ) {
        
        var strRegex =
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        var re = new RegExp(strRegex);
        const splitTextArea = this.textArea.trim().replace(/\r|\n/ig, "").split(" ")
        const someText = splitTextArea.some(text => (re.test(text) || text.indexOf("http") !== -1 ))
        if (someText) {
          this.$message.error("无法发送超连结");
          this.textArea = "";
          return false;
        }
      }
      this.banMessageData = this.banMessage.filter((el) =>
        this.textArea.replace(/(\s*$)/g, "").includes(el.word)
      );
      if (this.banMessageData.length !== 0) {
        this.$message.error("讯息含有禁用字词，无法传送");
        this.textArea = this.textArea.replace(/(\s*$)/g, "");
        return false;
      } else {
        
        let message = {
          chatType: "CLI_GROUP_SEND",
          id: Math.random(),
          toChatId: this.groupData.toChatId,
          replyHistoryId:
            this.replyMsg.replyHistoryId
              ? this.replyMsg.replyHistoryId
              : "",
          targetArray: this.tapDataList.tapData,
          text: Encrypt(
          // this.textArea.replace(/(\s*$)/g, ""),
            this.textArea,
            // this.calloutTextArea,//TODO @memberId
            this.aesKey,
            this.aesIv
          ), //TODO 加密

          // text: this.textArea,
          token: getToken("token"),
          deviceId: localStorage.getItem("UUID"),
          tokenType: 0,
        };
        // 发送服务器
        this.soundNotify.forEach((res) => {
          if (res.key === "group" && res.isNofity) this.audioAction();
        });
        Socket.send(message);
        this.$root.closeReplyMessage();
        // 消息清空
        this.targetArray = [];
        this.checkName = [];
        this.textArea = "";
        this.showDialog = false;
        const tapParams = {
          textArea: "",
          tapData: [],
        };
        this.setTapDataList(tapParams);
        removeStorage(this.groupData, "input");
        removeStorage(this.groupData, "editReplay");
      }
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
        fromChatId: "u" + this.groupData.memberId,
        targetId: this.replyMsg.replyHistoryId,
        text: Encrypt(
          this.textArea.replace(/(\s*$)/g, ""),
          this.aesKey,
          this.aesIv
        ), //TODO 加密
        // text: this.textArea,
        toChatId: this.groupData.toChatId,
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
      };
      // 发送服务器
      Socket.send(editMessage);
      this.closeReplyEdit()
    },
    closeReplyEdit(){
      const roomData = this.groupData;
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
.winClass {
  width: 300px;
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
.hichat-mobile {
  .callout-message {
    bottom: 55px;
    overflow: scroll;
    z-index: 9999;
    ul {
      li {
        .callout-message-box {
          span {
            line-height: 20px;
            color: #363636;
            word-wrap: break-word;
          }
        }
      }
    }
  }
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
        display: inline-flex;
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
          i {
            color: #10686e;
            font-size: 18px;
          }
        }
        img {
          height: 20px;
        }
      }
    }
  }
}

.callout-message {
  background-color: rgba(225, 225, 225, 0.95);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  color: #959393;
  position: absolute;
  left: 0;
  bottom: 55px;
  width: 100%;
  z-index: 9999;
  ul {
    max-height: 200px;
    overflow-x: none;
    overflow-y: auto;
    li {
      display: flex;
      padding: 11px 8px;
      cursor: pointer;
      .el-avatar {
        overflow: initial;
        img {
          border-radius: 4px;
          width: -webkit-fill-available;
        }
      }
      &:hover {
        background: #ecf5ff;
      }
      .callout-message-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 10px;
        span {
          line-height: 20px;
          color: #363636;
          word-wrap: break-word;
        }
        .replyMsg-Img {
          img {
            height: 2em;
            border-radius: 5px;
          }
        }
      }
    }
  }

  .reply-close-btn {
    position: absolute;
    right: 20px;
    font-size: 20px;
    cursor: pointer;
  }
  ::v-deep.el-avatar {
    overflow: initial;
    img {
      border-radius: 4px;
      width: -webkit-fill-available;
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
