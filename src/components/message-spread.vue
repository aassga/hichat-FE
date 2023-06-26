<template>
  <div class="message-pabel-box" @touchmove="$root.handleTouch">
    <div class="spread-box">
      <div
        class="address-box"
        v-for="(item, index) in spreadDataList"
        :key="index"
      >
        <div :class="{ 'service-icon': item.isCustomerService }"></div>
        <el-image
          :src="noIconShow(item, 'user')"
          :preview-src-list="[noIconShow(item, 'user')]"
        />
        <div class="content-box">
          <span>{{ item.name }}</span>
          <div class="content-border-bottom"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AESBase64 from "@/utils/AESBase64.js";
import { mapState } from "vuex";
import { showIcon } from "@/utils/icon";

export default {
  name: "MessageSpreadPabel",
  data() {
    return {
      device: localStorage.getItem("device"),
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  computed: {
    ...mapState({
      spreadDataList: (state) => state.ws.spreadDataList,
    }),
  },
  mounted() {
    window.addEventListener(
      "scroll",
      () => {
        let scrollTop = document.querySelector(".message-pabel-box");
        this.showScrollBar = !(
          scrollTop.scrollHeight - scrollTop.scrollTop - 1 <=
          scrollTop.clientHeight
        );
      },
      true
    );
  },
  methods: {
    //判斷是否base64
    isBase64(data) {
      return AESBase64(data, this.aesKey, this.aesIv);
    },
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
  },
};
</script>

<style lang="scss" scoped>
.message-pabel-box {
  padding: 0 10px 0 20px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .message-styles-box {
    margin-bottom: 20px;
  }
}
.spread-box {
  width: 22em;
  margin: 15px -5px;
  .address-box {
    .content-box {
      padding-left: 1em;
      height: 2em;
      span {
        font-size: 14px;
        height: 48px;
        display: flex;
        align-items: center;
      }
      .content-border-bottom {
        width: 16em;
        border-bottom: 0.02em solid rgba(0, 0, 0, 0.05);
        position: relative;
      }
    }
  }
}
</style>
