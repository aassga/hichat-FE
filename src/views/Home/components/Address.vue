<template>
  <div class="home-content" @touchmove="$root.handleTouch">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="联络人" name="address">
        <div class="address-box" v-for="(item, index) in newContactList" :key="index"
          @click="goContactPage(item, 'ContactPage')">
          <div :class="{ 'service-icon': serviceIcon(item) }"></div>
          <el-image :src="noIconShow(item, 'user')" />
          <div class="content-box">
            <div class="msg-box">
              <div :class="{ 'noOnline-tip': item.isOnline === '' }">
                <span style="margin-top: 1px">{{
                  item.name.slice(0, 10)
                }}</span>
                <span class="content-text" :class="item.isOnline === '在线' ? 'green-text' : 'gray-text'"
                  v-if="item.isOnline !== ''"><span>{{ item.isOnline }}</span></span>
              </div>
            </div>
            <div class="content-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="群组" name="group">
        <div class="address-box" v-for="(item, index) in groupData" :key="index"
          @click="goContactPage(item, 'GroupPage')">
          <el-image :src="noIconShow(item, 'group')" />
          <div class="content-box">
            <div class="msg-box">
              <div class="noOnline-tip">
                <span>{{ item.groupName.slice(0, 10) }}</span>
              </div>
            </div>
            <div class="content-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="可能认识" name="maybeKnow" v-if="maybeKnowList.length !== 0">
        <span slot="label" v-if="maybeKnowList.length !== 0">
          <span>可能认识</span>
          <el-badge v-if="maybeKnowList.length > 0" :value="maybeKnowList.length > 999 ? 999 : maybeKnowList.length
            " class="contact-badge"></el-badge>
        </span>
        <div class="address-box" v-for="(item, index) in maybeKnowList" :key="index">
          <div :class="{ 'service-icon': serviceIcon(item) }"></div>
          <el-image :src="noIconShow(item, 'user')" />
          <div class="content-box">
            <div class="msg-box">
              <div class="noOnline-tip">
                <span>{{ item.nickname.slice(0, 10) }}</span>
                <span class="add-img-style" @click="addContactBoxShow(item)">
                  <img v-if="device === 'pc'" src="./../../../../static/images/pc/user-plus.png" alt=""
                    style="height: 2em" />
                  <img v-else src="./../../../../static/images/add_user.png" alt="" style="height: 1.5em" />
                </span>
              </div>
            </div>
            <div class="content-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="device === 'pc' ? '添加联络人' : ''" :visible.sync="addContactShow" class="el-dialog-loginOut"
      width="70%" :show-close="false" :modal-append-to-body="false" :close-on-click-modal="false" center>
      <div class="loginOut-box">
        <div v-if="device !== 'pc'">
          <img src="./../../../../static/images/warn.png" alt="" />
        </div>
        <span>确认是否添加为联络人</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :class="device === 'pc' ? 'background-gray' : 'border-red'"
          @click="addContactShow = false">取消</el-button>
        <el-button class="background-red" @click="addContact()">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { getToken } from "_util/utils.js";
import { mapState, mapMutations } from "vuex";
import {
  getMemberActivity,
} from "@/api/memberProfileController";
import {
  addContactUser,
  getContactList,
  maybeKnow,
} from "@/api/memberContactController";
import { getGroupList } from "@/api/groupController";
import { showIcon, showServiceIcon } from "@/utils/icon";
export default {
  name: "Address",
  data() {
    return {
      activeName: "address",
      addInfo: {},
      groupData: [],
      contactList: [],
      newContactList: [],
      memberActivityData: [],
      addContactShow: false,
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.getMaybeKnow();
    this.setActiveName(this.activeName);
    this.userData = JSON.parse(localStorage.getItem("userData"));
    Socket.$on("message", this.handleGetMessage);
    this.memberTime = setInterval(() => {
      this.getUserMemberActivity(this.memberActivityData);
    }, 30000);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
    clearInterval(this.memberTime);
  },
  mounted() {
    this.homeScrollHeight();
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      chatUser: (state) => state.ws.chatUser,
      groupList: (state) => state.ws.groupList,
      groupUser: (state) => state.ws.groupUser,
      myUserInfo: (state) => state.ws.myUserInfo,
      maybeKnowList: (state) => state.ws.maybeKnowList,
      myContactDataList: (state) => state.ws.myContactDataList,
    }),
  },
  watch: {
    chatUser(val) {
      if (Object.keys(val).length !== 0) this.getMaybeKnow();
    },
    myContactDataList(val) {
      this.newContactList = val;
    },
    groupList(val) {
      this.groupData = val;
    },
    maybeKnowList(val) {
      this.maybeKnowDataList = val;
    },
  },
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
      setChatUser: "ws/setChatUser",
      setChatGroup: "ws/setChatGroup",
      setAuthority: "ws/setAuthority",
      setGroupList: "ws/setGroupList",
      setMsgInfoPage: "ws/setMsgInfoPage",
      setActiveName: "ws/setActiveName",
      setMaybeKnowNum: "ws/setMaybeKnowNum",
      setMaybeKnowList:"ws/setMaybeKnowList",
      setMyContactDataList: "ws/setMyContactDataList",
    }),
    homeScrollHeight() {
      let scrollTop = document.querySelector(".home-content");
      let headerScrollTop = document.querySelector(".is-top");
      let tabsContentHeight =
        scrollTop.clientHeight - headerScrollTop.scrollHeight;
      document.querySelector(".el-tabs__content").style.height =
        tabsContentHeight + "px";
    },
    addContactBoxShow(data) {
      this.addContactShow = true;
      this.addInfo = data;
    },
    addContact() {
      let params = {
        contactId: this.addInfo.memberId,
      };
      addContactUser(params).then((res) => {
        if (res.code === 200) {
          this.$message({ message: "添加成功", type: "success" });
          this.addContactShow = false;
          this.addInfo = {};
          this.getMaybeKnow();
        }
      });
    },
    handleClick() {
      this.setInfoMsg({ infoMsgShow: false });
      this.setActiveName(this.activeName);
      if (this.activeName === "address") {
        this.memberTime = setInterval(() => {
          this.getUserMemberActivity(this.memberActivityData);
        }, 30000);
      } else if(this.activeName === "maybeKnow"){
        this.getMaybeKnow()
      } else {
        clearInterval(this.memberTime);
      }
    },
    getDataList() {
      getContactList().then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((el) => {
          if (el.contactId === localStorage.getItem("id")) {
            el.name = "嗨聊记事本";
            el.icon = require("./../../../../static/images/image_savemessage.png");
            el.toChatId = "u" + el.memberId;
          } else if (!el.icon) {
            el.icon = require(`./../../../../static/images/image_user_defult.png`);
          }
          this.memberActivityData.push(el.contactId);
        });
        this.getUserMemberActivity(this.memberActivityData);
      });
      getGroupList().then((res) => {
        this.groupData = res.data.list;
        this.setGroupList(this.groupData);
      });
    },
    getMaybeKnow() {
      maybeKnow().then((res) => {
        if (res.data.length === 0) this.activeName = "address";
        this.setMaybeKnowNum(res.data.length);
        this.setMaybeKnowList(res.data);
        this.getDataList();
      });
    },
    serviceIcon(icon) {
      return showServiceIcon(icon)
    },
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    getUserMemberActivity(data) {
      let memberId = data;
      getMemberActivity({ memberId }).then((res) => {
        if (res.code === 200) {
          this.userTimeData = res.data;
          this.contactList.forEach((list) => {
            this.userTimeData.forEach((data) => {
              if (list.contactId === JSON.stringify(data.memberId)) {
                if (data.lastActivityTime === 0 || list.name === "嗨聊记事本") {
                  return "";
                } else {
                  let nowTime = data.currentTime;
                  let lastTime = data.lastActivityTime;

                  const diffInMills = nowTime - lastTime;
                  if (diffInMills / 1000 < 300) {
                    return (list.isOnline = "在线");
                  } else {
                    return (list.isOnline =
                      "上次上线于" + this.$root.formatTimeS(lastTime));
                  }
                }
              }
            });
          });
          this.setMyContactDataList(this.contactList);
        }
      });
    },
    goContactPage(data, path) {
      if (path === "ContactPage") {
        data.toChatId = "u" + data.contactId;
        data.type = this.device === "pc" ? "address" : "";
        this.setChatUser(data);
      } else {
        data.toChatId = "g" + data.groupId;
        data.type = this.device === "pc" ? "address" : "";
        this.setChatGroup(data);
        if (data.isAdmin) {
          localStorage.removeItem("authority");
        } else if (data.isManager) {
          this.setAuthority(data.authority);
        } else if (!data.isAdmin && !data.isManager) {
          localStorage.removeItem("authority");
        }
      }
      if (this.device === "mobile") {
        this.$router.push({ name: path });
      } else {
        this.setMsgInfoPage({ pageShow: true, type: "" });
      }
      this.setInfoMsg({
        infoMsgNav: path,
        infoMsgShow: true,
        infoMsgChat: false,
        infoMsgMap: "address",
      });
    },
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
        case "SRV_EDIT_CONTACT":
          if (userInfo.chatType === "SRV_EDIT_CONTACT") {
            this.getMaybeKnow();
          }
          this.$root.getHiChatDataList();
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.home-content {
  overflow: hidden !important;

  .address-box {
    cursor: pointer;

    .content-box {
      .msg-box {
        width: auto;

        .content-text {
          span {
            &:nth-child(2) {
              opacity: 1;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}

::v-deep.el-dialog-loginOut {
  .el-dialog__footer {
    padding: 0 !important;

    .el-button {
      padding: 20px !important;
      border-radius: 0 !important;

      &:nth-child(2) {
        border-left: 1px solid #efefef !important;
      }
    }
  }
}

.contact-badge {
  vertical-align: initial;
  top: -9px;
}

.hichat-mobile {
  .el-dialog-loginOut {
    ::v-deep.el-dialog {
      border-radius: 20px;
      position: relative;

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
        padding: 20px !important;
        padding-top: 10px !important;
        text-align: right;
        box-sizing: border-box;

        .dialog-footer {
          display: flex;
          justify-content: space-between;

          .el-button {
            width: 100%;
            border-radius: 8px !important;
            padding: 12px 20px !important;
          }

          .background-red {
            background-color: #ee5253;
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

.add-img-style {
  position: absolute;
  right: 1.5em;
  margin-top: -5px
}
</style>

