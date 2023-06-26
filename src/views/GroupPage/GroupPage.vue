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
            <el-image
              :src="noIconShow(groupUser, 'group')"
              :preview-src-list="[noIconShow(groupUser, 'group')]"
            />
            <div>
              <span>{{ groupUser.groupName }}</span>
              <!-- <template v-if="groupUser.isAdmin">
              <router-link :to="'/EditGroup'" >
                <div class="home-add-user edit"></div>
              </router-link>
            </template>
            <template v-else-if="groupUser.isManager">
              <router-link :to="'/EditGroup'" v-if="authority.updateGroupInfo">
                <div class="home-add-user edit"></div>
              </router-link>
            </template> -->
              <div
                class="group-edit-btn"
                v-if="
                  groupUser.isAdmin ||
                  (groupUser.isManager && authority.updateGroupInfo)
                "
                @click="$router.push({ path: '/EditGroup' })"
              >
                <img src="./../../../static/images/edit.png" alt="" />
                <span class="group-edit-text">编辑群组头像昵称</span>
              </div>
              <div v-else style="margin: -3.5em 0 -5em 0"></div>
            </div>
          </div>

          <div
            class="setting-button"
            v-for="(item, index) in settingData"
            :key="index"
            :class="{ mb10: item.name === '成员' }"
          >
            <a @click="goChatRoom(groupUser, item.path)">
              <div class="setting-button-left">
                <div :class="{ 'service-icon': item.isCustomerService }"></div>
                <img :src="noIconShow(item, 'user')" alt="" />
                <span>{{ item.name }}</span>
              </div>
              <img src="./../../../static/images/next.png" alt="" />
            </a>
          </div>
          <div class="setting-button" v-if="authorityGroupData.showGroupNumber">
            <a
              @click="
                authorityGroupData.editGroupNickname
                  ? goChatRoom(groupUser, 'GroupNickName')
                  : false
              "
            >
              <div class="setting-button-left">
                <img src="./../../../static/images/icon_edit.png" alt="" />
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
          </div> -->
          <template v-if="groupUser.isAdmin">
            <div class="setting-button mt10">
              <a @click="goChatRoom(groupUser, 'SettingGroup')">
                <div class="setting-button-left">
                  <img src="./../../../static/images/key.png" alt="" />
                  <span>权限設定</span>
                </div>
              </a>
            </div>
          </template>
          <template v-else-if="groupUser.isManager">
            <div
              class="setting-button mt10"
              v-if="authority.banUserPost || authority.disabledWord"
            >
              <a @click="goChatRoom(groupUser, 'SettingGroup')">
                <div class="setting-button-left">
                  <img src="./../../../static/images/key.png" alt="" />
                  <span>权限設定</span>
                </div>
              </a>
            </div>
          </template>
          <div class="setting-button mb10" v-if="groupUser.isAdmin">
            <a @click="goChatRoom(groupUser, 'GroupAdminChange')">
              <div class="setting-button-left">
                <img src="./../../../static/images/shield.png" alt="" />
                <span>转移群主权限</span>
              </div>
            </a>
          </div>
          <div
            class="setting-button"
            @click="isDialogShow = true"
            v-if="infoMsg.infoMsgMap !== 'address'"
          >
            <a>
              <div class="setting-button-left">
                <img src="./../../../static/images/trash.png" alt="" />
                <span class="red-text">刪除對話</span>
              </div>
            </a>
          </div>
          <div class="setting-button" @click="leaveGroupDialogShow = true">
            <a>
              <div class="setting-button-left">
                <img src="./../../../static/images/logout.png" alt="" />
                <span class="red-text">退出群组</span>
              </div>
            </a>
          </div>
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
      :visible.sync="leaveGroupDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/warn.png" alt="" /></div>
        <span v-if="groupUser.isAdmin">
          <span>管理者退出將解散群組</span>
          <span>确认是否退出？</span>
        </span>
        <span v-else>确认是否退出群組？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="leaveGroupDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="submitBtn">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { deleteRecentChat } from "@/api/chatController";
import { leaveGroup } from "@/api/groupController";
import { showIcon } from "@/utils/icon";
import { showGroupNickname } from "@/utils/groupNickName";

export default {
  name: "GroupPage",
  data() {
    return {
      authority: {},
      settingData: [
        {
          name: "传送讯息",
          icon: require("./../../../static/images/chat_icon.png"),
          path: "ChatGroupMsg",
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
        {
          name: "成员",
          icon: require("./../../../static/images/users.png"),
          path: "GroupPeople",
        },
      ],
      dialogContent: "",
      notification: true,
      isDialogShow: false,
      leaveGroupDialogShow: false,
    };
  },
  computed: {
    ...mapState({
      infoMsg: (state) => state.ws.infoMsg,
      groupUser: (state) => state.ws.groupUser,
      myUserInfo: (state) => state.ws.myUserInfo,
      authorityGroupData: (state) => state.ws.authorityGroupData,
    }),
  },
  created() {
    if (this.groupUser.isManager) {
      this.authority = JSON.parse(localStorage.getItem("authority"));
    }
  },
  methods: {
    ...mapMutations({
      setChatGroup: "ws/setChatGroup",
    }),
    nickName() {
      const group = this.groupUser;
      const myUserInfo = this.myUserInfo;
      const authorityGroupData = this.authorityGroupData;
      return showGroupNickname({ group, myUserInfo, authorityGroupData });
    },
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    deleteMessage() {
      let params = {
        fullDelete: true,
        historyId: "",
        toChatId: this.groupUser.toChatId,
      };
      deleteRecentChat(params).then((res) => {
        if (res.code === 200) {
          this.setChatGroup({});
          this.$router.push({ path: "/Address" });
        }
      });
    },
    goChatRoom(data, path) {
      this.$router.push({ name: path, params: data });
    },
    submitBtn() {
      let groupId = this.groupUser.groupId;
      leaveGroup({ groupId })
        .then((res) => {
          if (res.code === 200) this.$router.push({ path: "/Address" });
        })
        .catch((err) => {
          return false;
        });
    },
    back() {
      this.$router.push({ path: "/ChatGroupMsg" });
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
    .edit {
      background-color: #fff;
      background-image: url("./../../../static/images/edit.png");
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
        margin: -2.5em auto 0 auto;
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
        width: 16em;
        span {
          margin-left: 1em;
          font-size: 15px;
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
          .border-red {
            border: 1px solid #fe5f3f;
            color: #fe5f3f;
          }
        }
      }
    }
  }
}
.mt10 {
  margin-top: 1em;
}
.mb10 {
  margin-bottom: 1em;
}
</style>
