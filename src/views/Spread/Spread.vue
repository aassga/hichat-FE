<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container>
      <el-aside width="370px">
        <el-header height="70px">
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back()"></div>
            <span class="home-header-title">私讯广播</span>
          </div>
        </el-header>
        <div class="home-content">
          <div class="home-search">
            <el-input
              placeholder="搜索聯絡人"
              prefix-icon="el-icon-search"
              clearable
              v-model="searchKey"
            >
            </el-input>
          </div>
          <el-checkbox-group v-model="checkList" @touchmove="$root.handleTouch">
            <el-checkbox
              v-for="(item, index) in newContactList"
              :label="item"
              :key="index"
            >
              <div class="address-box">
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
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="home-footer-btn">
          <el-button
            :class="disabled ? 'gray-btn' : 'orange-btn'"
            :disabled="disabled"
            @click="spreadMessageShow = true"
            >選擇联络人</el-button
          >
        </div>
      </el-aside>
    </el-container>
    <el-dialog
      :visible.sync="spreadMessageShow"
      class="el-dialog-spread"
      width="100%"
      center
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div class="body-header">
        <img src="./../../../static/images/phone_icon/promotion.png" alt="" />
        <span>私訊廣播</span>
      </div>
      <div class="body-content">
        <div class="body-content-list">
          <div
            v-for="(item, index) in checkList"
            :key="index"
            class="address-box"
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
        </div>
        <div class="input-box" v-if="!chooseContactShow">
          <div class="input-tools-right">
            <div style="width: 65px">
              <img
                class="plus-btn"
                :src="showMenuIcon()"
                alt=""
                style="margin: 0 10px; cursor: pointer"
                @click="
                  !['replyMsg', 'editMsg'].includes(replyMsg.clickType)
                    ? (menuBoxShow = !menuBoxShow)
                    : false
                "
              />
              <img
                style="cursor: pointer"
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
              @keyup.native="keyUp"
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
        </div>
      </div>

      <span slot="footer" class="dialog-footer" v-if="!chooseContactShow">
        <div class="chat-menu-box" v-show="menuBoxShow">
          <div class="chat-menu">
            <ul>
              <li class="menu-li" @click="chooseContactShow = true">
                <div>
                  <img :src="cardIcon" alt="" />
                </div>
                联络人名片
              </li>
            </ul>
          </div>
        </div>
        <div class="button" @click="sendMessage()">传送</div>
      </span>
    </el-dialog>
    <el-dialog
      title="上传图片"
      :before-close="closeModel"
      :visible.sync="uploadImgShow"
      width="100%"
      :close-on-click-modal="false"
      class="el-dialog-loginOut"
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
        <el-button class="background-gray" @click="closeModel()"
          >取消</el-button
        >
        <el-button class="background-orange" @click="submitAvatar()"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <div v-if="chooseContactShow" class="spread-card-box">
      <SpreadCard
        @closeChooseContact="closeChooseContact"
        @sendSubmit="sendSubmit"
        :checkData="checkList"
      />
    </div>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { VEmojiPicker } from "v-emoji-picker";
import { getToken } from "_util/utils.js";
import { getContactList } from "@/api/memberContactController";
import { uploadMessageImage } from "@/api/uploadController";
import { Encrypt } from "@/utils/AESUtils.js";
import { mapState } from "vuex";

import SpreadCard from "./../../views/Spread/SpreadCard.vue";
import { showIcon } from "@/utils/icon";

export default {
  name: "Spread",
  data() {
    return {
      textArea: "",
      searchKey: "",
      cardIcon: "",
      fileList: [],
      checkList: [],
      contactList: [],
      newContactList: [],
      disabled: true,
      showDialog: false,
      menuBoxShow: false,
      uploadImgShow: false,
      fullscreenLoading: false,
      spreadMessageShow: false,
      chooseContactShow: false,
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  created() {
    this.getAddressList();
  },
  computed: {
    ...mapState({
      replyMsg: (state) => state.ws.replyMsg,
    }),
  },
  mounted() {
    document.addEventListener("click", this.onClickEvent);
    this.deviceIcon();
  },
  beforeDestroy() {
    document.removeEventListener("click", this.onClickEvent);
  },
  watch: {
    searchKey(val) {
      let searchKeyData = val.split(" ");
      searchKeyData.forEach((el) => {
        let searchCase = this.contactList;
        this.searchData = searchCase.filter((item) => {
          return item.name.indexOf(el.replace("@", "")) !== -1;
        });
      });
      this.newContactList = this.searchData;
    },
    checkList(val) {
      this.disabled = !val.length > 0;
    },
  },
  methods: {
    showMenuIcon() {
      return !this.menuBoxShow
        ? require("./../../../static/images/plus.png")
        : require("./../../../static/images/close.png");
    },
    onClickEvent(event){
      if (event.target.className !== "emoji border") {
        this.showDialog = false;
      }
    },  
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    handleClose() {
      this.menuBoxShow = false;
      this.spreadMessageShow = false;
      this.chooseContactShow = false;
    },
    deviceIcon() {
      this.cardIcon = require("./../../../static/images/phone_icon/card.png");
    },
    closeChooseContact(type) {
      this.chooseContactShow = type;
    },
    sendSubmit(type) {
      this.spreadMessageShow = type;
      this.chooseContactShow = type;
      this.$router.push({ path: "/HiChat" });
    },
    getAddressList() {
      getContactList().then((res) => {
        this.contactList = res.data.list.filter(
          (el) => el.contactId !== localStorage.getItem("id")
        );
        this.contactList.forEach((res) => {
          if (!res.icon) {
            res.icon = require("./../../../static/images/image_user_defult.png");
          }
        });
        this.newContactList = this.contactList;
      });
    },
    selectEmoji(emoji) {
      // 选择emoji后调用的函数
      this.textArea += emoji.data;
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
    // 上傳圖片
    submitAvatarUpload(data) {
      let formData = new FormData();
      formData.append("file", data);
      this.fullscreenLoading = true;
      uploadMessageImage(formData).then((res) => {
        if (res.code === 200) {
          if (this.checkList.length === 0) {
            this.$message({ message: "请选择发送对象", type: "error" });
            this.textArea = this.textArea.replace(/(\s*$)/g, "");
            return false;
          }
          this.checkList.forEach((el) => {
            let uploadImgData = {
              chatType: "CLI_USER_IMAGE",
              id: Math.random(),
              tokenType: 0,
              fromChatId: "u" + localStorage.getItem("id"),
              toChatId: "u" + el.contactId,
              text: Encrypt(res.data, this.aesKey, this.aesIv), //TODO 加密
              token: getToken("token"),
              deviceId: localStorage.getItem("UUID"),
            };
            Socket.send(uploadImgData);
          });
          this.$message({ message: "发送讯息成功", type: "success" });
          this.fileList = [];
          this.uploadImgShow = false;
          this.fullscreenLoading = false;
          this.spreadMessageShow = false;
          this.disabled = true;
          setTimeout(() => {
            this.checkList = [];
            this.$router.push({ path: "/HiChat" });
          }, 500);
        } else if (res.code === 40001) {
          this.fileList = [];
          this.fullscreenLoading = false;
        }
      });
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
        } else {
          this.sendMessage();
        }
      }
    },
    // 发送消息
    sendMessage() {
      if (this.checkList.length === 0) {
        this.$message({ message: "请选择发送对象", type: "error" });
        this.textArea = this.textArea.replace(/(\s*$)/g, "");
        return false;
      } else if (!this.textArea.replace(/\s+/g, "")) {
        this.$alert("不能发送空白消息", "提示", {
          confirmButtonText: "确定",
        }).then(() => {
          this.textArea = "";
        });
        return false;
      }
      this.checkList.forEach((res) => {
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
      this.$message({ message: "讯息发送成功", type: "success" });
      this.spreadMessageShow = false;
      this.disabled = true;
      setTimeout(() => {
        this.checkList = [];
        this.$router.push({ path: "/HiChat" });
      }, 500);
      // 消息清空
      this.textArea = "";
      this.showDialog = false;
    },
    back() {
      this.$router.back(-1);
    },
  },
  components: {
    VEmojiPicker,
    SpreadCard,
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
    .home-search {
      margin: 0;
      padding: 15px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    ::v-deep.el-checkbox {
      display: flex;
      align-items: center;
      flex-flow: row-reverse;
      background-color: #fff;
      margin-right: 0;
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
::v-deep.el-dialog-spread {
  .el-dialog__header {
    border-bottom: 0 !important;
  }
  .el-dialog__body {
    border-bottom: 0 !important;
    .body-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        margin-top: 15px;
        font-size: 16px;
      }
    }
    .body-content {
      .body-content-list {
        min-height: 75px;
        max-height: 300px;
        overflow-y: auto;
      }
      margin-top: 15px;
      .address-box {
        padding: 1em 0 0 0;
        .content-box {
          width: auto;
          .content-border-bottom {
            width: 260px;
            position: relative;
          }
        }
      }
      .text-send-box {
        width: 230px;
        display: flex;
        align-items: center;
        background-color: #f4f4f4;
        border-radius: 5px;
        .el-textarea {
          .el-textarea__inner {
            padding: 10px !important;
            border-radius: 0;
            border: 0;
            background-color: transparent;
          }
        }
        .footer-tools {
          .face-icon {
            bottom: 152px;
            left: 0;
          }
          .send-button {
            width: 90px;
            padding: 7px 10px;
            margin-right: 20px;
            color: #ffffff;
            background-image: linear-gradient(
              180deg,
              rgba(67, 141, 255, 0.8),
              rgba(19, 99, 255, 0.8)
            );
          }
        }
      }
    }
  }
  .input-box {
    display: flex;
  }
  .input-tools-left,
  .input-tools-right {
    padding: 15px 0;
    margin: 0 25px 0 0;
    img {
      height: 1.1em;
      cursor: pointer;
    }
  }
  .el-dialog__footer {
    padding: 0 !important;
    margin: -35px 0 0 0;
    .dialog-footer {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      padding: 0 !important;
      .chat-menu-box {
        width: auto;
        background-color: rgba(225, 225, 225, 0.95);
        padding: 15px;
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
      .button {
        width: 80%;
        border: 0;
        padding: 15px 0 !important;
        color: #ffffff;
        background-color: #fe5f3f !important;
        margin: 13px auto;
        border-radius: 10px;
        cursor: pointer;
        cursor: pointer;
        &:nth-child(1) {
          border-radius: 8px !important;
        }
      }
    }
  }
}
::v-deep.el-dialog__wrapper {
  .el-dialog {
    .el-dialog__footer {
      padding: 0;
    }
  }
}
.chat-menu-box {
  .chat-menu {
    display: flex;
    .menu-li {
      div {
        i {
          font-size: 18px;
        }
      }
    }
  }
}
.spread-card-box {
  position: absolute;
  z-index: 99999;
  right: 0;
  top: 0;
}
</style>
