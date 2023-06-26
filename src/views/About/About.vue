<template>
  <div class="home-wrapper">
    <el-container  v-if="device === 'mobile'">
      <el-main>
        <el-header height="70px">
          <div class="home-header">
            <div class="home-user" @click="back"></div>
            <span class="home-header-title">关于嗨聊</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <AboutMenu />
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="370px">
        <el-header height="70px">
          <div class="home-header">
            <div style="display: flex; align-items: center; cursor: pointer">
              <router-link :to="'/Setting'">
                <div class="home-user-pc"></div>
              </router-link>
              <span class="home-header-title">关于嗨聊</span>
            </div>
          </div>
        </el-header>
        <AboutMenu />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import AboutMenu from "./components/AboutMenu.vue";

export default {
  name: "About",
  components: {
    AboutMenu,
  },
  data() {
    return {
      device: localStorage.getItem("device"),
    };
  },
  methods: {
    back() {
      this.$router.back(-1);
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
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
  }
}
.hichat-pc {
  .home-header {
    .home-user-pc {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/arrow-left.png");
    }
    .home-header-title {
      margin-left: 5px;
    }
  }
}
</style>
