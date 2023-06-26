<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container>
      <el-main>
        <template v-if="device === 'mobile'">
          <el-header height="125px">
            <div class="home-header">
              <div class="home-user" @click="back"></div>
              <span class="home-header-title">转移群主权限</span>
              <div class="home-add-user"></div>
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
        <template v-else>
          <el-header height="70px">
            <div
              class="home-header flex-start"
              style="position: relative; left: -4px; top: -1px"
            >
              <div class="home-user-pc" @click="back"></div>
              <span class="home-header-title">转移群主权限</span>
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

        <div class="home-content">
          <el-radio-group v-model="checkList">
            <el-radio
              v-for="(item, index) in newContactList"
              :label="item.memberId"
              :key="index"
            >
              <div class="address-box">
                <div :class="{ 'service-icon': item.isCustomerService }"></div>
                <el-image :src="noIconShow(item, 'group')" />
                <div class="content-box">
                  <div class="msg-box" style="align-items: center">
                    <span> {{ item.name }} ( {{ groupName(item) }} )</span>
                  </div>
                  <div class="content-border-bottom"></div>
                </div>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
        <div class="home-footer-btn">
          <el-button
            :class="disabled ? 'gray-btn' : 'red-btn'"
            :disabled="disabled"
            @click="groupAdminChange = true"
            >转移</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-dialog
      :title="device === 'pc' ? '转移群主权限' : ''"
      :visible.sync="groupAdminChange"
      class="el-dialog-loginOut"
      width="75%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'mobile'">
          <img src="./../../../static/images/warn.png" alt="" />
        </div>
        <span>确认是否將管理者权限轉移給 {{ checkMember.name }} ？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          :class="device === 'mobile' ? 'border-red' : 'background-gray'"
          @click="groupAdminChange = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="successDialogShow = true"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="device === 'pc' ? '转移群主权限' : ''"
      :visible.sync="successDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'mobile'">
          <img src="./../../../static/images/success.png" alt="" />
        </div>
        <span>操作成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="changeGroupAdmin"
          >確認</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { listMember, changeAdmin } from "@/api/groupController";
import { showIcon } from "@/utils/icon";
import { nameTidy } from "@/utils/name";

export default {
  name: "GroupAdminChange",
  data() {
    return {
      groupData: {},
      checkList: "",
      checkMember: "",
      contactList: [],
      newContactList: [],
      searchKey: "",
      disabled: true,
      successDialogShow: false,
      groupAdminChange: false,
      device: localStorage.getItem("device"),
    };
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      infoMsg: (state) => state.ws.infoMsg,
      authorityGroupData: (state) => state.ws.authorityGroupData,
    }),
  },
  created() {
    this.groupData = this.groupUser;
  },
  mounted() {
    this.getGroupListMember();
  },
  watch: {
    checkList(val) {
      this.disabled = val === "";
      this.checkMember = this.contactList.filter(
        (el) => el.memberId === val
      )[0];
    },
    searchKey(val) {
      let searchKeyData = val.split(" ");
      searchKeyData.forEach((el) => {
        let searchCase = this.contactList;
        this.searchData = searchCase.filter((item) => {
          return this.groupName(item).indexOf(el.replace("@", "")) !== -1;
        });
      });
      this.newContactList = this.searchData;
    },
  },
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
      setChatGroup: "ws/setChatGroup",
      setMsgInfoPage: "ws/setMsgInfoPage",
    }),
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    groupName(el) {
      let name = !el.groupNickname ? el.groupNumber : el.groupNickname;
      let showGroupNumber = this.authorityGroupData.showGroupNumber;
      let editGroupNickname = this.authorityGroupData.editGroupNickname;
      return nameTidy({name,el,showGroupNumber,editGroupNickname})
    },
    getGroupListMember() {
      let groupId = this.groupData.groupId;
      listMember({ groupId })
        .then((res) => {
          this.contactList = res.data.list.filter((el) => !el.isAdmin);
          this.contactList.forEach((item) => {
            item.groupNumber = "成员" + item.groupNumber;
          });
          this.newContactList = this.contactList;
        })
    },
    changeGroupAdmin() {
      let param = {
        groupId: this.groupData.groupId,
        memberId: this.checkList,
      };
      changeAdmin(param)
        .then((res) => {
          if (res.code === 200) {
            this.groupData.isAdmin = false;
            this.setChatGroup(this.groupData);
            this.back();
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
            infoMsgChat: true,
            infoMsgNav: "GroupPage",
          });
          this.setMsgInfoPage({ pageShow: true });
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
    overflow-x: hidden;
    overflow-y: auto;
    ::v-deep.el-radio {
      display: flex;
      align-items: center;
      flex-flow: row-reverse;
      background-color: #fff;
      width: 100vw;
      .el-radio__input {
        padding-right: 20px;
        .el-radio__inner {
          border-radius: 10px;
        }
      }
      .el-radio__label {
        width: 100%;
        padding-left: 0;
        .address-box {
          .msg-box {
            width: auto;
            color: #666666;
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
          .home-user-pc {
            background-color: #fff;
            background-image: url("./../../../static/images/pc/arrow-left.png");
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
          .el-radio-group {
            width: 100%;
            .el-radio {
              width: 100%;
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
</style>
