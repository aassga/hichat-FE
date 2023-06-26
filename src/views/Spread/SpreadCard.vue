<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container>
      <el-main>
        <el-header height="70px">
          <div
            class="home-header flex-start"
            style="position: relative; left: -4px; top: -1px"
          >
            <div class="home-user-pc" @click="back()">
              <i class="el-icon-close"></i>
            </div>
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
            :class="disabled ? 'gray-btn' : 'org-btn'"
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
  name: "SpreadCard",
  data() {
    return {
      checkList: "",
      contactList: [],
      newContactList: [],
      spreadDataList: [],
      searchKey: "",
      disabled: true,
      successDialogShow: false,

      device: localStorage.getItem("device"),
    };
  },
  props: {
    checkData: {
      type: Array,
    },
  },
  computed: {
    ...mapState({
      myContactDataList: (state) => state.ws.myContactDataList,
    }),
  },
  mounted() {
    this.getContactData();
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
    getContactData() {
      this.newContactList = this.myContactDataList.filter((res) => {
        return res.contactId !== res.memberId;
      });
    },
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    sendContact() {
      this.checkData.forEach((res) => {
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
      this.back();
    },
    back() {
      this.$emit("closeChooseContact", false);
      this.$emit("sendSubmit", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.org-btn {
  background-color: #ff6900;
  color: #ffffff;
}
.home-wrapper {
  background: #fff;
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
}
.hichat-pc {
  .home-wrapper {
    .el-container {
      .el-main {
        border-radius: 0;
        .home-header {
          .home-user-pc {
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
  }
}
</style>
