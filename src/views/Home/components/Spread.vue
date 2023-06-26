<template>
  <div class="home-content" >
    <div class="home-search">
      <el-input
        placeholder="搜索聯絡人"
        prefix-icon="el-icon-search"
        clearable
        v-model="searchKey"
      >
      </el-input>
    </div>
    <div class="home-header" v-if="$route.name === 'Spread'">
      <span class="home-header-title" style="color: #b3b3b3; font-weight:normal;">请选择发送对象</span>
    </div>
    <el-checkbox-group v-model="checkList" @touchmove="$root.handleTouch">
      <el-checkbox
        v-for="(item, index) in newContactList"
        :label="item"
        :key="index"
      >
        <div class="address-box">
          <div :class="{'service-icon':item.isCustomerService}">
            
          </div>
          <el-image :src="noIconShow(item,'user')" :preview-src-list="[noIconShow(item,'user')]"  />
          <div class="content-box" >
            <div class="msg-box" style="align-items: center;">
              <span>{{ item.name }}</span>
            </div>
            <div class="content-border-bottom"></div>
          </div>
        </div>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { getContactList } from "@/api/memberContactController";
import { mapMutations } from "vuex";
import { showIcon } from "@/utils/icon";

export default {
  name: "Spread",
  data() {
    return {
      searchKey: "",
      checkList: [],
      contactList: [],
      newContactList:[],
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.getAddressList();
    this.setSpreadDataList([])
  },
  watch: {
    searchKey(val) {
      let searchKeyData = val.split(" ");
      searchKeyData.forEach((el) => {
        let searchCase = this.contactList;
        this.searchData = searchCase.filter((item) => {
          return item.name.indexOf(el.replace("@", "")) !== -1;
        });
      });
      this.newContactList = this.searchData
    },
    checkList(val){
      this.setSpreadDataList(val)
    }
  },
  methods: {
    ...mapMutations({
      setSpreadDataList:"ws/setSpreadDataList",
    }),    
    noIconShow(iconData, key) {
      return showIcon(iconData, key)
    },
    getAddressList() {
      getContactList().then((res) => {
        this.contactList = res.data.list.filter(
          (el) => el.contactId !== localStorage.getItem("id")
        );
        this.contactList.forEach((res) => {
          if (!res.icon) {
            res.icon = require("./../../../../static/images/image_user_defult.png");
          }
        });
        this.newContactList = this.contactList;
      });
    }, 
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .home-header {
    justify-content: center;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin: 0;
    padding: 15px;
    .home-user {
      background-color: #fff;
      background-image: url("./../../../../static/images/back.png");
    }
    .home-user-pc {
      background-color: #fff;
      background-image: url("./../../../../static/images/pc/arrow-left.png");
      cursor: pointer;
    }
  }
  .home-content {
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
          .msg-box {
            span {
              color: #666666;
            }
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
</style>
