<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'mobile'">
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">管理员设定</span>
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
          <div v-for="(item, index) in newContactList" :key="index">
            <div class="setting-button mt10">
              <div class="setting-box" @click="addAdmin(item)">
                <div class="setting-button-left">
                  <div class="el-image">
                    <div
                      :class="{ 'service-icon': item.isCustomerService }"
                    ></div>
                    <img
                      :src="noIconShow(item, 'user')"
                      alt=""
                      class="el-image__inner"
                    />
                  </div>
                  <span>{{ groupName(item) }}</span>
                </div>
                <div class="setting-button-right">
                  <span>＋</span>
                </div>
              </div>
            </div>
          </div>
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
                  ? 'position: relative; left: 0px; top: 1px;'
                  : ''
              "
              >管理员设定</span
            >
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
          <div v-for="(item, index) in newContactList" :key="index">
            <div class="setting-button mt10">
              <div class="setting-box" @click="addAdmin(item)">
                <div class="setting-button-left">
                  <div class="el-image">
                    <div
                      :class="{ 'service-icon': item.isCustomerService }"
                    ></div>
                    <img
                      :src="noIconShow(item, 'user')"
                      alt=""
                      class="el-image__inner"
                    />
                  </div>
                  <span>{{ groupName(item) }}</span>
                </div>
                <div class="setting-button-right">
                  <span>＋</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { listMember } from "@/api/groupController";
import { showIcon } from "@/utils/icon";
import { nameTidy } from "@/utils/name";

export default {
  name: "SettingGroup",
  data() {
    return {
      contactList: [],
      newContactList: [],
      adminUser: [],
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
  mounted() {
    this.getGroupListMember();
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      groupPermissionData: (state) => state.ws.groupPermissionData,
      authorityGroupData: (state) => state.ws.authorityGroupData,
    }),
  },
  methods: {
    ...mapMutations({
      setMsgInfoPage: "ws/setMsgInfoPage",
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
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
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
          });
          this.checkDataList = this.contactList.filter(
            (el) => el.memberId !== this.groupData.memberId
          );
          this.contactList = this.contactList.filter(
            (el) => (!el.isAdmin && !el.isManager)
          );
          this.newContactList = this.contactList;
        });
      } else {
        this.contactList = this.groupPermissionData.peopleData.filter((el) => {
          return !el.isManager;
        });
        this.newContactList = this.contactList;
      }
    },
    addAdmin(data) {
      if (this.device === "mobile") {
        this.$router.push({ name: "AdminSettingDetail", params: data });
      } else {
        if (this.groupPermissionData.addGroup) {
          this.$router.push({ name: "AdminSettingDetail" });
        }
        this.setMsgInfoPage({
          pageShow: false,
          type: "AdminSettingDetail",
          pageAdd: true,
          data,
        });
      }
    },
    back() {
      if (this.device === "mobile") {
        this.$router.back(-1);
      } else {
        if (this.groupPermissionData.addGroup) {
          this.$router.back(-1);
        } else {
          this.setMsgInfoPage({ pageShow: false, type: "AdminSetting" });
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
      padding: 0.5em 0 0 0.5em;
      background-color: #fff;
      &::after {
        content: "";
        display: block;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        width: 94%;
        /* margin-left: 0; */
        position: relative;
        top: -14px;
        left: 74px;
      }
      a,
      .setting-box {
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: 0.5em 0.7em 0.5em 0;
        margin-left: 10px;
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
        width: 20em;
        span {
          font-size: 16px;
          padding-left: 1em;
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
          font-size: 20px;
          color: #fe5f3f;
          cursor: pointer;
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
