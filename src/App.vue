<template>
  <div id="app" :class="`hichat-${device}`">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- <router-view></router-view> -->
    <template v-if="ratings.length !== 0">
      <el-dialog :title="device === 'pc' ? '评价调查' : ''" :visible.sync="evaluateServiceShow" class="el-dialog-evaluate"
        :width="device === 'pc' ? '350px' : '80%'" :close-on-click-modal="false" :show-close="false" append-to-body
        center>
        <div class="evaluate-service-box">
          <div :class="{ 'service-icon': ratings[0].customerService }"></div>
          <img :src="noIconShow(ratings[0].customerService, 'user')" alt="" />
          <span class="title">{{ ratings[0].customerService.nickname }}</span>
          <div class="body">
            <span>您对这次的服务满意吗?</span>
            <span>您的反馈将有助于用户服务体验</span>
          </div>
          <el-rate v-model="evaluateRate"></el-rate>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="background-red" @click="sendRate(ratings[0])">提交评价</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { showIcon } from "@/utils/icon";
import { submitCustomerRating } from "@/api/customerServiceController";
import { mapState } from "vuex";

export default {
  name: "App",
  data() {
    return {
      evaluateRate: null,
      evaluateServiceShow: false,
      ratings: [],
    };
  },
  computed: {
    ...mapState({
      serviceIcon: (state) => state.ws.serviceIcon,
    }),
  },
  watch: {
    ratings(data) {
      if (data.length !== 0) {
        this.evaluateServiceShow = true;
      }
    },
  },
  created() {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i) ||
      navigator.userAgent.match(/Macintosh/i)
    ) {
      this.device = "mobile";
    } else {
      this.device = "pc";
    }
    localStorage.setItem("device", this.device);


    Socket.$on("message", this.handleGetMessage);
  },
  mounted() {
    if (this.device === "mobile") this.safariHacks();
    document.body.addEventListener("touchmove", (e) => { this.touchmove(e) }, { passive: false, });
    window.addEventListener("beforeunload", this.confirm_leaving);
  },
  destroyed() {
    document.body.removeEventListener("touchmove", (e) => { this.touchmove(e) }, { passive: false, });
    window.removeEventListener("beforeunload", this.confirm_leaving);
  },
  beforeDestroy() {
    this.touchmove()
    Socket.$off("message", this.handleGetMessage);
  },
  methods: {
    touchmove(e) {
      if (e._isScroller) return;
      e.preventDefault();
    },
    sendRate(data) {
      if (!this.evaluateRate) {
        this.$message({ message: "评价不可不填", type: "warning" });
        return false;
      }
      let rateData = {
        rating: this.evaluateRate,
        ticketId: data.ticketId,
      };
      submitCustomerRating(rateData).then((res) => {
        if (res.code === 200) {
          this.ratings = this.ratings.filter(
            (el) => el.ticketId !== rateData.ticketId
          );
          this.$message({ message: "评价成功", type: "success" });
        }
        this.evaluateRate = null;
        this.evaluateServiceShow = false;
      });
    },
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    serviceShow(item) {
      return;
    },
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      let userInfo = JSON.parse(msg);
      if (userInfo.chatType === "SRV_CUSTOMER_SERVICE_RATING") {
        this.evaluateServiceShow = true;
        userInfo.ratings.forEach((res) => {
          this.ratings.push(res);
        });
      }
    },
    confirm_leaving(evt) {
      const unsaved_changes_warning =
        "You have unsaved changes. Are you sure you wish to leave?";
      evt.returnValue = unsaved_changes_warning;
      return unsaved_changes_warning;
    },
    safariHacks() {
      let windowsVH = window.innerHeight / 100;
      document
        .querySelector(".hichat-mobile")
        .style.setProperty("--vh", windowsVH + "px");
      window.addEventListener("resize", function () {
        document
          .querySelector(".hichat-mobile")
          .style.setProperty("--vh", windowsVH + "px");
      });
    },
  },
};
</script>


<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300&display=swap");

#app {
  width: 100vw;
  height: 100vh;
  min-height: -webkit-fill-available;
  overflow: hidden;
  font-family: "Noto Sans SC", sans-serif;
  user-select: text;
}

.el-notification__content {
  margin-top: 20px;

  p {
    display: flex;
  }

  .notify-image {
    margin-right: 10px;
    width: 50px;
    height: 50px;
  }

  .notify-content {
    .notify-title {
      display: block;
      margin-bottom: 2px;
    }
  }
}

@media (max-width: 820px) {
  #app {
    max-width: 480px;
    margin: 0 auto;
  }
}

.el-dialog-evaluate {
  .el-dialog {
    .el-dialog__body {
      .evaluate-box {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          margin-bottom: 10px;
        }
      }

      .evaluate-service-box {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          height: 3em;
          margin-bottom: 10px;
          border-radius: 10px;
        }

        .title {
          color: #000000cc;
          font-size: 18px;
        }

        .body {
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          line-height: 2em;
          align-items: center;

          span {
            &:nth-child(1) {
              font-size: 16px;
              color: #000000cc;
            }

            &:nth-child(2) {
              font-size: 14px;
              color: #00000066;
            }
          }
        }

        .el-rate__icon {
          font-size: 35px;
        }
      }
    }

    .el-dialog__footer {
      .dialog-footer {
        justify-content: center;

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
}</style>
