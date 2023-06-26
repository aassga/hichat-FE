<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container>
      <el-main>
        <template v-if="device === 'mobile'">
          <el-header height="125px">
            <div class="home-header">
              <template v-if="!editBtnShow">
                <div
                  class="home-user"
                  @click="back"
                  style="position: absolute"
                ></div>
              </template>
              <template v-else-if="groupData.isAdmin || groupData.isManager">
                <div
                  class="home-user"
                  @click="editBtnShow = false"
                  style="position: absolute"
                ></div>
              </template>
              <span class="home-header-title"
                >成员 ({{
                  !editBtnShow ? contactList.length : checkDataList.length
                }})
              </span>
              <template
                v-if="
                  (groupData.isAdmin || groupData.isManager) && !editBtnShow
                "
              >
                <router-link
                  v-if="groupData.isAdmin || authority.addUser"
                  :to="'GroupAddPeople'"
                  style="position: absolute; right: 50px"
                  :style="
                    !groupData.isAdmin && !authority.delUser ? 'right: 5px' : ''
                  "
                >
                  <div class="home-add-user"></div>
                </router-link>
                <div
                  v-if="groupData.isAdmin || authority.delUser"
                  class="home-user-edit"
                  @click="(editBtnShow = true) && (checkList = [])"
                ></div>
              </template>
            </div>
            <div class="home-search">
              <el-input
                placeholder="搜寻"
                prefix-icon="el-icon-search"
                v-model="searchKey"
              >
              </el-input>
            </div>
          </el-header>
        </template>

        <template v-else-if="device === 'pc'">
          <el-header height="70px">
            <div class="home-header">
              <template v-if="!editBtnShow">
                <div
                  class="home-user"
                  @click="back"
                  style="position: absolute; left: 12px; top: 20px"
                ></div>
              </template>
              <template v-else-if="groupData.isAdmin || groupData.isManager">
                <div
                  class="home-user"
                  @click="editBtnShow = false"
                  style="position: absolute; left: 12px; top: 20px"
                ></div>
              </template>

              <span class="home-header-title"
                >成员 ({{
                  !editBtnShow ? contactList.length : checkDataList.length
                }})
              </span>

              <template
                v-if="
                  (groupData.isAdmin || groupData.isManager) && !editBtnShow
                "
              >
                <div
                  v-if="groupData.isAdmin || authority.addUser"
                  class="home-add-user"
                  @click="addGroupPeople"
                  :style="
                    groupData.isAdmin || authority.delUser
                      ? 'position: absolute; right: 50px'
                      : 'position: absolute; right: 0px'
                  "
                ></div>
                <div
                  v-if="groupData.isAdmin || authority.delUser"
                  class="home-user-edit"
                  @click="(editBtnShow = true) && (checkList = [])"
                ></div>
              </template>
            </div>
          </el-header>
          <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)">
            <div class="home-search-pc">
              <el-input
                placeholder="搜寻"
                prefix-icon="el-icon-search"
                v-model="searchKey"
              >
              </el-input>
            </div>
          </div>
        </template>

        <template v-if="!editBtnShow">
          <div class="home-content">
            <div class="el-checkbox-group">
              <label class="el-checkbox">
                <span class="el-checkbox__label">
                  <div
                    class="address-box"
                    v-for="(item, index) in newContactList"
                    :key="index"
                    @click="goContactPage(item)"
                  >
                    <div
                      :class="{ 'service-icon': item.isCustomerService }"
                    ></div>
                    <el-image :src="groupIconShow(item)" />
                    <div class="content-box">
                      <div class="msg-box">
                        <div
                          :class="{ 'noOnline-tip': onlineMsg(item) === '' }"
                        >
                          <span style="margin-bottom: 3px"
                            >{{ groupName(item) }}
                          </span>
                          <span
                            v-if="!onlineMsg(item)"
                            class="content-text"
                            :class="
                              onlineMsg(item) === '在线'
                                ? 'green-text'
                                : 'gray-text'
                            "
                            >{{ onlineMsg(item) }}</span
                          >
                        </div>
                      </div>
                      <div class="admin-manager-icon">
                        <span v-if="item.isAdmin">
                          <img
                            src="./../../../static/images/phone_icon/crown.png"
                            alt=""
                        /></span>
                        <span v-if="item.isManager">
                          <img
                            src="./../../../static/images/phone_icon/star.png"
                            alt=""
                        /></span>
                      </div>
                      <div class="content-border-bottom"></div>
                    </div>
                  </div>
                </span>
              </label>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="home-content">
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                v-for="(item, index) in newCheckDataList"
                :label="item.memberId"
                :key="index"
              >
                <div class="address-box">
                  <div
                    :class="{ 'service-icon': item.isCustomerService }"
                  ></div>
                  <el-image :src="groupIconShow(item)" />
                  <div class="content-box">
                    <div class="msg-box">
                      <div :class="{ 'noOnline-tip': onlineMsg(item) === '' }">
                        <span style="margin-bottom: 10px"
                          >{{ groupName(item) }}
                        </span>
                        <span
                          class="content-text"
                          :class="
                            onlineMsg(item) === '在线'
                              ? 'green-text'
                              : 'gray-text'
                          "
                          v-if="!onlineMsg(item)"
                          >{{ onlineMsg(item) }}</span
                        >
                      </div>
                    </div>
                    <div class="content-border-bottom"></div>
                  </div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="home-footer-btn">
            <el-button
              :class="disabled ? 'gray-btn' : 'red-btn'"
              :disabled="disabled"
              @click="leaveUserDialogShow = true"
              >移除成员</el-button
            >
          </div>
        </template>
      </el-main>
    </el-container>
    <el-dialog
      :title="device === 'pc' ? '編輯成员' : ''"
      :visible.sync="leaveUserDialogShow"
      class="el-dialog-loginOut el-edit"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'mobile'">
          <img src="./../../../static/images/warn.png" alt="" />
        </div>
        <span>确认是否将所选的成员退出群组？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          :class="device === 'mobile' ? 'border-red' : 'background-gray'"
          @click="leaveUserDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="successDialogShow = true"
          >确认</el-button
        >
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
        <el-button class="background-orange" @click="removeGroupMember"
          >確認</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { getMemberActivity } from "@/api/memberProfileController";
import {
  listMember,
  getGroupAuthoritySetting,
  removeMember,
} from "@/api/groupController";
import { mapState, mapMutations } from "vuex";
import { groupIcon } from "@/utils/icon";
export default {
  name: "GroupPeople",
  data() {
    return {
      authority: {},
      groupData: {},
      checkList: [],
      authorityData: {},
      contactList: [],
      newContactList: [],

      checkDataList: [],
      newCheckDataList: [],
      searchKey: "",
      disabled: true,
      editBtnShow: false,
      successDialogShow: false,
      leaveUserDialogShow: false,
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.groupData = this.groupUser
    this.memberTime = setInterval(() => {
      this.getUserMemberActivity(this.newContactList);
    }, 30000);
    Socket.$on("message", this.handleGetMessage);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
    clearInterval(this.memberTime);
  },
  mounted() {
    this.getGroupListMember();
    this.getGroupAuthority();
  },
  watch: {
    checkList(val) {
      this.disabled = !val.length > 0;
    },
    searchKey(val) {
      let searchKeyData = val.split(" ");
      searchKeyData.forEach((el) => {
        const searchCase = !this.editBtnShow ? this.contactList : this.checkDataList
        this.searchData = searchCase.filter((item) => {
          const nameItem =  !this.editBtnShow ? this.groupName(item) : this.groupName(item).name
          return nameItem.indexOf(el.replace("@", "")) !== -1;
        });
      });
      if (!this.editBtnShow) {
        this.newContactList = this.searchData
      }else{
        this.newCheckDataList = this.searchData;
      }
    },
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      infoMsg: (state) => state.ws.infoMsg,
      myUserInfo: (state) => state.ws.myUserInfo,
      myContactDataList: (state) => state.ws.myContactDataList,
      authorityGroupData: (state) => state.ws.authorityGroupData,
    }),
  },
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
      setChatUser: "ws/setChatUser",
      setMsgInfoPage: "ws/setMsgInfoPage",
      setGroupUserCheck: "ws/setGroupUserCheck",
      setContactListData: "ws/setContactListData",
      setAuthorityGroupData: "ws/setAuthorityGroupData",
    }),
    groupIconShow(data) {
      let groupUser = this.groupUser;
      let authority = this.authority;
      let authorityGroupData = this.authorityGroupData;
      return groupIcon(data, { groupUser, authority, authorityGroupData });
    },
    groupName(el) {
      let name = "";
      if (!el.groupNickname) {
        name = !el.groupNumber ? el.name : el.groupNumber;
      } else if (el.groupNickname) {
        name = el.groupNickname;
      }
      let showGroupNumber = this.authorityGroupData.showGroupNumber;
      let editGroupNickname = this.authorityGroupData.editGroupNickname;
      if (showGroupNumber && editGroupNickname) {
        return name;
      } else if (showGroupNumber && !editGroupNickname) {
        return el.groupNumber;
      } else if (!showGroupNumber && !editGroupNickname) {
        const num = this.device === "mobile" ? 30 : 10;
        return el.name.length > 30
        ? el.name.slice(0, num) + "..."
        : el.name;
      }
    },
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        case "SRV_GROUP_DEL":
        case "SRV_GROUP_JOIN":
        case "SRV_GROUP_ADD_MANAGER_HISTORY":
        case "SRV_GROUP_REMOVE_MANAGER_HISTORY":
        case "SRV_GROUP_CHANGE_ADMIN_HISTORY":
          // this.getGroupListMember();
          break;
        //變更權限
        case "SRV_GROUP_AUTHORITY":
          this.getGroupAuthority();
          break;
        case "SRV_GROUP_MANAGER_AUTHORITY":
        case "SRV_GROUP_ADMIN_CHANGE":
        case "SRV_GROUP_BAN_POST":
          this.getGroupListMember();
      }
    },
    getGroupListMember() {
      let groupId = this.groupData.groupId;
      listMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((item) => {
          item.groupNumber = "成员" + item.groupNumber;
          if (item.memberId === this.groupData.memberId) {
            this.groupData.isAdmin = item.isAdmin;
            this.groupData.isBanPost = item.isBanPost;
            this.groupData.isManager = item.isManager;
            this.groupData.groupNickname = item.groupNickname;
            this.groupData.groupNumber = item.groupNumber;
            if (item.memberId === Number(localStorage.getItem("id"))) {
              if (item.isAdmin) {
                localStorage.removeItem("authority");
              } else if (item.isManager) {
                this.authority = item.authority;
              } else if (!item.isAdmin && !item.isManager) {
                localStorage.removeItem("authority");
              }
            }
          }
          if (!item.icon) {
            item.icon = require("./../../../static/images/image_user_defult.png");
          }
        });
        this.setContactListData(this.contactList);
        if (this.groupData.isAdmin) {
          this.checkDataList = this.contactList.filter(
            (el) => el.memberId !== this.groupData.memberId
          );
        } else {
          this.checkDataList = this.contactList.filter(
            (el) =>
              el.memberId !== this.groupData.memberId &&
              !el.isAdmin &&
              !el.isManager
          );
        }

        this.newCheckDataList = this.checkDataList;
        this.getUserMemberActivity(this.contactList);
      });
    },
    getUserMemberActivity(data) {
      let memberId = [];
      data.forEach((listNumber) => {
        memberId.push(listNumber.memberId);
      });
      getMemberActivity({ memberId }).then((res) => {
        if (res.code === 200) {
          this.newContactList = [];
          this.userTimeData = res.data;
          this.contactList.forEach((list) => {
            this.userTimeData.forEach((data) => {
              if (list.memberId === data.memberId) {
                list.currentTime = data.currentTime;
                list.lastActivityTime = data.lastActivityTime;
              }
            });
          });
          this.newContactList = this.contactList;
        }
      });
    },
    onlineMsg(data) {
      if (data.lastActivityTime === 0 || data.name === "嗨聊记事本") {
        return "";
      } else {
        let nowTime = data.currentTime;
        let lastTime = data.lastActivityTime;
        const diffInMills = nowTime - lastTime;
        if (diffInMills / 1000 < 300) {
          return "在线";
        } else {
          return "上次上线于" + this.$root.formatTimeS(lastTime);
        }
      }
    },
    getGroupAuthority() {
      let groupId = this.groupData.groupId;
      getGroupAuthoritySetting({ groupId }).then((res) => {
        if (res.code === 200) {
          this.authorityData = res.data
          this.checkUserInfo = res.data.checkUserInfo;
          this.setAuthorityGroupData(this.authorityData);
        }
      });
    },
    addGroupPeople() {
      this.setMsgInfoPage({ pageShow: false, type: "AddGroupPeople" });
    },
    removeGroupMember() {
      let param = {
        groupId: this.groupData.groupId,
        memberList: this.checkList,
      };
      removeMember(param)
        .then((res) => {
          if (res.code === 200) {
            this.editBtnShow = false;
            this.successDialogShow = false;
            this.leaveUserDialogShow = false;
            setTimeout(() => {
              this.getGroupListMember();
            }, 600);
          }
        })
        .catch((err) => {
          return false;
        });
    },
    back() {
      if (this.device === "mobile") {
        this.$router.back(-1);
      } else {
        if (this.infoMsg.infoMsgMap === "address") {
          this.setInfoMsg({
            infoMsgShow: true,
            infoMsgNav: "GroupPage",
            infoMsgChat: false,
            infoMsgMap: "address",
          });
          this.setMsgInfoPage({ pageShow: true, type: "" });
        } else {
          this.setInfoMsg({
            infoMsgShow: true,
            infoMsgNav: "GroupPage",
            infoMsgChat: true,
          });
          this.setMsgInfoPage({ pageShow: true });
        }
      }
    },
    goInfoMsgContactPage(data) {
      data.toChatId = "u" + data.memberId;
      if (this.device === "mobile") {
        if (data.memberId === JSON.parse(localStorage.getItem("id"))) {
          data.contactId = data.toChatId.replace("u", "");
          data.memberId = data.toChatId.replace("u", "");
          data.isContact = true;
          data.name = "嗨聊记事本";
          data.icon = require("./../../../static/images/image_savemessage.png");
          this.$router.push({ name: "ChatMsg" });
        } else {
          this.$router.push({ name: "ContactPage" });
        }
        this.setChatUser(data);
      } else {
        this.isContact = this.myContactDataList.filter((el) => {
          return "u" + el.contactId === data.toChatId;
        });

        if (this.isContact.length !== 0) {
          this.isContact[0].isContact = true;
        } else {
          data.isContact = false;
          this.isContact[0] = data;
        }
        if (data.memberId === JSON.parse(localStorage.getItem("id"))) {
          this.isContact[0].name = "嗨聊记事本";
          this.isContact[0].icon = require("./../../../static/images/image_savemessage.png");
        }
        this.isContact[0].toChatId = "u" + data.memberId;
        this.setInfoMsg({
          infoMsgShow: true,
          infoMsgChat: true,
          infoMsgNav: "ContactPage",
          infoMsgMap: "GroupPeople",
        });
        this.setMsgInfoPage({
          pageShow: true,
          type: "ContactPage",
          page: "GroupPeople",
        });
        this.setGroupUserCheck(this.isContact[0]);
      }
    },
    goContactPage(data) {
      if (this.device === "mobile") {
        this.setInfoMsg({ infoMsgMap: "GroupPeople" });
      }
      let isAdmin = this.groupData.isAdmin;
      let isManager = this.groupData.isManager;
      let authority = JSON.parse(localStorage.getItem("authority"));

      if (!this.checkUserInfo) {
        if (
          isAdmin ||
          (isManager &&
            (authority.checkUserInfo ||
              (!authority.checkUserInfo && (data.isAdmin || data.isManager))))
        ) {
          this.goInfoMsgContactPage(data);
        } else if (!isAdmin && !isManager) {
          if (
            data.isAdmin ||
            data.isManager ||
            data.memberId === this.myUserInfo.id
          ) {
            this.goInfoMsgContactPage(data);
          }
        }
      } else {
        this.goInfoMsgContactPage(data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .home-header {
    margin: 1.5em 1em 1em 1em !important;
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
    .home-add-user {
      background-color: #fff;
      background-image: url("./../../../static/images/add.png");
      margin-right: 10px;
    }
    .home-user-edit {
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/edit.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
      position: absolute;
      right: 16px;
    }
    .cancel {
      position: absolute;
      right: 14px;
      color: #fe5f3f;
      font-weight: 550;
      font-size: 16px;
    }
  }
  .home-search {
    position: fixed;
    width: -webkit-fill-available;
    top: 3em;
    background-color: #eaf5fa;
    z-index: 9;
    ::v-deep.el-input {
      .el-input__inner {
        background-color: #e9e8e8;
        color: #666666;
      }
      .el-input__prefix {
        color: #666666;
      }
      ::placeholder {
        /* CSS 3 標準 */
        color: #666666;
      }
    }
  }
  .home-content {
    padding: 0;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
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
.hichat-pc {
  .home-wrapper {
    .el-container {
      .el-main {
        border-radius: 0;
        .home-header {
          margin: 1.8em 1em 1.8em 0.7em !important;
          .home-user {
            background-size: 75%;
            background-color: #fff;
            background-image: url("./../../../static/images/pc/arrow-left.png");
            cursor: pointer;
          }
          .home-add-user {
            background-size: 70%;
            background-color: #fff;
            background-image: url("./../../../static/images/pc/add.png");
            cursor: pointer;
          }
          .home-header-title {
            margin-left: 39px;
          }
          .home-user-edit {
            background-size: 70%;
            background-color: #fff;
            background-image: url("./../../../static/images/pc/edit_info.png");
            cursor: pointer;
          }
        }
        .home-search-pc {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1em;
          .el-input {
            width: 95%;
            ::v-deep.el-input__inner {
              background-color: #e9e8e8;
              color: #666666;
            }
          }
        }
        .home-content {
          .el-checkbox-group {
            .el-checkbox {
              width: 100%;
              ::v-deep.el-checkbox__label {
                font-size: 16px;
              }
            }
          }
        }
        .home-footer-btn {
          .el-button {
            padding: 9px 20px;
          }
        }
      }
    }
    .el-dialog-loginOut {
      ::v-deep.el-dialog {
        .el-dialog__header {
          padding: 0;
          border-bottom: 0;
        }
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
    .el-edit {
      ::v-deep.el-dialog {
        .el-dialog__header {
          padding: 10px;
          border-bottom: 1px solid #efefef;
        }
      }
    }
  }
}
.admin-manager-icon {
  color: rgb(254, 95, 63);
  margin-bottom: 0px;
  position: absolute;
  right: 15px;
  margin-top: -38px;
  img{
    height: 20px;
  }
}
</style>
