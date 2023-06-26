<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'mobile'">
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">禁言设定</span>
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
        <div class="home-content">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in newContactList"
              :label="
                !groupPermissionData.addGroup ? item.memberId : item.contactId
              "
              :key="index"
            >
              <div class="address-box">
                <div :class="{ 'service-icon': item.isCustomerService }"></div>
                <el-image :src="groupIconShow(item)" />
                <div class="content-box">
                  <div class="msg-box" style="align-items: center">
                    <span>{{ groupName(item) }}</span>
                  </div>
                  <div class="content-border-bottom"></div>
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="home-footer-btn">
          <el-button class="orange-btn" @click="setBan">储存设定</el-button>
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
            <span class="home-header-title">禁言设定</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)">
          <div class="home-search">
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
            >
            </el-input>
          </div>
        </div>
        <div class="home-content">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in newContactList"
              :label="
                !groupPermissionData.addGroup ? item.memberId : item.contactId
              "
              :key="index"
            >
              <div class="address-box">
                <div :class="{ 'service-icon': item.isCustomerService }"></div>
                <el-image :src="groupIconShow(item)" />
                <div class="content-box">
                  <div class="msg-box" style="align-items: center">
                    <span>{{ groupName(item) }}</span>
                  </div>
                  <div class="content-border-bottom"></div>
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="home-footer-btn">
          <el-button class="orange-btn" @click="setBan">储存设定</el-button>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { listMember, setBanPost } from "@/api/groupController";
import { groupIcon } from "@/utils/icon";
import { nameTidy } from "@/utils/name";

export default {
  name: "SettingGroup",
  data() {
    return {
      checkList: [],
      contactList: [],
      newContactList: [],
      searchKey: "",
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
  mounted() {
    this.getGroupListMember();
  },
  watch: {
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
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      authority: (state) => state.ws.authority,
      groupPermissionData: (state) => state.ws.groupPermissionData,
      authorityGroupData: (state) => state.ws.authorityGroupData,
    }),
  },
  methods: {
    ...mapMutations({
      setMsgInfoPage: "ws/setMsgInfoPage",
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
      return nameTidy({name,el,showGroupNumber,editGroupNickname})

    },
    getGroupListMember() {
      if (!this.groupPermissionData.addGroup) {
        let groupId = this.groupData.groupId;
        listMember({ groupId }).then((res) => {
          this.contactList = res.data.list;
          this.contactList.forEach((item) => {
            item.groupNumber = "成员" + item.groupNumber;
            if (!item.icon) {
              item.icon = require("./../../../static/images/image_user_defult.png");
            }
            if (item.isBanPost) {
              this.checkList.push(item.memberId);
            }
          });
          this.contactList = this.contactList.filter((el) => {
            return !el.isAdmin && !el.isManager;
          });
          this.newContactList = this.contactList;
        });
      } else {
        this.contactList = this.groupPermissionData.peopleData.filter((el) => {
          return !el.isManager;
        });
        this.contactList.forEach((res) => {
          this.groupPermissionData.banPostMemberList.forEach((el) => {
            if (res.contactId === el) {
              this.checkList.push(res.contactId);
            }
          });
        });
        this.newContactList = this.contactList;
      }
    },
    setBan() {
      if (!this.groupPermissionData.addGroup) {
        let memberData = [];
        this.checkList.forEach((el) => {
          memberData.push(el);
        });
        let params = {
          groupId: this.groupData.groupId,
          memberId: memberData,
        };
        setBanPost(params).then((res) => {
          if (res.code === 200) {
            if (this.device === "mobile") {
              this.$router.push({ name: "SettingGroup" });
            } else {
              this.setMsgInfoPage({ pageShow: false, type: "SettingGroup" });
            }
          }
        });
      } else {
        this.groupPermissionData.banPostMemberList = this.checkList;
        this.$router.push({ name: "SettingGroup" });
      }
    },
    back() {
      if (this.device === "mobile") {
        this.$router.back(-1);
      } else {
        if (this.groupPermissionData.addGroup) {
          this.$router.back(-1);
        } else {
          this.setMsgInfoPage({ pageShow: false, type: "SettingGroup" });
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
    .setting-title {
      padding: 15px 20px;
      color: rgba(0, 0, 0, 0.4);
      font-size: 15px;
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
      a,
      .setting-box {
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        align-content: center;
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
          font-size: 15px;
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
.hichat-pc {
  .home-wrapper {
    .home-search {
      .el-input {
        width: 95%;
      }
    }
    .home-content {
      .el-checkbox {
        width: 100%;
      }
    }
  }
}

</style>
