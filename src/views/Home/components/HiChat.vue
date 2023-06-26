<template>
  <div class="home-content" @touchmove="$root.handleTouch">
    <el-tabs v-model="hichatNav.type" @tab-click="handleClick">
      <el-tab-pane label="联络人讯息" name="address">
        <span slot="label" v-if="newHiChatDataList.length > 0">
          <span>联络人讯息 </span>
          <el-badge
            v-if="hiChatNumBadge > 0"
            :value="hiChatNumBadge > 999 ? 999 : hiChatNumBadge"
            class="contact-badge"
          ></el-badge>
        </span>
        <div
          v-for="(item, index) in newHiChatDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item, 'ChatMsg')"
          @contextmenu.prevent.stop="onContextmenu(item, 'user')"
        >
          <el-badge
            is-dot
            class="item"
            type="success"
            :class="{ 'no-show': !onlineMsg(item) }"
          >
            <div :class="{ 'service-icon': serviceIcon(item) }"></div>
            <el-image :src="noIconShow(item, 'user')" />
          </el-badge>
          <div class="content-box">
            <div class="msg-box">
              <div>
                <span
                  >{{ groupSliceName(item) }}
                  <img
                    :src="muteImg"
                    v-if="
                      device === 'pc' && !!item.setting  && !item.setting.prompt
                    "
                    style="padding-left: 5px"
                  />
                </span>
                <span class="content-text">
                  <span v-if="!item.lastChat"></span>
                  <span v-else-if="srvData(item.lastChat.chatType)">{{
                    filterNameChat(item)
                  }}</span>
                </span>
              </div>
              <div class="time" v-if="item.lastChat">
                {{ nowYearFormat(item) }}
                <div class="el-badge-box">
                  <el-badge
                    :value="item.unreadCount > 999 ? 999 : item.unreadCount"
                    class="item"
                    v-if="item.unreadCount !== 0"
                  ></el-badge>
                </div>
              </div>
            </div>
            <div class="content-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="群组讯息" name="group">
        <span slot="label" v-if="newGroupDataList.length > 0">
          <span>群组讯息</span>
          <el-badge
            v-if="groupNumBadge > 0"
            :value="groupNumBadge > 999 ? 999 : groupNumBadge"
            class="contact-badge"
          ></el-badge>
        </span>
        <div
          v-for="(item, index) in newGroupDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item, 'ChatGroupMsg')"
          @contextmenu.prevent.stop="onContextmenu(item, 'group')"
        >
          <el-image :src="noIconShow(item, 'group')" />
          <div class="content-box">
            <div class="msg-box">
              <div>
                <span
                  >{{ groupSliceName(item) }} ({{ item.memberCount }})
                  <img
                    :src="muteImg"
                    v-if="
                      device === 'pc' && !item.setting && !item.setting.prompt
                    "
                    style="padding-left: 5px"
                  />
                </span>
                <span class="content-text">
                  <span v-if="!item.lastChat"></span>
                  <span
                    v-else-if="item.lastChat.chatType === 'SRV_GROUP_SEND'"
                    v-html="filterChatType(item)"
                  ></span>
                  <span v-else-if="srvData(item.lastChat.chatType)">{{
                    filterChatType(item)
                  }}</span>
                </span>
              </div>
              <div class="time" v-if="item.lastChat">
                {{ nowYearFormat(item) }}
                <div class="el-badge-box">
                  <el-badge
                    :value="item.unreadCount > 999 ? 999 : item.unreadCount"
                    class="item"
                    v-if="item.unreadCount !== 0"
                  ></el-badge>
                </div>
              </div>
            </div>
            <div class="content-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="陌生讯息"
        name="contact"
        v-if="newContactDataList.length > 0"
      >
        <span slot="label" v-if="newContactDataList.length > 0">
          <span>陌生讯息</span>
          <el-badge
            v-if="contactNumBadge > 0"
            :value="contactNumBadge > 999 ? 999 : contactNumBadge"
            class="contact-badge"
          ></el-badge>
        </span>
        <div
          v-for="(item, index) in newContactDataList"
          :key="index"
          class="address-box"
          @click="
            goChatRoom(item, device === 'mobile' ? 'ChatMsg' : 'ChatContact')
          "
          @contextmenu.prevent.stop="onContextmenu(item, 'contact')"
        >
          <el-badge
            is-dot
            class="item"
            type="success"
            :class="{ 'no-show': !onlineMsg(item) }"
          >
            <div :class="{ 'service-icon': serviceIcon(item) }"></div>
            <el-image :src="noIconShow(item, 'user')" />
          </el-badge>
          <div class="content-box">
            <div class="msg-box">
              <div>
                <span>{{ groupSliceName(item) }}</span>
                <span class="content-text">
                  <span v-if="!item.lastChat"></span>
                  <span v-else-if="srvData(item.lastChat.chatType)">{{
                    filterNameChat(item)
                  }}</span>
                </span>
              </div>
              <div class="time" v-if="item.lastChat">
                {{ nowYearFormat(item) }}
                <div class="el-badge-box">
                  <el-badge
                    :value="item.unreadCount > 999 ? 999 : item.unreadCount"
                    class="item"
                    v-if="item.unreadCount !== 0"
                  ></el-badge>
                </div>
              </div>
            </div>
            <div class="content-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="刪除對話"
      :visible.sync="deleteGroupDialogShow"
      class="el-dialog-loginOut"
      :width="device === 'mobile' ? '70%':'20%'"
      :show-close="false"
      :close-on-click-modal="false"
      append-to-body
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
        <el-button class="background-red" @click="deleteRecent(dialogData)"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { getToken } from "_util/utils.js";
import AESBase64 from "@/utils/AESBase64.js";
import { mapState, mapMutations } from "vuex";
import { deleteRecentChat } from "@/api/chatController";
import { getMemberActivity } from "@/api/memberProfileController";
import { updateContactNickName } from "@/api/memberContactController";
import {
  getGroupList,
  groupMemberList,
  getGroupAuthoritySetting,
  updateGroup,
} from "@/api/groupController";
import voiceStatus from "@/utils/voiceStatus";
import homeStatus from "@/utils/homeStatus";
import { showIcon,showServiceIcon } from "@/utils/icon";

export default {
  name: "HiChat",
  data() {
    return {
      groupList: [],
      dialogData: {},
      authorityData: {},
      groupDataList: [],
      contactDataList: [],
      newGroupDataList: [],
      newHiChatDataList: [],
      noGroupPeopleData: [],
      newContactDataList: [],
      groupMemberDataList: {},
      activeName: "address",
      isDialogShow: false,
      deleteGroupDialogShow: false,
      muteImg: require("./../../../../static/images/icon_notification.svg"),
      noMuteImg: require("./../../../../static/images/volume.svg"),
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
      device: localStorage.getItem("device"),
    };
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
    // this.getGroupDataList();
    this.setActiveName(this.hichatNav.type);
    if (this.hichatNav.type !== "group") {
      this.memberTime = setInterval(() => {
        this.getUserMemberActivity(this.noGroupPeopleData);
      }, 30000);
    }
    this.recentChatInitial();
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
    clearInterval(this.memberTime);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      chatUser: (state) => state.ws.chatUser,
      groupUser: (state) => state.ws.groupUser,
      hichatNav: (state) => state.ws.hichatNav,
      myUserInfo: (state) => state.ws.myUserInfo,
      contactUser: (state) => state.ws.contactUser,
      chatMsgKey: (state) => state.ws.chatMsgKey,
      recentChat: (state) => state.ws.recentChat,
      myContactDataList: (state) => state.ws.myContactDataList,
      authorityGroupData: (state) => state.ws.authorityGroupData,
    }),
  },
  mounted() {
    this.$root.getHiChatDataList();
    this.homeScrollHeight();
    this.getGroupMemberList();
  },
  watch: {
    contactDataList(val) {
      if (this.hichatNav.type === "contact" && val.length === 0) {
        this.setHichatNav({ type: "address", num: 1 });
      }
    },
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
      setTopMsg: "ws/setTopMsg",
      setInfoMsg: "ws/setInfoMsg",
      setChatUser: "ws/setChatUser",
      setChatGroup: "ws/setChatGroup",
      setCheckBoxBtn: "ws/setCheckBoxBtn",
      setContactUser: "ws/setContactUser",
      setAuthority: "ws/setAuthority",
      setHichatNav: "ws/setHichatNav",
      setGroupList: "ws/setGroupList",
      setActiveName: "ws/setActiveName",
      setRecentChat: "ws/setRecentChat",
      setTopMsgShow: "ws/setTopMsgShow",
      setGroupMemberDataList: "ws/setGroupMemberDataList",
      setAuthorityGroupData: "ws/setAuthorityGroupData",
    }),
    serviceIcon(icon){
      return showServiceIcon(icon)
    },
    srvData(data) {
      return homeStatus.includes(data);
    },
    recentChatInitial() {
      this.groupDataList = [];
      this.groupNumBadge = 0;
      this.hiChatNumBadge = 0;
      this.contactNumBadge = 0;
      this.recentChat.forEach((item) => {
        if (item.isContact) {
          if (item.forChatId === item.toChatId) {
            item.name = "嗨聊记事本";
            item.icon = require("./../../../../static/images/image_savemessage.png");
            item.contactId = item.forChatId.replace("u", "")
          }
          this.hiChatNumBadge += item.unreadCount;
        } else if (item.isGroup) {
          this.groupDataList.push(item);
          this.groupNumBadge += item.unreadCount;
        } else if (!item.isContact && item.lastChat) {
          this.contactNumBadge += item.unreadCount;
        }
      });
      this.noGroupPeopleData = this.recentChat.filter((res) => !res.isGroup);

      this.calloutList();
      this.getUserMemberActivity(this.noGroupPeopleData);
    },
    nowYearFormat(data) {
      let lastTime = this.$root.formatTimeS(data.lastChatHistory.sendTime);
      var now = new Date();
      let year = now.getFullYear();
      var lastOnlineTime = new Date(lastTime);
      let lastYear = lastOnlineTime.getFullYear();

      if (
        this.$root.formatTime(now) ===
        this.$root.formatTime(data.lastChatHistory.sendTime)
      ) {
        return this.$root.formatTimeSecound(lastTime);
      } else if (lastYear === year) {
        return this.$root.formatNowYear(lastTime);
      } else if (lastYear < year) {
        return this.$root.formatTimeS(lastTime);
      }
    },
    filterNameChat(el) {
      let type = el.lastChat.chatType;
      let nickName = el.lastChatHistory.chat.fromChatNickname;
      if (voiceStatus.includes(type)) {
        return "网页版不支援通话功能，请至APP中进行操作。";
      } else {
        switch (type) {
          case "SRV_USER_SEND":
          case "SRV_GROUP_SEND":
            
            return this.judgeTextMarking(el);
          case "SRV_USER_FILE":
            return "传送了档案";
          case "SRV_USER_AUDIO":
          case "SRV_GROUP_AUDIO":
            return "传送了语音";
          case "SRV_USER_IMAGE":
          case "SRV_GROUP_IMAGE":
            return "传送了图片";
          case "SRV_CONTACT_CARD":
            return "传送了联络人名片";
          case "SRV_CHAT_PIN":
            return nickName + "置顶了消息";
          case "SRV_GROUP_JOIN":
            return nickName + "加入了聊天室";
          case "SRV_GROUP_DEL":
            return nickName + "離開了聊天室";
          case "SRV_GROUP_ADD_MANAGER_HISTORY":
            return nickName + "已被指定為管理員";
          case "SRV_GROUP_REMOVE_MANAGER_HISTORY":
            return nickName + "已被解除管理員身份";
          case "SRV_GROUP_CHANGE_ADMIN_HISTORY":
            return "群主變更為" + nickName;
        }
      }
    },
    groupSliceName(item) {
      let leftName = item.name.substring(0, 4);
      let stringlength = item.name.length;
      let rightName = item.name.substring(stringlength - 3, stringlength);
      if (item.name.length > 7) {
        return leftName + "..." + rightName;
      } else {
        return item.name;
      }
    },
    filterChatType(el) {
      let type = el.lastChat.chatType;
      if (voiceStatus.includes(type)) {
        return "网页版不支援通话功能，请至APP中进行操作。";
      } else {
        switch (type) {
          case "SRV_USER_SEND":
          case "SRV_GROUP_SEND":
            return this.judgeTextMarking(el);
          case "SRV_USER_FILE":
            return "传送了档案";
          case "SRV_USER_AUDIO":
          case "SRV_GROUP_AUDIO":
            return "传送了语音";
          case "SRV_USER_IMAGE":
          case "SRV_GROUP_IMAGE":
            return "传送了图片";
          case "SRV_GROUP_FILE":
            return "传送了档案";
          case "SRV_CHAT_PIN":
          case "SRV_GROUP_JOIN":
          case "SRV_GROUP_DEL":
          case "SRV_GROUP_ADD_MANAGER_HISTORY":
          case "SRV_GROUP_REMOVE_MANAGER_HISTORY":
          case "SRV_GROUP_CHANGE_ADMIN_HISTORY":
            if (
              (el.groupAuthority.showGroupNumber &&
                el.groupAuthority.editGroupNickname) ||
              (el.groupAuthority.showGroupNumber &&
                !el.groupAuthority.editGroupNickname)
            ) {
              if (
                !el.lastChatHistory.chat.fromChatGroupNickname &&
                !el.lastChatHistory.chat.fromChatGroupNumber
              ) {
                switch (type) {
                  case "SRV_CHAT_PIN":
                    return "未知成员置顶了消息";
                  case "SRV_GROUP_JOIN":
                    return "未知成员加入了聊天室";
                  case "SRV_GROUP_DEL":
                    return "未知成员離開了聊天室";
                  case "SRV_GROUP_ADD_MANAGER_HISTORY":
                    return "未知成员已被指定為管理員";
                  case "SRV_GROUP_REMOVE_MANAGER_HISTORY":
                    return "未知成员已被解除管理員身份";
                  case "SRV_GROUP_CHANGE_ADMIN_HISTORY":
                    return "群主變更為未知成员";
                }
              } else if (
                !el.lastChatHistory.chat.fromChatGroupNickname ||
                (el.groupAuthority.showGroupNumber &&
                  !el.groupAuthority.editGroupNickname)
              ) {
                switch (type) {
                  case "SRV_CHAT_PIN":
                    return (
                      "成员" +
                      el.lastChatHistory.chat.fromChatGroupNumber +
                      "置顶了消息"
                    );
                  case "SRV_GROUP_JOIN":
                    return (
                      "成员" +
                      el.lastChatHistory.chat.fromChatGroupNumber +
                      "加入了聊天室"
                    );
                  case "SRV_GROUP_DEL":
                    return (
                      "成员" +
                      el.lastChatHistory.chat.fromChatGroupNumber +
                      "離開了聊天室"
                    );
                  case "SRV_GROUP_ADD_MANAGER_HISTORY":
                    return (
                      "成员" +
                      el.lastChatHistory.chat.fromChatGroupNumber +
                      "已被指定為管理員"
                    );
                  case "SRV_GROUP_REMOVE_MANAGER_HISTORY":
                    return (
                      "成员" +
                      el.lastChatHistory.chat.fromChatGroupNumber +
                      "已被解除管理員身份"
                    );
                  case "SRV_GROUP_CHANGE_ADMIN_HISTORY":
                    return (
                      "群主變更為成员" +
                      el.lastChatHistory.chat.fromChatGroupNumber
                    );
                }
              } else if (
                el.groupAuthority.showGroupNumber &&
                el.groupAuthority.editGroupNickname
              ) {
                switch (type) {
                  case "SRV_CHAT_PIN":
                    return (
                      el.lastChatHistory.chat.fromChatGroupNickname +
                      "置顶了消息"
                    );
                  case "SRV_GROUP_JOIN":
                    return (
                      el.lastChatHistory.chat.fromChatGroupNickname +
                      "加入了聊天室"
                    );
                  case "SRV_GROUP_DEL":
                    return (
                      el.lastChatHistory.chat.fromChatGroupNickname +
                      "離開了聊天室"
                    );
                  case "SRV_GROUP_ADD_MANAGER_HISTORY":
                    return (
                      el.lastChatHistory.chat.fromChatGroupNickname +
                      "已被指定為管理員"
                    );
                  case "SRV_GROUP_REMOVE_MANAGER_HISTORY":
                    return (
                      el.lastChatHistory.chat.fromChatGroupNickname +
                      "已被解除管理員身份"
                    );
                  case "SRV_GROUP_CHANGE_ADMIN_HISTORY":
                    return (
                      "群主變更為" +
                      el.lastChatHistory.chat.fromChatGroupNickname
                    );
                }
              }
            } else if (
              !el.groupAuthority ||
              (!el.groupAuthority.showGroupNumber &&
                !el.groupAuthority.editGroupNickname)
            ) {
              switch (type) {
                case "SRV_CHAT_PIN":
                  return (
                    el.lastChatHistory.chat.fromChatNickname + "置顶了消息"
                  );
                case "SRV_GROUP_JOIN":
                  return (
                    el.lastChatHistory.chat.fromChatNickname + "加入了聊天室"
                  );
                case "SRV_GROUP_DEL":
                  return (
                    el.lastChatHistory.chat.fromChatNickname + "離開了聊天室"
                  );
                case "SRV_GROUP_ADD_MANAGER_HISTORY":
                  return (
                    el.lastChatHistory.chat.fromChatNickname +
                    "已被指定為管理員"
                  );
                case "SRV_GROUP_REMOVE_MANAGER_HISTORY":
                  return (
                    el.lastChatHistory.chat.fromChatNickname +
                    "已被解除管理員身份"
                  );
                case "SRV_GROUP_CHANGE_ADMIN_HISTORY":
                  return (
                    "群主變更為" + el.lastChatHistory.chat.fromChatNickname
                  );
              }
            }
        }
      }
    },
    // 刪除對話
    deleteRecent(data) {
      let params = {
        fullDelete: true,
        historyId: "",
        toChatId: data.toChatId,
      };
      deleteRecentChat(params)
        .then((res) => {
          if (res.code === 200) {
            this.deleteGroupDialogShow = false;
            this.$root.getHiChatDataList();
            if (
              this.hichatNav.type === "address" &&
              this.chatUser.toChatId === data.toChatId
            ) {
              this.setChatUser({});
            } else if (
              this.hichatNav.type === "group" &&
              this.groupUser.toChatId === data.toChatId
            ) {
              this.setChatGroup({});
            } else {
              this.setContactUser({});
            }
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
        });
    },
    // TODO 右鍵
    onContextmenu(data, type) {
      let item = [
        {
          name: "close",
          label: !data.setting.prompt ? "开启通知" : "关闭通知",
          icon: !data.setting.prompt
            ? "el-icon-bell"
            : "el-icon-close-notification",
          onClick: () => {
            if (type === "user" || type === "contact") {
              let contactId = data.toChatId.replace("u", "");
              let params = {
                name: data.name,
                setting: {
                  prompt: !data.setting.prompt,
                },
              };
              updateContactNickName(params, contactId).then((res) => {
                if (res.code === 200) {
                  this.$message({
                    message: !data.setting.prompt ? "开启通知" : "关闭通知",
                    type: !data.setting.prompt ? "success" : "warning",
                  });
                  if (this.chatUser.toChatId === data.toChatId) {
                    this.chatUser.setting.prompt = !data.setting.prompt;
                    this.setChatUser(this.chatUser);
                  }
                  this.$root.getHiChatDataList();
                }
              });
            } else if (type === "group") {
              let params = {
                groupId: data.toChatId.replace("g", ""),
                groupName: data.name,
                icon: data.icon,
                setting: {
                  prompt: !data.setting.prompt,
                },
              };
              updateGroup(params).then((res) => {
                if (res.code === 200) {
                  this.$message({
                    message: !data.setting.prompt ? "开启通知" : "关闭通知",
                    type: !data.setting.prompt ? "success" : "warning",
                  });
                  if (this.groupUser.toChatId === data.toChatId) {
                    this.groupUser.setting.prompt = !data.setting.prompt;
                    this.setChatGroup(this.groupUser);
                  }
                  this.$root.getHiChatDataList();
                }
              });
            }
          },
        },
        {
          name: "deleteMessage",
          label: "刪除對話",
          icon: "el-icon-delete",
          onClick: () => {
            this.deleteGroupDialogShow = true;
            this.dialogData = data;
          },
        },
      ];
      this.$contextmenu({
        items: item,
        // event,
        x: event.clientX,
        y: event.clientY,
        customClass: "custom-class",
        zIndex: 6,
        width: 130,
        minWidth: 130,
      });
      return false;
    },
    homeScrollHeight() {
      let scrollTop = document.querySelector(".home-content");
      let headerScrollTop = document.querySelector(".is-top");
      let tabContent = document.querySelector(".el-tabs__content");

      setTimeout(() => {
        let tabsContentHeight =
          scrollTop.clientHeight - headerScrollTop.scrollHeight;
        if (tabContent) {
          tabContent.style.height = tabsContentHeight + "px";
        }
      }, 300);
    },
    calloutList() {
      for (let item in this.groupMemberDataList) {
        this.groupDataList.forEach((el) => {
          if (
            this.groupMemberDataList[item].groupId ===
            Number(el.toChatId.replace("g", ""))
          ) {
            if (!el.lastChat) {
              return (this.newGroupDataList = this.groupDataList);
            } else {
              const dictionary = this.isBase64(el.lastChat.text).split(" ");
              this.groupMemberDataList[item].memberList.forEach((name) => {
                const xIndex = dictionary.indexOf(
                  "@" + name.memberId + "\u200B"
                );
                if (xIndex > -1) {
                  dictionary.splice(xIndex, 1, "@" + name.name);
                }
              });
              return (el.lastChat.text = dictionary
                .toString()
                .replace(/,/g, " "));
            }
          }
        });
      }
      this.newGroupDataList = this.groupDataList;
    },
    getGroupMemberList() {
      groupMemberList()
        .then((res) => {
          if (res.code === 200) {
            this.groupMemberDataList = res.data;
            this.setGroupMemberDataList(this.groupMemberDataList);
          }
        })
        .catch((err) => {});
    },
    judgeTextMarking(data) {
      if(!data.tagList){
        return 
      }
      const judgeTextData = data.tagList;
      const allTag = ["@所有成员", "@所有成员"].includes(this.isBase64(data.lastChat.text))
      if ((judgeTextData && judgeTextData.length > 0) || allTag) {
        const xIndex = judgeTextData.indexOf("u" + this.myUserInfo.id);
        if ( xIndex > -1 || allTag ) {
          if (this.device === "mobile") {
            return (
              `<div style="color:#F00">【 有人@我 】</div>` +
              this.isBase64(data.lastChat.text)
            );
          } else {
            return (
              `<div style="color:#F00">【 有人@我 】</div>` +
              (this.isBase64(data.lastChat.text).length > 8
                ? this.isBase64(data.lastChat.text).slice(0, 6) + "..."
                : this.isBase64(data.lastChat.text))
            );
          }
        } else {
          return this.base64Text(data);
        }
      } 
      return this.base64Text(data);
    },
    base64Text(data) {
      const num = this.device === "mobile" ? 30 : 10;
      return this.isBase64(data.lastChat.text).length > 30
        ? this.isBase64(data.lastChat.text).slice(0, num) + "..."
        : this.isBase64(data.lastChat.text);
    },
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    handleClick(tab) {
      if (tab.name === "address" || tab.name === "contact") {
        this.memberTime = setInterval(() => {
          this.getUserMemberActivity(this.noGroupPeopleData);
        }, 30000);
      } else {
        clearInterval(this.memberTime);
      }
      this.setInfoMsg({ infoMsgShow: false });
      this.setActiveName(this.hichatNav.type);
      this.setTopMsgShow(true);
      this.$root.closeReplyMessage();
    },
    //判斷是否base64
    isBase64(data) {
      return AESBase64(data, this.aesKey, this.aesIv);
    },

    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      if (userInfo.chatType === "SRV_RECENT_CHAT") {
        this.setRecentChat(userInfo.recentChat);
        this.recentChatInitial()
      } else if (homeStatus.includes(userInfo.chatType)) {
        return this.$root.getHiChatDataList();
      }
    },
    getUserMemberActivity(data) {
      let memberId = [];
      data.forEach((listNumber) => {
        memberId.push(listNumber.toChatId.replace("u", ""));
      });
      getMemberActivity({ memberId })
        .then((res) => {
          if (res.code === 200) {
            this.userTimeData = res.data;
            this.newHiChatDataList = [];
            this.newContactDataList = [];
            data.forEach((res) => {
              this.userTimeData.forEach((data) => {
                if (res.toChatId === "u" + data.memberId) {
                  res.currentTime = data.currentTime;
                  res.lastActivityTime = data.lastActivityTime;
                }
              });
            });
            this.newHiChatDataList = data.filter((list) => list.isContact);
            this.newContactDataList = data.filter((list) => !list.isContact);
          }
        })
        .catch((err) => {});
    },
    onlineMsg(data) {
      if (data.lastActivityTime === 0 || data.name === "嗨聊记事本") {
        return false;
      } else {
        let nowTime = data.currentTime;
        let lastTime = data.lastActivityTime;
        const diffInMills = nowTime - lastTime;
        if (diffInMills / 1000 < 300) {
          return true;
        } else {
          return false;
        }
      }
    },
    // getGroupDataList() {
    //   getGroupList()
    //     .then((res) => {
    //       this.groupList = res.data.list;
    //       this.setGroupList(this.groupList);
    //     })
    //     .catch((err) => {});
    // },
    getGroupAuthority(data) {
      let groupId = data.toChatId.replace("g", "");
      getGroupAuthoritySetting({ groupId }).then((res) => {
        if (res.code === 200) {

          this.authorityData = res.data;
          this.setAuthorityGroupData(this.authorityData);
        }
      });
    },
    goChatRoom(data, path) {
      if (path === "ChatMsg") {
        data.contactId = data.toChatId.replace("u", "");
        data.memberId = data.toChatId.replace("u", "");
        this.setChatUser(data);
      } else if (path === "ChatContact") {
        this.setContactUser(data);
      } else {
        data.groupName = data.name;
        data.groupId = data.toChatId.replace("g", "");
        data.memberId = JSON.parse(data.forChatId.replace("u", ""));
        this.groupList.forEach((item) => {
          if (item.groupName === data.groupName) {
            data.isAdmin = item.isAdmin;
            data.isBanPost = item.isBanPost;
            data.isManager = item.isManager;
          }
        });
        this.setChatGroup(data);
      }
      if (this.device === "mobile") {
        clearInterval(this.memberTime);
        this.setInfoMsg({ infoMsgMap: "HiChat" });
        this.$router.push({ name: path });
      } else {
        if (data.isContact) {
          this.type = "address";
        } else if (data.isGroup) {
          this.type = "group";
        } else if (!data.isBlock && !data.isContact && !data.isGroup) {
          this.type = "contact";
        }
        this.setHichatNav({ type: this.type, num: 1 });
        this.setInfoMsg({
          infoMsgShow: false,
          infoMsgNav: path === "ChatMsg" ? "ContactPage" : "GroupPage",
          infoMsgMap: "HiChat",
        });
        this.setCheckBoxBtn(true);
      }
      this.setTopMsgShow(true);
    },
  },
};
</script>

<style lang="scss" scoped>
.address-box {
  cursor: pointer;
  .no-show {
    ::v-deep.el-badge__content {
      display: none;
    }
  }
  .content-box {
    .msg-box {
      .content-text {
        span {
          &:nth-child(2) {
            opacity: 1;
            font-size: 14px;
          }
        }
      }
      .time {
        position: absolute;
        right: 1.5em;
        font-size: 13px;
        .el-badge-box {
          height: 25px;
          text-align: right;
          .el-badge {
            display: block;
            top: 5px;
          }
        }
      }
    }
  }
}
.contact-badge {
  vertical-align: initial;
  top: -9px;
}
.hichat-pc {
  .address-box {
    .content-box {
      .msg-box {
        .content-text {
          span {
            &:nth-child(1) {
              width: 200px;
            }
          }
        }
      }
    }
  }
}
.el-dialog-msg-show {
  overflow: auto;
  ::v-deep.el-dialog {
    margin: 0 auto 50px;
    background: #ffffff;
    border-radius: 10px;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    .el-dialog__header {
      padding: 10px;
      background-color: #f60;
      border-radius: 10px 10px 0 0;
      .el-dialog__title {
        color: #000000;
      }
    }
    .el-dialog__body {
      text-align: center;
      padding: 0;
      div {
        height: 3.5em;
        line-height: 3.5em;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 1.5em;
          padding-right: 5px;
        }
        &:nth-child(1) {
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
      }
    }
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

.home-content {
  overflow: hidden !important;
}
</style>
