<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container>
      <el-main>
        <el-header height="70px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">私讯广播</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="setting-title">私讯广播发送对象</div>
          <label class="el-checkbox">
            <span class="el-checkbox__label">
              <div
                class="address-box"
                v-for="(item, index) in spreadDataList"
                :key="index"
              >
                <div :class="{ 'service-icon': item.isCustomerService }"></div>
                <el-image
                  :src="noIconShow(item, 'user')"
                  :preview-src-list="[noIconShow(item, 'user')]"
                />
                <div class="content-box">
                  <div class="msg-box" style="align-items: center">
                    <span>{{ item.name }}</span>
                  </div>
                  <div class="content-border-bottom"></div>
                </div>
              </div>
            </span>
          </label>
        </div>
        <div class="message-input-box">
          <div class="input-tools-right">
            <div>
              <img
                class="plus-btn"
                :src="showMenuIcon()"
                alt=""
                style="margin-right: 10px"
                @click="
                  !['replyMsg', 'editMsg'].includes(replyMsg.clickType)
                    ? (menuBoxShow = !menuBoxShow)
                    : false
                "
              />
              <img
                src="./../../../static/images/image.png"
                alt=""
                @click="uploadImgShow = true"
              />
            </div>
          </div>
          <div class="text-send-box">
            <el-input
              type="textarea"
              resize="none"
              :autosize="{ minRows: 1, maxRows: 5 }"
              placeholder="Message..."
              maxlength="500"
              :disabled="disabled"
              v-model="textArea"
            >
            </el-input>
            <div class="footer-tools" @touchmove="$root.handleTouch">
              <div
                class="face-other-btn"
                @click.stop="showDialog = !showDialog"
              >
                <img
                  v-if="!showDialog"
                  src="./../../../static/images/emoji.png"
                  alt=""
                />
                <img
                  v-else
                  src="./../../../static/images/keyboard.svg"
                  alt=""
                />
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
            <div v-if="textArea === ''" style="visibility: hidden">
              <img src="./../../../static/images/audio.png" alt="" />
            </div>
            <div v-else @click="sendMessage()">
              <img src="./../../../static/images/send.png" alt="" />
            </div>
          </div>
          <el-dialog
            title="上传图片"
            :before-close="closeModel"
            :visible.sync="uploadImgShow"
            width="100%"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :class="{ 'el-dialog-loginOut': device === 'pc' }"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="圖片上传中"
            center
          >
            <el-upload
              class="upload-demo"
              action="#"
              :on-change="uploadImg"
              :on-remove="handleRemove"
              :auto-upload="false"
              :file-list="fileList"
              list-type="picture"
              :limit="1"
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
            <span slot="footer" class="dialog-footer">
              <template v-if="device === 'mobile'">
                <el-button type="success" @click="submitAvatar()"
                  >确认</el-button
                >
                <el-button @click="closeModel()">取消</el-button>
              </template>
              <template v-else>
                <el-button class="background-gray" @click="closeModel()"
                  >取消</el-button
                >
                <el-button class="background-orange" @click="submitAvatar()"
                  >确认</el-button
                >
              </template>
            </span>
          </el-dialog>
        </div>
        <div
          class="chat-menu-box"
          v-show="menuBoxShow"
          :style="device === 'pc' ? 'position: absolute;' : ''"
        >
          <div class="chat-menu">
            <ul>
              <li class="menu-li" @click="goCard()">
                <div>
                  <img :src="deviceIcon()" alt="" />
                </div>
                联络人名片
              </li>
            </ul>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { VEmojiPicker } from "v-emoji-picker";
import { getToken } from "_util/utils.js";
import { Encrypt } from "@/utils/AESUtils.js";
import { mapState } from "vuex";

import { uploadMessageImage } from "@/api/uploadController";
import { showIcon } from "@/utils/icon";

export default {
  name: "spreadMessage",
  data() {
    return {
      search: "",
      textArea: "",
      disabled: false,
      showDialog: false,
      menuBoxShow: false,
      uploadImgShow: false,
      fullscreenLoading: false,
      fileList: [],
      spreadDataList: [],
      device: localStorage.getItem("device"),

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  created() {
    this.getSpreadDataList();
  },
  mounted() {
    document.addEventListener("click", this.onClickEvent);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.onClickEvent);
  },
  computed: {
    ...mapState({
      replyMsg: (state) => state.ws.replyMsg,
    }),
  },
  methods: {
    goCard() {
      this.$router.push({
        name: "MobileCard",
        params: { spreadData: this.spreadDataList },
      });
    },
    onClickEvent(event){
      if (event.target.className !== "emoji border") {
        this.showDialog = false;
      }
      if (!["chat-menu-box", "plus-btn"].includes(event.target.className)) {
        this.menuBoxShow = false;
      }
    },  
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    deviceIcon() {
      return require("./../../../static/images/card.png");
    },
    selectEmoji(emoji) {
      // 选择emoji后调用的函数
      this.textArea += emoji.data;
    },
    getSpreadDataList() {
      this.spreadDataList = this.$route.params.spreadData;
    },
    back() {
      this.$router.push({ path: "/SpreadChange" });
    },
    // 取得圖片
    uploadImg(file, fileList) {
      this.fileList = fileList;
    },
    closeModel() {
      this.fileList = [];
      this.copyPicture = false;
      this.uploadImgShow = false;
      this.fullscreenLoading = false;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    submitAvatar() {
      this.fileList.forEach((data) => {
        this.submitAvatarUpload(data.raw);
      });
    },
    showMenuIcon() {
      return !this.menuBoxShow
        ? require("./../../../static/images/plus.png")
        : require("./../../../static/images/close.png");
    },
    submitAvatarUpload(data) {
      let formData = new FormData();
      formData.append("file", data);
      this.fullscreenLoading = true;
      uploadMessageImage(formData).then((res) => {
        if (res.code === 200) {
          this.spreadDataList.forEach((res) => {
            let uploadImgData = {
              chatType: "CLI_USER_IMAGE",
              id: Math.random(),
              tokenType: 0,
              fromChatId: "u" + localStorage.getItem("id"),
              toChatId: "u" + res.contactId,
              text: Encrypt(res.data, this.aesKey, this.aesIv), //TODO 加密
              token: getToken("token"),
              deviceId: localStorage.getItem("UUID"),
            };
            Socket.send(uploadImgData);
          });
          this.fileList = [];
          this.uploadImgShow = false;
          this.fullscreenLoading = false;
          this.$message({ message: "发送讯息成功", type: "success" });
          this.disabled = true;
          setTimeout(() => {
            this.$router.push({ path: "/HiChat" });
          }, 1500);
        } else if (res.code === 40001) {
          this.fileList = [];
          this.fullscreenLoading = false;
        }
        
      });
    },
    sendMessage() {
      if (this.textArea.replace(/\s+/g, "") === "") {
        this.$message({ message: "不能发送空白消息", type: "error" });
        this.textArea = "";
        return false;
      }
      this.spreadDataList.forEach((res) => {
        let message = {
          chatType: "CLI_USER_SEND",
          id: Math.random(),
          tokenType: 0,
          toChatId: "u" + res.contactId,
          replyHistoryId: "",
          targetArray: [],
          text: Encrypt(
            this.textArea.replace(/(\s*$)/g, ""),
            this.aesKey,
            this.aesIv
          ), //TODO 加密
          token: getToken("token"),
          deviceId: localStorage.getItem("UUID"),
        };
        Socket.send(message);
      });
      this.$message({ message: "发送讯息成功", type: "success" });
      this.disabled = true;
      setTimeout(() => {
        this.$router.push({ path: "/HiChat" });
      }, 1500);
      // 消息清空
      this.textArea = "";
    },
  },
  components: {
    VEmojiPicker,
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .home-header {
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
    .home-user-pc {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/arrow-left.png");
      cursor: pointer;
    }
  }
  .home-content {
    .setting-title {
      padding: 15px 20px;
      color: rgba(0, 0, 0, 0.4);
      font-size: 15px;
    }
    ::v-deep.el-checkbox {
      display: flex;
      align-items: center;
      flex-flow: row-reverse;
      background-color: #fff;
      width: 100vw;
      .el-checkbox__input {
        padding-right: 20px;
        .el-checkbox__inner {
          border-radius: 10px;
        }
      }
      .el-checkbox__label {
        width: 100%;
        padding-left: 0;
        .address-box {
          .msg-box {
            span {
              color: #666666;
            }
          }
          .checkBox {
            position: absolute;
            right: 1.5em;
            font-size: 14px;
          }
        }
      }
    }
  }
}
.el-dialog__wrapper {
  .el-dialog {
    .el-dialog__body {
      .upload-demo {
        .el-upload-list {
          .el-upload-list__item {
            margin-top: -72px;
          }
        }
      }
    }
  }
}
.face-pabel {
  .face {
    display: inline-block;
    width: 20px;
    height: 20px;
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
          font-size: 18px;
        }
      }
      img {
        height: 20px;
      }
    }
  }
}
</style>
