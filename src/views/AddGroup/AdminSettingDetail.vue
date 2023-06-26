<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'mobile'">
      <el-main>
        <el-header height="60px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">管理员权限设定</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="user-data">            
            <div class="info-box">
              <div :class="{ 'service-icon': $route.params.isCustomerService }"></div>
                <el-image
                :src="$route.params.icon"
                :preview-src-list="[$route.params.icon]"
              />
            </div>
            <div>
              <span>{{ groupName($route.params) }}</span>
            </div>
          </div>

          <div class="setting-title">群组成员</div>
          <div
            v-for="(item, index) in groupManagerAuthorityVO"
            :key="item + index + 1"
          >
            <div
              class="setting-button"
              v-if="
                [
                  'addUser',
                  'delUser',
                  'updateGroupInfo',
                  'delUserMessage',
                  'checkUserInfo',
                ].includes(item.key)
              "
            >
              <div class="setting-box">
                <div class="setting-button-left">
                  <el-switch
                    v-model="item.isCheck"
                    :inactive-text="item.name"
                    active-color="#fd5f3f"
                    inactive-color="#666666"
                  >
                  </el-switch>
                </div>
              </div>
            </div>
          </div>
          <div class="setting-title">信息传递</div>
          <div
            v-for="(item, index) in groupManagerAuthorityVO"
            :key="item + index + 2"
          >
            <div
              class="setting-button"
              v-if="
                [
                  'sendMessage',
                  'sendImage',
                  'sendLink',
                  'pin',
                  'startGroupCall',
                ].includes(item.key)
              "
            >
              <div class="setting-box">
                <div class="setting-button-left">
                  <el-switch
                    v-model="item.isCheck"
                    :inactive-text="item.name"
                    active-color="#fd5f3f"
                    inactive-color="#666666"
                  >
                  </el-switch>
                </div>
              </div>
            </div>
          </div>
          <div class="setting-title">禁言与禁用字词</div>
          <div
            v-for="(item, index) in groupManagerAuthorityVO"
            :key="item + index + 3"
          >
            <div
              class="setting-button"
              v-if="['banUserPost', 'disabledWord'].includes(item.key)"
            >
              <div class="setting-box">
                <div class="setting-button-left">
                  <el-switch
                    v-model="item.isCheck"
                    :inactive-text="item.name"
                    active-color="#fd5f3f"
                    inactive-color="#666666"
                  >
                  </el-switch>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="home-footer-btn">
          <el-button class="orange-btn" @click="addGroupMsg"
            >设定群组资讯</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="320px">
        <el-header height="70px">
          <div
            class="home-header flex-start"
            :style="
              !groupPermissionData.addGroup
                ? 'position: relative; left: -4px; top: -1px;'
                : ''
            "
          >
            <div class="home-user-pc" @click="back()"></div>
            <span
              class="home-header-title"
              :style="
                !groupPermissionData.addGroup
                  ? 'position: relative; top: 1px;'
                  : ''
              "
              >管理员权限设定</span
            >
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="user-data">
            <div
              style="
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
              "
            >
              <div class="info-box">
                <div :class="{ 'service-icon': msgInfoPage.data.isCustomerService }"></div>
                <el-image
                  :src="msgInfoPage.data.icon"
                  :preview-src-list="[msgInfoPage.data.icon]"
                />
              </div>

              
              <span>{{ groupName(msgInfoPage.data) }}</span>
            </div>
          </div>
          <div class="setting-title">群组成员</div>
          <div
            v-for="(item, index) in groupManagerAuthorityVO"
            :key="item + index + 1"
          >
            <div
              class="setting-button"
              v-if="
                [
                  'addUser',
                  'delUser',
                  'updateGroupInfo',
                  'delUserMessage',
                  'checkUserInfo',
                ].includes(item.key)
              "
            >
              <div class="setting-box">
                <div class="setting-button-left">
                  <el-switch
                    v-model="item.isCheck"
                    :inactive-text="item.name"
                    active-color="#fd5f3f"
                    inactive-color="#666666"
                  >
                  </el-switch>
                </div>
              </div>
            </div>
          </div>
          <div class="setting-title">信息传递</div>
          <div
            v-for="(item, index) in groupManagerAuthorityVO"
            :key="item + index + 2"
          >
            <div
              class="setting-button"
              v-if="
                [
                  'sendMessage',
                  'sendImage',
                  'sendLink',
                  'pin',
                  'startGroupCall',
                ].includes(item.key)
              "
            >
              <div class="setting-box">
                <div class="setting-button-left">
                  <el-switch
                    v-model="item.isCheck"
                    :inactive-text="item.name"
                    active-color="#fd5f3f"
                    inactive-color="#666666"
                  >
                  </el-switch>
                </div>
              </div>
            </div>
          </div>
          <div class="setting-title">禁言与禁用字词</div>
          <div
            v-for="(item, index) in groupManagerAuthorityVO"
            :key="item + index + 3"
          >
            <div
              class="setting-button"
              v-if="['banUserPost', 'disabledWord'].includes(item.key)"
            >
              <div class="setting-box">
                <div class="setting-button-left">
                  <el-switch
                    v-model="item.isCheck"
                    :inactive-text="item.name"
                    active-color="#fd5f3f"
                    inactive-color="#666666"
                  >
                  </el-switch>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="home-footer-btn">
          <el-button class="orange-btn" @click="addGroupMsg"
            >设定群组资讯</el-button
          >
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {
  listMember,
  addManager,
  setManagerAuthority,
} from "@/api/groupController";
import { nameTidy } from "@/utils/name";

export default {
  name: "AdminSetting",
  data() {
    return {
      groupManagerAuthorityVO: [
        {
          name: "加入成员",
          key: "addUser",
          isCheck: false,
        },
        {
          name: "踢除成员",
          key: "delUser",
          isCheck: false,
        },
        {
          name: "变更群组资讯",
          key: "updateGroupInfo",
          isCheck: false,
        },
        {
          name: "删除群组成员讯息",
          key: "delUserMessage",
          isCheck: false,
        },
        {
          name: "查看群组成员资讯",
          key: "checkUserInfo",
          isCheck: false,
        },
        {
          name: "传送文字讯息",
          key: "sendMessage",
          isCheck: true,
        },
        {
          name: "传送图片或语音讯息",
          key: "sendImage",
          isCheck: true,
        },
        {
          name: "传送档案或链接网址",
          key: "sendLink",
          isCheck: true,
        },
        {
          name: "置顶讯息",
          key: "pin",
          isCheck: false,
        },
        {
          name: "发起群组通话",
          key: "startGroupCall",
          isCheck: false,
        },
        {
          name: "禁言设定",
          key: "banUserPost",
          isCheck: false,
        },
        {
          name: "禁言字词设定",
          key: "disabledWord",
          isCheck: false,
        },
      ],
      device: localStorage.getItem("device"),
    };
  },
  created() {
    if (this.device === "mobile") {
      this.groupData = JSON.parse(localStorage.getItem("groupData"));
    } else {
      this.groupData = this.groupUser;
    }
  },
  mounted() {},
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      msgInfoPage: (state) => state.ws.msgInfoPage,
      groupPermissionData: (state) => state.ws.groupPermissionData,
      authorityGroupData: (state) => state.ws.authorityGroupData,
    }),
  },
  methods: {
    ...mapMutations({
      setMsgInfoPage: "ws/setMsgInfoPage",
      setGroupPermissionData: "ws/setGroupPermissionData",
    }),
    groupName(el) {
      let name = "";
      if (!el.groupNickname) {
        name = !el.groupNumber ? el.name : el.groupNumber;
      } else if (el.groupNickname) {
        name = el.groupNickname;
      }
      let showGroupNumber = this.authorityGroupData.showGroupNumber;
      let editGroupNickname = this.authorityGroupData.editGroupNickname;
      return nameTidy({name,el,showGroupNumber,editGroupNickname})
    },
    addGroupMsg() {
      this.newManagerAuthorityData = {};
      this.groupManagerAuthorityVO.forEach((el) => {
        this.newManagerAuthorityData[el.key] = true;
        let newData = this.groupManagerAuthorityVO.filter((res) => {
          return res.key === el.key;
        });
        this.newManagerAuthorityData[el.key] = newData[0].isCheck;
      });
      if (!this.groupPermissionData.addGroup) {
        let paramsData =
          this.device === "mobile" ? this.$route.params : this.msgInfoPage.data;
        let params = {
          groupId: paramsData.groupId,
          groupManagerAuthorityVO: this.newManagerAuthorityData,
          memberId: paramsData.memberId,
        };
        if (!paramsData.isManager) {
          addManager(params).then((res) => {
            if (res.code === 200) {
              this.groupActionCurrent();
            }
          });
        } else {
          setManagerAuthority(params).then((res) => {
            if (res.code === 200) {
              this.groupActionCurrent();
            }
          });
        }
      } else {
        this.newManagerAuthorityData["memberId"] = this.$route.params.contactId;
        if (this.$route.params.isManager) {
          this.groupPermissionData.groupManagerAuthority.forEach((el) => {
            if (el.memberId === this.$route.params.contactId) {
              for (let key1 in el) {
                for (let key2 in this.newManagerAuthorityData) {
                  if (key1 === key2) {
                    el[key1] = this.newManagerAuthorityData[key2];
                  }
                }
              }
            }
          });
        } else {
          this.groupPermissionData.groupManagerAuthority.push(
            this.newManagerAuthorityData
          );
        }
        this.groupPermissionData.peopleData.forEach((res) => {
          if (res.contactId === this.$route.params.contactId) {
            res.isManager = true;
            res.authority = this.newManagerAuthorityData;
          }
        });
        this.setGroupPermissionData(this.groupPermissionData);
        this.$router.push({ path: "/AdminSetting" });
      }
    },
    groupActionCurrent() {
      if (this.device === "mobile") {
        this.$router.push({ path: "/AdminSetting" });
      } else {
        if (this.msgInfoPage.pageAdd) {
          this.setMsgInfoPage({ pageShow: false, type: "AdminSettingPage" });
        } else {
          this.setMsgInfoPage({ pageShow: false, type: "AdminSetting" });
        }
      }
    },
    getGroupListMember() {
      if (!this.groupPermissionData.addGroup) {
        let groupId = this.groupData.groupId;
        listMember({ groupId }).then((res) => {
          let parmaMemberId =
            this.device === "mobile"
              ? this.$route.params.memberId
              : this.msgInfoPage.data.memberId;
          this.newData = res.data.list.filter((el) => {
            return el.memberId === parmaMemberId;
          });
          let managerAuthority = this.newData[0].authority;
          if (managerAuthority) {
            for (let item in managerAuthority) {
              this.groupManagerAuthorityVO.forEach((res) => {
                if (item === res.key) {
                  return (res.isCheck = managerAuthority[item]);
                }
              });
            }
          }
        });
      } else {
        let managerAuthority = this.$route.params.authority;
        if (managerAuthority) {
          for (let item in managerAuthority) {
            this.groupManagerAuthorityVO.forEach((res) => {
              if (item === res.key) {
                return (res.isCheck = managerAuthority[item]);
              }
            });
          }
        }
      }
    },
    back() {
      if (this.device === "mobile") {
        this.$router.back(-1);
      } else {
        if (this.groupPermissionData.addGroup) {
          this.$router.back(-1);
        } else {
          if (this.msgInfoPage.pageAdd) {
            this.setMsgInfoPage({ pageShow: false, type: "AdminSettingPage" });
          } else {
            this.setMsgInfoPage({ pageShow: false, type: "AdminSetting" });
          }
        }
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
    .home-user-pc {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/arrow-left.png");
      cursor: pointer;
    }
  }
  .home-content {
    .user-data {
      span {
        display: block;
        text-align: center;
        height: 0;
        font-weight: 600;
      }
    }
    .setting-title {
      padding: 15px 20px;
      color: rgba(0, 0, 0, 0.4);
      font-size: 15px;
    }
    .setting-button {
      padding: 0.5em 0 0.5em 0.5em;
      background-color: #fff;
      a,
      .setting-box {
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: 0.5em 0.7em 0.5em 0;
        margin-left: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }
      img {
        height: 1.2em;
      }
      .setting-button-left {
        .el-image {
          .el-image__inner {
            height: -webkit-fill-available !important;
          }
        }
      }

      .setting-button-left {
        display: flex;
        align-items: center;
        width: 100vw;
        span {
          font-size: 16px;
          color: #333333;
        }
        .el-switch {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        ::v-deep.el-switch__label.is-active {
          color: #333333;
        }
      }
      .setting-button-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 10em;
        span {
          margin-right: 1em;
          font-size: 15px;
          color: #b3b3b3;
        }
      }
    }
  }
}
.info-box{
  display: flex;
  justify-content: center;
}
.hichat-mobile{
  .service-icon{
    width: 3em;
    height: 3em;
  }
}
.hichat-pc{
  .service-icon{
    width: 6em;
    height: 6em;
  }
}
</style>
