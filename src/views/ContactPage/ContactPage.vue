<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <div class="home-header">
            <div class="home-user" @click="back"></div>
            <span class="home-header-title"></span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="user-data">
            <div class="info-box">
              <div :class="{ 'service-icon': userContact.isCustomerService }"></div>
              <el-image :src="noIconShow(userContact, 'user')" :preview-src-list="[noIconShow(userContact, 'user')]"/>
            </div>
            <div>
              <span
                :style="userContact.name === '嗨聊记事本' ? 'height:2em' : ''"
                >{{ userContact.name }}</span
              >
              <span
                class="user-data-id"
                v-if="userContact.name !== '嗨聊记事本'"
              >
                ID :
                <span class="user-paste" @click="copyID()">{{
                  userContact.username
                }}</span>
              </span>
              <div
                v-if="
                  userContact.name !== '嗨聊记事本' && userContact.isContact
                "
                class="group-edit-btn"
                @click="$router.push({ path: '/EditContact' })"
              >
                <img src="./../../../static/images/edit.png" alt="" />
                <span class="group-edit-text">编辑联络人昵称</span>
              </div>
            </div>
          </div>
          <template v-if="userContact.name === '嗨聊记事本'">
            <div
              class="setting-button"
              v-for="(item, index) in saveSettingData"
              :key="index"
            >
              <a @click="goChatRoom(userContact, item.path)">
                <div class="setting-button-left">
                  <img :src="item.icon" alt="" />
                  <span>{{ item.name }}</span>
                </div>
                <img src="./../../../static/images/next.png" alt="" />
              </a>
            </div>
          </template>
          <template v-else>
            <div
              class="setting-button"
              v-for="(item, index) in settingData"
              :key="index"
            >
              <a @click="goChatRoom(userContact, item.path)">
                <div class="setting-button-left">
                  <img :src="item.icon" alt="" />
                  <span>{{ item.name }}</span>
                </div>
                <img src="./../../../static/images/next.png" alt="" />
              </a>
            </div>

            <!-- <div
              class="setting-notification"
            >
              <div class="setting-button-left">
                <img src="./../../../static/images/notification.png" alt="" />
                <span>提醒通知</span>
              </div>
              <el-switch
                v-model="notification"
                active-color="#fd5f3f"
                inactive-color="#666666"
                disabled
              >
              </el-switch>
            </div>
            -->
            <template
              v-if="groupUser.isAdmin && infoMsg.infoMsgMap === 'GroupPeople'"
            >
              <div
                class="setting-button mt10"
                @click="
                  dialogShow(!userContact.isBanPost ? 'banPost' : 'unBanPost')
                "
              >
                <a>
                  <div class="setting-button-left">
                    <img src="./../../../static/images/octagon.png" alt="" />
                    <span>{{
                      !userContact.isBanPost ? "禁言联络人" : "解除禁言"
                    }}</span>
                  </div>
                </a>
              </div>
            </template>
            <template
              v-if="groupUser.isManager && infoMsg.infoMsgMap === 'GroupPeople'"
            >
              <div
                v-if="!userContact.isAdmin && !userContact.isManager"
                class="setting-button mt10"
                @click="
                  dialogShow(!userContact.isBanPost ? 'banPost' : 'unBanPost')
                "
              >
                <a>
                  <div class="setting-button-left">
                    <img src="./../../../static/images/octagon.png" alt="" />
                    <span>{{
                      !userContact.isBanPost ? "禁言联络人" : "解除禁言"
                    }}</span>
                  </div>
                </a>
              </div>
            </template>

            <div
              class="setting-button"
              @click="dialogShow(!userContact.isBlock ? 'block' : 'unBlock')"
            >
              <a>
                <div class="setting-button-left">
                  <img src="./../../../static/images/blockade.png" alt="" />
                  <span>{{
                    !userContact.isBlock ? "封锁联络人" : "解除封锁"
                  }}</span>
                </div>
              </a>
            </div>
            <div
              class="setting-button"
              @click="dialogShow(!userContact.isContact ? 'add' : 'delete')"
            >
              <a>
                <div class="setting-button-left">
                  <img
                    :src="
                      require(`./../../../static/images/${
                        !userContact.isContact ? 'add_user' : 'trash'
                      }.png`)
                    "
                    alt=""
                  />
                  <span class="red-text">{{ contactText }}</span>
                </div>
              </a>
            </div>
            <div
              v-if="infoMsg.infoMsgMap === 'HiChat'"
              class="setting-button"
              @click="isDialogShow = true"
            >
              <a>
                <div class="setting-button-left">
                  <img
                    :src="
                      require(`./../../../static/images/${
                        !userContact.isContact ? 'add_user' : 'trash'
                      }.png`)
                    "
                    alt=""
                  />
                  <span class="red-text">刪除對話</span>
                </div>
              </a>
            </div>
          </template>
        </div>
      </el-main>
    </el-container>

    <el-dialog
      :visible.sync="isDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/warn.png" alt="" /></div>
        <span>確定要刪除對話</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="isDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="deleteMessage()"
          >确认</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="settingDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/warn.png" alt="" /></div>
        <span>{{ dialogContent }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="settingDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="submitBtn(dialogContent)"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="addContactDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/success.png" alt="" /></div>
        <span>已加入联络人</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="back()">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="successDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/success.png" alt="" /></div>
        <span>操作成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="back">確認</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="disableDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/success.png" alt="" /></div>
        <span>操作成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="disableDialogShow = false"
          >確認</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { copyPaste } from "@/utils/urlCopy.js";
import { mapState, mapMutations } from "vuex";
import { deleteRecentChat } from "@/api/chatController";
import { setBanPostByPersonal } from "@/api/groupController";
import { getSearchById } from "@/api/memberProfileController";
import {
  addContactUser,
  deleteContactUser,
} from "@/api/memberContactController";
import {
  addBlockContactUser,
  unBlockContactUser,
} from "@/api/memberBlockController";
import { showIcon } from "@/utils/icon";

export default {
  name: "ContactPage",
  data() {
    return {
      userData: {},
      userContact: {},
      saveSettingData: [
        {
          name: "传送讯息",
          icon: require("./../../../static/images/chat_icon.png"),
          path: "ChatMsg",
        },
      ],
      settingData: [
        {
          name: "传送讯息",
          icon: require("./../../../static/images/chat_icon.png"),
          path: "ChatMsg",
        },
        // {
        //   name: "在对话中搜寻",
        //   icon: require("./../../../static/images/search.png"),
        //   path: "",
        // },
        // {
        //   name: "查看相片和影片",
        //   icon: require("./../../../static/images/image_icon.png"),
        //   path: "",
        // },
      ],
      contactText: "",
      dialogContent: "",
      notification: true,
      isDialogShow: false,
      successDialogShow: false,
      settingDialogShow: false,
      disableDialogShow: false,
      addContactDialogShow: false,
    };
  },
  computed: {
    ...mapState({
      chatUser: (state) => state.ws.chatUser,
      groupUser: (state) => state.ws.groupUser,
      infoMsg: (state) => state.ws.infoMsg,
      myUserInfo: (state) => state.ws.myUserInfo,
    }),
  },
  watch: {
    chatUser(val) {
      this.userContact = val;
    },
  },
  created() {
    if (Object.keys(this.$route.params).length !== 0) {
      this.userContact = this.$route.params;
    } else {
      this.userContact = this.chatUser;
    }
    this.getUserId();
  },
  methods: {
    ...mapMutations({
      setChatUser: "ws/setChatUser",
    }),
    filterContact() {
      return (this.contactText = !this.userContact.isContact
        ? "加入联络人"
        : "刪除联络人");
    },
    deleteMessage() {
      let params = {
        fullDelete: true,
        historyId: "",
        toChatId: this.userContact.toChatId,
      };
      deleteRecentChat(params).then((res) => {
        if (res.code === 200) {
          localStorage.removeItem("userData");
          this.$router.push({ path: "/Address" });
        }
      });
    },
    getUserId() {
      let id = this.userContact.toChatId.replace("u", "");
      getSearchById({ id }).then((res) => {
        if (res.data.id === this.myUserInfo.id) {
          this.userContact.name = "嗨聊记事本";
          this.userContact.icon = require("./../../../static/images/image_savemessage.png");
        } else {
          this.userContact.username = res.data.username;
          this.userContact.name = res.data.name;
        }
        this.blockContent = !res.data.isBlock ? "封锁联络人" : "解除封锁";
        this.userContact.isBlock = res.data.isBlock;
        this.userContact.isContact = res.data.isContact;
        if (Object.keys(this.$route.params).length === 0) {
          this.setChatUser(this.userContact);
        }
        this.filterContact();
      });
    },
    copyID() {
      copyPaste(this.userContact.username);
    },
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    goChatRoom(data, path) {
      this.setChatUser(data);
      this.$router.push({ name: path, params: data });
    },
    back() {
      this.$router.back(-1);
    },
    dialogShow(type) {
      this.settingDialogShow = true;
      const userContact = this.userContact.name
      const ban = {
        "banPost":`确认是否禁言联络人${userContact}？`,
        "unBanPost":`确认是否解除禁言联络人${userContact}？`,
        "block":`确认是否封锁联络人${userContact}？`,
        "unBlock":`确认是否解除封锁联络人${userContact}？`,
        "delete":`确认是否删除联络人${userContact}？`,
        "add":`确认是否将${userContact}加入联络人`,
      }
      this.dialogContent = ban[type]
    },
    submitBtn(dialogContent) {
      switch (dialogContent) {
        case `确认是否封锁联络人${this.userContact.name}？`:
          let blockId = this.userContact.toChatId.replace("u", "");
          addBlockContactUser({ blockId }).then((res) => {
            if (res.code === 200) {
              this.disableDialogShow = true;
              this.settingDialogShow = false;
              this.userContact.isBlock = true;
            }
          });
          break;
        case `确认是否解除封锁联络人${this.userContact.name}？`:
          let blockIdList = [this.userContact.toChatId.replace("u", "")];
          unBlockContactUser({ blockIdList }).then((res) => {
            if (res.code === 200) {
              this.disableDialogShow = true;
              this.settingDialogShow = false;
              this.userContact.isBlock = false;
            }
          });
          break;
        case `确认是否删除联络人${this.userContact.name}？`:
          let contactId = this.userContact.toChatId.replace("u", "");
          deleteContactUser(contactId)
            .then((res) => {
              if (res.code === 200) {
                this.successDialogShow = true;
                this.userContact.isContact = false;
                this.$root.getMaybeKnow();
              }
            })
          break;
        case `确认是否将${this.userContact.name}加入联络人`:
          let params = {
            contactId: this.userContact.memberId,
          };
          addContactUser(params).then((res) => {
            if (res.code === 200) {
              this.settingDialogShow = false;
              this.userContact.isContact = true;
              this.addContactDialogShow = true;
            }
          });
          break;
        case `确认是否禁言联络人${this.userContact.name}？`:
          let banPost = {
            groupId: this.userContact.groupId,
            isBanPost: true,
            memberId: this.userContact.memberId,
          };
          setBanPostByPersonal(banPost).then((res) => {
            if (res.code === 200) {
              this.successDialogShow = true;
              this.userContact.isBanPost = false;
            }
          });
          break;
        case `确认是否解除禁言联络人${this.userContact.name}？`:
          let unBanPost = {
            groupId: this.userContact.groupId,
            isBanPost: false,
            memberId: this.userContact.memberId,
          };
          setBanPostByPersonal(unBanPost).then((res) => {
            if (res.code === 200) {
              this.successDialogShow = true;
              this.userContact.isBanPost = true;
            }
          });
          break;
      }
    },
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
  }
  .home-content {
    .user-data {
      .group-edit-btn {
        width: 200px;
        height: 30px;
        line-height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ff6900;
        border-radius: 5px;
        color: #ff6900;
        margin: 2em auto 0 auto;
        img {
          height: 1em;
          margin-right: 5px;
        }
        .group-edit-text {
          width: 1em;
          font-size: 13px;
          display: contents;
        }
      }
      .user-data-id {
        margin: -3.5em 0 -5em 0;
        font-size: 13px;
        color: #b3b3b3;
      }
      .user-paste {
        width: 1em;
        display: contents;
      }
      span {
        display: block;
        text-align: center;
        height: 4.5em;
        font-weight: 600;
      }
    }
    .setting-button {
      padding: 0.5em 0 0.5em 0.5em;
      background-color: #fff;
      &::after {
        content: "";
        display: block;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        width: 100%;
        margin-left: 10px;
        position: relative;
        top: 9px;
      }
      a {
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5em 0.7em 0.5em 0;
        margin-left: 10px;
      }
      img {
        height: 1.2em;
      }
      .setting-button-left {
        display: flex;
        align-items: center;
        width: 20em;
        span {
          margin-left: 1em;
          font-size: 15px;
          color: #333333;
        }
      }
    }
    .setting-notification {
      padding: 1em 0.5em;
      background-color: #fff;
      margin: 1em 0;
      display: flex;
      justify-content: space-between;
      align-content: center;
      img {
        height: 1.2em;
      }
      .setting-button-left {
        display: flex;
        align-items: center;
        margin-left: 10px;
        width: 20em;
        span {
          margin-left: 1em;
          font-size: 15px;
          color: #333333;
        }
      }
    }
    .red-text {
      color: #ee5253 !important;
    }
    .mt10 {
      margin-top: 1em;
    }
  }

  ::v-deep.el-dialog-loginOut {
    overflow: auto;
    .el-dialog {
      position: relative;
      margin: 0 auto 50px;
      background: #ffffff;
      border-radius: 10px;
      box-sizing: border-box;
      width: 50%;
      .el-dialog__header {
        padding: 10px;
      }
      .el-dialog__body {
        text-align: center;
        padding: 25px 25px 15px;
        .loginOut-box {
          img {
            height: 5em;
            margin-bottom: 1.2em;
          }
        }
      }
      .el-dialog__footer {
        padding: 20px;
        padding-top: 10px;
        text-align: right;
        box-sizing: border-box;
        .dialog-footer {
          display: flex;
          justify-content: space-between;
          .el-button {
            width: 100%;
            border-radius: 8px;
          }
          .background-red {
            background-color: #ee5253;
            color: #fff;
          }
          .background-orange {
            background-color: #fe5f3f;
            color: #fff;
          }
          .border-red {
            border: 1px solid #fe5f3f;
            color: #fe5f3f;
          }
        }
      }
    }
  }
}
.info-box{
  display: flex;
  justify-content: center;
  
}
</style>
