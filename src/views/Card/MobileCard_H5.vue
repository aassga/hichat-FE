<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container>
      <el-main>
        <template v-if="device === 'mobile'">
          <el-header height="125px">
            <div class="home-header">
              <div class="home-user" @click="back"></div>
              <span class="home-header-title">联络人名片</span>
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
              <span class="home-header-title">联络人名片</span>
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
              :label="item.contactId"
              :key="index"
            >
              <div class="address-box">
                <div :class="{ 'service-icon': item.isCustomerService }"></div>
                <el-image
                  :src="noIconShow(item, 'user')"
                  :preview-src-list="[noIconShow(item, 'user')]"
                />
                <div class="content-box">
                  <div class="msg-box" style="align-items: center">
                    <span> {{ item.name }}</span>
                  </div>
                  <div class="content-border-bottom"></div>
                </div>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
        <div class="home-footer-btn">
          <el-button
            :class="disabled ? 'gray-btn' : 'background-orange'"
            :disabled="disabled"
            @click="sendContact()"
            >传送</el-button
          >
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { getToken } from "_util/utils.js";
import { mapState, mapMutations } from "vuex";
import { showIcon } from "@/utils/icon";

export default {
  name: "MobileCard",
  data() {
    return {
      checkList: "",
      contactList: [],
      newContactList: [],
      spreadDataList: [],
      searchKey: "",
      disabled: true,
      successDialogShow: false,
      userData: "",
      device: localStorage.getItem("device"),
    };
  },
  computed: {
    ...mapState({
      msgInfoPage: (state) => state.ws.msgInfoPage,
      myContactDataList: (state) => state.ws.myContactDataList,
    }),
  },
  mounted() {
    this.getContactData();
    this.getSpreadDataList();
    this.userData = this.msgInfoPage.userData;
  },
  watch: {
    checkList(val) {
      this.disabled = val === "";
    },
    searchKey(val) {
      let searchKeyData = val.split(" ");
      searchKeyData.forEach((el) => {
        let searchCase = this.myContactDataList;
        this.searchData = searchCase.filter((item) => {
          return item.name.indexOf(el.replace("@", "")) !== -1;
        });
      });
      this.newContactList = this.searchData;
    },
  },
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
    }),
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    getContactData() {
      this.newContactList = this.myContactDataList.filter((res) => {
        return res.contactId !== res.memberId;
      });
    },
    getSpreadDataList() {
      this.spreadDataList = this.$route.params.spreadData;
    },
    sendContact() {
      if (Object.keys(this.$route.params).length !== 0) {
        this.spreadDataList.forEach((res) => {
          let chatMsgKey = {
            chatType: "CLI_CONTACT_CARD",
            id: Math.random(),
            targetId: "u" + this.checkList,
            tokenType: 0,
            toChatId: "u" + res.contactId,
            token: getToken("token"),
            deviceId: localStorage.getItem("UUID"),
          };
          Socket.send(chatMsgKey);
        });
        this.$message({ message: "发送讯息成功", type: "success" });
        this.goHomeBack();
      } else {
        let chatMsgKey = {
          chatType: "CLI_CONTACT_CARD",
          id: Math.random(),
          targetId: "u" + this.checkList,
          tokenType: 0,
          toChatId: this.userData.toChatId,
          token: getToken("token"),
          deviceId: localStorage.getItem("UUID"),
        };
        Socket.send(chatMsgKey);
        this.$message({ message: "发送讯息成功", type: "success" });
        this.back();
      }
    },
    goHomeBack() {
      this.$router.push({ path: "/HiChat" });
    },
    back() {
      if (this.device === "mobile") {
        if (Object.keys(this.$route.params).length !== 0) {
          this.$router.push({
            name: "spreadMessage",
            params: { spreadData: this.spreadDataList },
          });
        } else {
          this.$router.back(-1);
        }
      } else {
        this.setInfoMsg({ infoMsgShow: false, infoMsgChat: false });
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
  .home-footer-btn {
    .background-red {
      background-color: #ee5253;
      color: #fff;
    }
    .background-orange {
      background-color: #fe5f3f;
      color: #fff;
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
          .background-red {
            background-color: #ee5253;
            color: #fff;
          }
          .background-orange {
            background-color: #fe5f3f;
            color: #fff;
          }
          .el-button {
            padding: 9px 20px;
          }
        }
      }
    }
  }
}
</style>
