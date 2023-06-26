<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="70px">
          <div class="home-header">
            <router-link :to="'/Setting'">
              <div class="home-user"></div>
            </router-link>
            <span class="home-header-title">密码管理</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>

        <div class="home-content">
          <div
            class="setting-button"
            v-for="(item, index) in aboutData"
            :key="index"
            :class="{ 'border-bottom': item.name === '修改登录密码' }"
          >
            <router-link :to="item.path">
              <div class="setting-button-left">
                <div :class="{ 'service-icon': item.isCustomerService }"></div>
                <el-image
                  :src="noIconShow(item, 'user')"
                  :preview-src-list="[noIconShow(item, 'user')]"
                />
                <span>{{ item.name }}</span>
              </div>
              <div
                class="setting-button-right version"
                v-if="item.name === '生物辨识'"
              >
                <el-switch
                  v-model="notification"
                  active-color="#fd5f3f"
                  inactive-color="#666666"
                  disabled
                >
                </el-switch>
              </div>
              <div class="setting-button-right" v-else>
                <img src="./../../../static/images/next.png" alt="" />
              </div>
            </router-link>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { showIcon } from "@/utils/icon";

export default {
  name: "PasswordMange",
  data() {
    return {
      aboutData: [
        {
          name: "修改登录密码",
          path: "/PasswordEdit",
        },
        // {
        //   name: "生物辨识",
        //   path: "",
        // },
      ],
      notification: false,
    };
  },
  methods: {
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
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
  .home-content {
    .setting-button {
      padding: 0.5em 0 0.5em 0.5em;
      background-color: #fff;
      a {
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
        span {
          margin-left: 1em;
          font-size: 15px;
          color: #333333;
        }
      }
      .setting-button-right {
        display: flex;
        align-items: center;
        span {
          margin-right: 1em;
          font-size: 15px;
          color: #b3b3b3;
        }
      }
      .version {
        span {
          margin-right: 0;
        }
      }
    }
    .mt10 {
      margin-top: 1em;
    }
    .border-bottom {
      &::after {
        content: "";
        display: block;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        width: 100%;
        margin-left: 10px;
        position: relative;
        top: 9px;
      }
    }
  }
}
</style>
