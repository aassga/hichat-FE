<template>
  <div>
    <div class="home-wrapper" v-if="msgInfoPage.pageShow">
      <el-container>
        <el-main>
          <el-header height="70px">
            <div class="home-header">
              <span class="home-header-title">
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                  @click="
                    infoMsg.infoMsgChat || infoMsg.infoMsgMap === 'address'
                      ? closeInfoMsgShow()
                      : false
                  "
                >
                  <span
                    style="padding-right: 10px"
                    v-if="
                      infoMsg.infoMsgChat || infoMsg.infoMsgMap === 'address'
                    "
                    ><img
                      src="./../../../static/images/pc/arrow-left.png"
                      alt=""
                  /></span>

                  <span>資訊</span>
                </div>
              </span>
              <div class="home-add-user notAdmin"></div>
            </div>
          </el-header>
          <div class="home-content">
            <template v-if="infoMsg.infoMsgNav === 'ContactPage'">
              <div class="user-data">
                <div
                  v-if="['address', 'GroupPeople'].includes(infoMsg.infoMsgMap)"
                  style="display: flex; justify-content: center"
                >
                  <div v-if="userName !== '嗨聊记事本'" :class="{ 'service-icon': serviceIcon(userData) }"></div>
                  <el-image
                    :src="noIconShow(userData, 'user')"
                    :preview-src-list="[noIconShow(userData, 'user')]"
                  />
                </div>
                <span>{{ userName }}</span>
                <span
                  class="user-data-id"
                  v-if="userName !== '嗨聊记事本'">
                  ID :
                  <span
                    v-if="infoMsg.infoMsgMap === 'address'"
                    class="user-paste"
                    @click="
                      copyID(chatUserId === '' ? userData.username : chatUserId)
                    "
                    >{{
                      chatUserId === "" ? userData.username : chatUserId
                    }}</span
                  >
                  <span
                    v-else
                    class="user-paste"
                    @click="
                      copyID(
                        chatUserId === '' ? groupUserCheck.username : chatUserId
                      )
                    "
                    >{{
                      chatUserId === "" ? groupUserCheck.username : chatUserId
                    }}</span
                  >
                </span>
                <div
                  v-if="
                    infoMsg.infoMsgNav === 'ContactPage' && (groupUserCheck.isContact || userData.isContact) 
                  "
                  :style="
                    groupUserCheck.name === '嗨聊记事本' || userName === '嗨聊记事本' ? 'display: none' : ''
                  "
                  class="group-edit-btn"
                  @click="editShowBtn(infoMsg.infoMsgNav)"
                >
                  <img src="./../../../static/images/edit.png" alt="" />
                  <span class="group-edit-text">编辑联络人昵称</span>
                </div>
              </div>
              <div
                class="setting-button no_bor_mb10"
                v-if="userName !== '嗨聊记事本' && (infoMsg.infoMsgMap === 'address' && !!userData.setting)"
              >
                <a>
                  <div class="setting-button-left">
                    <img
                      :src="userData.setting &&!userData.setting.prompt ? muteImg : noMuteImg"
                    />
                    <el-switch
                      v-model="userData.setting.prompt"
                      :inactive-text="
                        !userData.setting.prompt ? '开启通知' : '关闭通知'
                      "
                      active-color="#fd5f3f"
                      inactive-color="#666666"
                      @change="changeSettingPrompt(userData, 'user')"
                    >
                    </el-switch>
                  </div>
                </a>
              </div>
              <div
                v-for="(item, index) in settingContactData"
                :key="index"
                class="setting-button"
              >
                <a @click="goChatRoom(userData, item.path, 'address')">
                  <div class="setting-button-left">
                    <img :src="item.icon" alt="" />
                    <span>{{ item.name }}</span>
                  </div>
                  <img src="./../../../static/images/next.png" alt="" />
                </a>
              </div>
              <template
                v-if="
                  userName !== '嗨聊记事本' &&
                  infoMsg.infoMsgMap === 'address'
                "
              >
                <div
                  class="setting-button"
                  @click="dialogShow(!userData.isBlock ? 'block' : 'unBlock')"
                >
                  <a>
                    <div class="setting-button-left">
                      <img src="./../../../static/images/pc/slash.png" alt="" />
                      <span>{{this.blockContent}}</span>
                    </div>
                  </a>
                </div>
                <div
                  class="setting-button"
                  @click="dialogShow(!userData.isContact ? 'add' : 'delete')"
                >
                  <a>
                    <div class="setting-button-left">
                      <img
                        :src="isContactImg"
                        alt=""
                      />
                      <span class="red-text">{{this.isContact}}</span>
                    </div>
                  </a>
                </div>
              </template>
              <template
                v-if="
                  groupUserCheck.name !== '嗨聊记事本' &&
                  infoMsg.infoMsgMap === 'GroupPeople'
                "
              >
                <template
                  v-if="
                    (groupUser.isAdmin || groupUser.isManager) &&
                    infoMsg.infoMsgMap === 'GroupPeople'
                  "
                >
                  <div
                    class="setting-button mt10"
                    @click="
                      dialogShow(
                        !groupUserCheck.isBanPost ? 'banPost' : 'unBanPost'
                      )
                    "
                  >
                    <a>
                      <div class="setting-button-left">
                        <img
                          src="./../../../static/images/pc/icon_x-octagon.svg"
                          alt=""
                        />
                        <span>{{
                          !groupUserCheck.isBanPost ? "禁言联络人" : "解除禁言"
                        }}</span>
                      </div>
                    </a>
                  </div>
                </template>
                <div
                  class="setting-button"
                  @click="
                    dialogShow(!groupUserCheck.isBlock ? 'block' : 'unBlock')
                  "
                >
                  <a>
                    <div class="setting-button-left">
                      <img src="./../../../static/images/pc/slash.png" alt="" />
                      <span>{{
                        !groupUserCheck.isBlock ? "封锁联络人" : "解除封锁"
                      }}</span>
                    </div>
                  </a>
                </div>
                <div
                  class="setting-button"
                  @click="
                    dialogShow(!groupUserCheck.isContact ? 'add' : 'delete')
                  "
                >
                  <a>
                    <div class="setting-button-left">
      
                      <img src="./../../../static/images/pc/add-user.svg" alt="" v-if="!groupUserCheck.isContact">
                      <img :src="require('./../../../static/images/pc/trash.png')" alt="" v-else>
                      <img
                        :src="
                          require(`./../../../static/images/pc/${
                            !groupUserCheck.isContact ? 'add-user' : 'trash'
                          }.svg`)
                        "
                        alt=""
                      />
                      <span class="red-text">{{
                        !groupUserCheck.isContact ? "加入联络人" : "刪除联络人"
                      }}</span>
                    </div>
                  </a>
                </div>
              </template>
            </template>

            <template v-else>
              <div class="user-data">
                <el-image
                  :src="noIconShow(groupUser, 'group')"
                  :preview-src-list="[noIconShow(groupUser, 'group')]"
                />
                <span>{{ groupUser.groupName }}</span>
                <div
                  v-if="
                    groupUser.isAdmin ||
                    (groupUser.isManager && authority.updateGroupInfo)
                  "
                  class="group-edit-btn"
                  @click="editShowBtn(infoMsg.infoMsgNav)"
                >
                  <img src="./../../../static/images/edit.png" alt="" />
                  <span class="group-edit-text">编辑群组头像昵称</span>
                </div>
              </div>
              <div class="setting-button no_bor_mb10">
                <a>
                  <div class="setting-button-left">
                    <img
                      :src="!groupUser.setting.prompt ? muteImg : noMuteImg"
                    />
                    <el-switch
                      v-model="groupUser.setting.prompt"
                      :inactive-text="
                        !groupUser.setting.prompt ? '开启通知' : '关闭通知'
                      "
                      active-color="#fd5f3f"
                      inactive-color="#666666"
                      @change="changeSettingPrompt(groupUser, 'group')"
                    >
                    </el-switch>
                  </div>
                </a>
              </div>
              <div
                class="setting-button"
                v-for="(item, index) in settingGroupData"
                :key="index"
              >
                <a @click="goChatRoom(groupUser, item.path, 'group')">
                  <div class="setting-button-left">
                    <img :src="item.icon" alt="" />
                    <span>{{ item.name }}</span>
                  </div>
                  <img src="./../../../static/images/next.png" alt="" />
                </a>
              </div>
              <template
                v-if="
                  groupUser.isAdmin ||
                  (groupUser.isManager &&
                    (authority.banUserPost || authority.disabledWord))
                "
              >
                <div class="setting-button mt10-border">
                  <a @click="changeSettingAdminGroupShow('SettingGroup')">
                    <div class="setting-button-left">
                      <img src="./../../../static/images/pc/key.png" alt="" />
                      <span>权限</span>
                    </div>
                  </a>
                </div>
              </template>
              <div class="setting-button" v-if="groupUser.isAdmin">
                <a @click="changeSettingAdminGroupShow('AdminChange')">
                  <div class="setting-button-left">
                    <img src="./../../../static/images/shield.png" alt="" />
                    <span>转移群主权限</span>
                  </div>
                </a>
              </div>
              <div
                class="setting-button"
                v-if="authorityGroupData.showGroupNumber"
              >
                <a
                  @click="
                    authorityGroupData.editGroupNickname
                      ? changeSettingAdminGroupShow('GroupNickName')
                      : false
                  "
                >
                  <div class="setting-button-left" style="width: auto">
                    <img
                      src="./../../../static/images/pc/icon_edit.png"
                      alt=""
                    />
                    <span>群组内昵称</span>
                  </div>
                  <div class="setting-button-right">
                    <span class="nickname-text">{{ nickName() }}</span>
                    <img
                      v-if="authorityGroupData.editGroupNickname"
                      src="./../../../static/images/next.png"
                      alt=""
                    />
                  </div>
                </a>
              </div>
              <div class="setting-button">
                <a @click="leaveGroupDialogShow = true">
                  <div class="setting-button-left">
                    <img src="./../../../static/images/logout.png" alt="" />
                    <span>退出群组</span>
                  </div>
                </a>
              </div>
            </template>
          </div>
        </el-main>
      </el-container>
    </div>
    <edit-contact v-if="msgInfoPage.type === 'ContactPage'" />
    <group-admin-change v-if="msgInfoPage.type === 'AdminChange'" />
    <group-people v-if="msgInfoPage.type === 'GroupPeople'" />
    <group-add-people v-if="msgInfoPage.type === 'AddGroupPeople'" />
    <edit-group v-if="msgInfoPage.type === 'GroupPage'" />
    <group-nick-name v-if="msgInfoPage.type === 'GroupNickName'" />

    <setting-group v-if="msgInfoPage.type === 'SettingGroup'" />
    <admin-setting v-if="msgInfoPage.type === 'AdminSetting'" />
    <admin-setting-page v-if="msgInfoPage.type === 'AdminSettingPage'" />
    <admin-setting-detail v-if="msgInfoPage.type === 'AdminSettingDetail'" />
    <ban-setting v-if="msgInfoPage.type === 'BanSetting'" />
    <ban-word v-if="msgInfoPage.type === 'BanWord'" />
    <mobile-card v-if="msgInfoPage.type === 'MobileCard'" />
    <investigation v-if="msgInfoPage.type === 'Investigation'" />

    <el-dialog
      :title="dialogTitle"
      :visible.sync="settingDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <span>{{ dialogContent }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-gray" @click="settingDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="submitBtn(dialogContent)"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="successDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <span>操作成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="successDialogShow = false"
          >確認</el-button
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
        <el-button class="background-red" @click="leaveSubmitBtn"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { mapState, mapMutations } from "vuex";
import { getToken } from "_util/utils.js";
import { copyPaste } from "@/utils/urlCopy.js";
import { showIcon } from "@/utils/icon";
import { showGroupNickname } from "@/utils/groupNickName";
import { getSearchById } from "@/api/memberProfileController";
import {
  addBlockContactUser,
  unBlockContactUser,
} from "@/api/memberBlockController";
import {
  addContactUser,
  deleteContactUser,
  updateContactNickName,
} from "@/api/memberContactController";
import {
  listMember,
  setBanPostByPersonal,
  leaveGroup,
  updateGroup,
} from "@/api/groupController";

import EditGroup from "./../EditContact/EditGroup.vue";
import EditContact from "./../EditContact/EditContact.vue";
import GroupPeople from "../GroupPage/GroupPeople.vue";
import GroupAddPeople from "../GroupPage/GroupAddPeople.vue";
import GroupAdminChange from "./../GroupPage/GroupAdminChange.vue";
import GroupNickName from "./../GroupPage/GroupNickName.vue";

import SettingGroup from "./../AddGroup/SettingGroup.vue";
import AdminSetting from "../AddGroup/AdminSetting.vue";
import AdminSettingPage from "./../AddGroup/AdminSettingPage.vue";
import AdminSettingDetail from "./../AddGroup/AdminSettingDetail.vue";
import BanSetting from "./../AddGroup/BanSetting.vue";
import BanWord from "./../AddGroup/BanWord.vue";
import Investigation from "./../Investigation/Investigation.vue";

import MobileCard from "./../Card/MobileCard.vue";
import { showServiceIcon } from "@/utils/icon";
export default {
  name: "MsgInfoPage",
  data() {
    return {
      userData: {},
      settingContactData: [
        {
          name: "传送讯息",
          icon: require("./../../../static/images/pc/message.png"),
          path: "HiChat",
        },
        // {
        //   name: "查看相片和影片",
        //   icon: require("./../../../static/images/pc/image.png"),
        //   path: "",
        // },
      ],
      settingGroupData: [
        // {
        //   name: "传送讯息",
        //   icon: require("./../../../static/images/pc/message.png"),
        //   path: "HiChat",
        // },
        // {
        //   name: "查看相片和影片",
        //   icon: require("./../../../static/images/pc/image.png"),
        //   path: "",
        // },
        {
          name: "成员",
          icon: require("./../../../static/images/pc/users.png"),
          path: "GroupPeople",
        },
      ],
      userName:"",
      chatUserId: "",
      dialogTitle: "",
      dialogContent: "",
      contactList: [],
      groupDataList: [],
      muteImg: require("./../../../static/images/pc/bell.png"),
      noMuteImg: require("./../../../static/images/pc/bell-off.png"),
      isContactImg:"",
      isContact:"",
      blockContent:"",
      notification: true,
      successDialogShow: false,
      settingDialogShow: false,
      leaveGroupDialogShow: false,
    };
  },
  computed: {
    ...mapState({
      chatUser: (state) => state.ws.chatUser,
      groupUser: (state) => state.ws.groupUser,
      infoMsg: (state) => state.ws.infoMsg,
      myUserInfo: (state) => state.ws.myUserInfo,
      msgInfoPage: (state) => state.ws.msgInfoPage,
      authority: (state) => state.ws.authority,
      authorityGroupData: (state) => state.ws.authorityGroupData,
      groupUserCheck: (state) => state.ws.groupUserCheck,
      myContactDataList: (state) => state.ws.myContactDataList,
    }),
  },

  watch: {
    msgInfoPage(val) {
      if (val.type === "contactCard") {
        this.userData = val.data;
      } else {
        this.differentiateData() 
      }
      this.getUserId();
    },
  },
  created() {
    if (this.msgInfoPage.type === "contactCard") {
      this.userData = this.msgInfoPage.data;
    } else {
      this.differentiateData()
    }
    this.getUserId();
  },
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
      setChatUser: "ws/setChatUser",
      setAuthority: "ws/setAuthority",
      setChatGroup: "ws/setChatGroup",
      setContactUser: "ws/setContactUser",
      setHichatNav: "ws/setHichatNav",
      setMsgInfoPage: "ws/setMsgInfoPage",
      setGroupUserCheck: "ws/setGroupUserCheck",
      setContactListData: "ws/setContactListData",
      setMyContactDataList:"ws/setMyContactDataList"
    }),
    serviceIcon(icon) {
      return showServiceIcon(icon);
    },
    differentiateData(){
      if (this.infoMsg.infoMsgMap === "address") {
        this.userData = this.chatUser;
      } else {
        this.userData = this.groupUserCheck;
      }
    },
    nickName() {
      const group = this.groupUser;
      const myUserInfo = this.myUserInfo;
      const authorityGroupData = this.authorityGroupData;
      return showGroupNickname({ group, myUserInfo, authorityGroupData });
    },
    changeSettingPrompt(status, type) {
      if (type === "user") {
        let contactId = status.contactId;
        let params = {
          name: status.name,
          setting: {
            prompt: status.setting.prompt,
          },
        };
        updateContactNickName(params, contactId).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: !status.setting.prompt ? "开启通知" : "关闭通知",
              type: !status.setting.prompt ? "success" : "warning",
            });
            if (this.userData.toChatId === status.toChatId) {
              this.userData.setting.prompt = status.setting.prompt;
              if (this.msgInfoPage.type !== "contactCard") {
                this.setChatUser(this.userData);
              }
            }
            this.$root.getHiChatDataList();
          }
        });
      } else {
        let params = {
          groupId: status.groupId,
          groupName: status.groupName,
          icon: status.icon,
          setting: {
            prompt: status.setting.prompt,
          },
        };
        updateGroup(params).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: !status.setting.prompt ? "开启通知" : "关闭通知",
              type: !status.setting.prompt ? "success" : "warning",
            });
            if (this.groupUser.toChatId === data.toChatId) {
              this.groupUser.setting.prompt = data.setting.prompt;
              this.setChatGroup(this.groupUser);
            }
            this.$root.getHiChatDataList();
          }
        });
      }
    },
    leaveSubmitBtn() {
      let groupId = this.groupUser.groupId;
      leaveGroup({ groupId }).then((res) => {
        if (res.code === 200) {
          this.leaveGroupDialogShow = false;
          this.setChatGroup({});
          this.closeInfoMsgShow();
        }
      })
    },
    getGroupListMember(data) {
      let groupId = data.toChatId.replace("g", "");
      listMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((item) => {
          if (!item.icon) {
            item.icon = require("./../../../static/images/image_user_defult.png");
          }
        });
        this.setContactListData(this.contactList);
      });
    },
    getUserId() {
      if (!this.userData.toChatId) {
        return false;
      }
      let id = this.userData.toChatId.replace("u", "");
      getSearchById({ id }).then((res) => {
        if (res.data.id === this.myUserInfo.id) {
          this.userName = "嗨聊记事本"
          this.userData.isBlock = res.data.isBlock;
          this.userData.isContact = res.data.isContact;
        } else {
          if(res.data.isContact){
            this.isContactImg = require('./../../../static/images/pc/trash.png')
          }else{
            this.isContactImg = require('./../../../static/images/pc/add-user.svg')
          }
          this.userName = res.data.name
          this.userData.name = res.data.name
          this.blockContent = res.data.isBlock ? "解除封锁" : "封锁联络人";
          this.isContact = res.data.isContact ? "刪除联络人" :  "加入联络人";
          this.chatUserId = res.data.username;
          this.userData.isBlock = res.data.isBlock;
          this.userData.isContact = res.data.isContact;
        }
      });
    },
    changeSettingAdminGroupShow(type) {
      this.setInfoPageType(type);
      this.setInfoMsg({
        infoMsgShow: true,
        infoMsgNav: "GroupPage",
        infoMsgChat: false,
        infoMsgMap: "address",
      });
    },
    dialogShow(type) {
      this.settingDialogShow = true;
      const userName = this.userData.name;
      const groupUserCheck = this.groupUserCheck.name
      const title = {
        "block":"封锁",
        "unBlock":"解除封锁",
        "banPost":"禁言",
        "unBanPost":"解除禁言",
        "add":"加入",
        "delete":"删除",
        "mute":"开启",
        "unMute":"关闭",
      }
      const content = {
        "block":`确认是否封锁联络人${userName}？`,
        "unBlock":`确认是否解除封锁联络人${userName}？`,
        "banPost":`确认是否禁言联络人${groupUserCheck}？`,
        "unBanPost":`确认是否解除禁言联络人${groupUserCheck}？`,
        "add":`确认是否将${userName}加入联络人`,
        "delete":`确认是否删除联络人${userName}？`,
        "mute": `确认是否开启通知？`,
        "unMute": `确认是否关闭通知？`,
      }
      this.dialogTitle = title[type]
      this.dialogContent = content[type]
    },
    submitBtn(dialogContent) {
      switch (dialogContent) {
        case `确认是否封锁联络人${this.userData.name}？`:
          let blockId = this.userData.toChatId.replace("u", "");
          addBlockContactUser({ blockId }).then((res) => {
            if (res.code === 200) {
              this.successDialogShow = true;
              this.settingDialogShow = false;
            }
            this.getUserId()
          });
          break;
        case `确认是否解除封锁联络人${this.userData.name}？`:
          let blockIdList = [this.userData.toChatId.replace("u", "")];
          unBlockContactUser({ blockIdList })
            .then((res) => {
              if (res.code === 200) {
                this.successDialogShow = true;
                this.settingDialogShow = false;
                if(this.infoMsg.infoMsgMap !== "address"){
                  this.groupUserCheck.isBlock = false;
                  this.setGroupUserCheck(this.groupUserCheck);
                }
              }
              this.getUserId()
            })
          break;
        case `确认是否禁言联络人${this.groupUserCheck.name}？`:
        case `确认是否解除禁言联络人${this.groupUserCheck.name}？`:
          const banPost = dialogContent === `确认是否禁言联络人${this.groupUserCheck.name}？`
          const banData = {
            groupId: this.groupUser.toChatId.replace("g", ""),
            isBanPost: banPost,
            memberId: this.groupUserCheck.contactId,
          };
          setBanPostByPersonal(banData).then((res) => {
            if (res.code === 200) {
              this.successDialogShow = true;
              this.settingDialogShow = false;
              this.groupUserCheck.isBanPost = banPost;
              this.setGroupUserCheck(this.groupUserCheck);
            }
          });
          break;
        case `确认是否删除联络人${this.userData.name}？`:
          let contactId = this.userData.toChatId.replace("u", "");
          deleteContactUser(contactId)
            .then((res) => {
              if (res.code === 200) {
                this.newContact = this.myContactDataList.filter((el) => {
                  return this.userData.toChatId !== "u" + el.contactId;
                });
                this.setMyContactDataList(this.newContact);
                this.successDialogShow = true;
                this.settingDialogShow = false;
                if (this.infoMsg.infoMsgMap === "address") {
                  if (this.msgInfoPage.type !== "contactCard") {
                    this.setChatUser({});
                  }
                  this.setContactUser(this.userData);
                } else {
                  this.setGroupUserCheck({});
                  this.setGroupUserCheck(this.groupUserCheck);
                }
                this.closeInfoMsgShow();
                this.$root.getHiChatDataList();
                this.$root.getMaybeKnow();
              }
              this.getUserId()
            })
          break;
        case `确认是否将${this.userData.name}加入联络人`:
          let params = {
            contactId: this.userData.contactId,
          };
          addContactUser(params).then((res) => {
            if (res.code === 200) {
              this.settingDialogShow = false;
              this.addContactDialogShow = true;
            }
            this.getUserId()
          });
          break;
        case `确认是否${this.userData.mute ? "开启" : "关闭"}通知？`:
          let mute = this.userData.toChatId.replace("u", "");
          // addBlockContactUser({ mute }).then((res) => {
          //   if (res.code === 200) {
          //     this.successDialogShow = true;
          //     this.settingDialogShow =false;
          //     this.chatUser.isBlock = true;
          //     this.setChatUser(this.chatUser);
          //   }
          // });
          break;
      }
    },
    editShowBtn(type) {
      this.setInfoPageType(type);
    },
    setInfoPageType(type) {
      this.setMsgInfoPage({ pageShow: false, type: type });
    },
    closeInfoMsgShow() {
      if (this.msgInfoPage.page === "GroupPeople") {
        this.setMsgInfoPage({ pageShow: false, type: this.msgInfoPage.page });
      } else {
        this.setInfoMsg({ infoMsgShow: false, infoMsgChat: false });
      }
    },
    copyID(data) {
      copyPaste(data);
    },
    noIconShow(iconData, key) {
      if(iconData.chatId === "u" +  this.myUserInfo.id || iconData.toChatId === "u" +  this.myUserInfo.id){
       return require("./../../../static/images/image_savemessage.png");
      }
      return showIcon(iconData, key);
    },
    goChatRoom(data, path, type) {
      let goPath = ""
      if (path === "HiChat") {
        if (type === "address") {
          if(data.isContact){
            goPath = "address"
            delete this.userData.type;
            this.setChatUser(this.userData);
          }else{
            goPath = "contact"
            this.setContactUser(this.userData);
          }
        } else {
          goPath = "group"
          delete this.groupUser.type;
          this.getGroupListMember(data);
          this.setChatGroup(this.groupUser);
        }
        this.setInfoMsg({
          infoMsgShow: false,
          infoMsgNav: type === "address" ? "ContactPage" : "GroupPage",
        });
        this.setHichatNav({ type: goPath, num: 1 });
        this.$router.push({ name: path, params: data });
      } else if (path === "GroupPeople") {
        if (data.authority) {
          this.setAuthority(data.authority);
        }
        this.setMsgInfoPage({ pageShow: false, type: path });
      }
    },
    back() {
      this.$router.back(-1);
    },
  },
  components: {
    EditContact,
    EditGroup,
    GroupAdminChange,
    GroupPeople,
    GroupAddPeople,
    GroupNickName,
    SettingGroup,
    AdminSetting,
    AdminSettingPage,
    AdminSettingDetail,
    BanSetting,
    BanWord,
    MobileCard,
    Investigation,
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  border-left: 1px solid rgba(0, 0, 0, 0.05);
  .home-header {
    .home-add-user {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/edit_info.png");
    }
    .notAdmin {
      background-image: none;
      cursor: initial;
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
        cursor: pointer;
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
      cursor: pointer;
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
        .el-switch {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-left: 1em;
          font-size: 15px;
          cursor: pointer;
        }
        ::v-deep.el-switch__label.is-active {
          color: #333333;
        }
      }
      .setting-button-right {
        display: flex;
        align-items: center;
      }
      .nickname-text {
        color: #c5c5c5;
      }
    }
    .setting-notification {
      padding: 1em;
      background-color: #fff;
      margin: 1em 0;
      display: flex;
      justify-content: space-between;
      align-content: center;
      border-bottom: 3px solid rgba(0, 0, 0, 0.05);
      img {
        height: 1.2em;
      }
      .setting-button-left {
        display: flex;
        align-items: center;
        margin-left: 10px;
        width: 20em;
        span {
          margin-left: 0;
          font-size: 15px;
          color: #333333;
        }
      }
    }
    .red-text {
      color: #ee5253 !important;
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
.mt10-border {
  border-top: 3px solid rgba(0, 0, 0, 0.05);
}
.no_bor_mb10 {
  border-bottom: 3px solid rgba(0, 0, 0, 0.05);
}
.hichat-pc {
  .home-wrapper {
    .el-dialog-loginOut {
      ::v-deep.el-dialog {
        .el-dialog__footer {
          padding: 0;
          .el-button {
            &:nth-child(2) {
              border-left: 1px solid rgb(239, 239, 239);
            }
          }
        }
      }
    }
  }
}
.service-icon {
  width: 6em;
  height: 6em;
}
</style>
