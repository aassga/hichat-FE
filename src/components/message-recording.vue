<template>
  <el-dialog
    title="录音"
    :visible.sync="audioShow"
    width="100%"
    append-to-body
    :before-close="audioDialogShowShow"
    :close-on-click-modal="false"
    center
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="录音上传中"
  >
    <div class="record-play">
      <div class="record-time">
        {{ one }}<span>:</span>{{ two }}<span>:</span>{{ three }}
      </div>
      <div id="audioVoice-box"></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="disabledPlay" @click="onStartVoice"
        >开始录音</el-button
      >
      <el-button type="info" :disabled="endDisabledPlay" @click="onEndVoice"
        >結束录音</el-button
      >
      <el-button
        type="danger"
        :disabled="uploadDisabledPlay"
        @click="onAudioFile"
        >上传录音</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import Socket from "@/utils/socket";
import Record from "./../../static/js/record-sdk";
import { getToken } from "_util/utils.js";
import { mapState } from "vuex";
import { uploadMessageFile } from "@/api/uploadController";
import { Encrypt } from "@/utils/AESUtils.js";
export default {
  name: "MessageInput",
  data() {
    return {
      fullscreenLoading: false,
      device: localStorage.getItem("device"),
      //錄音
      isVoice: false,
      isFinished: false,
      disabledPlay: false,
      endDisabledPlay: true,
      uploadDisabledPlay: true,
      evaluate: false,
      audio: "",
      recorder: new Record(),
      audioMessageData: {},

      //計時
      flag: null,
      one: "00", // 時
      two: "00", // 分
      three: "00", // 秒
      abc: 0, // 秒的計數
      cde: 0, // 分的計數
      efg: 0, // 時的計數
      scrollTop: 0,

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  props: {
    // 当前用户
    type: {
      type: String,
    },
    // 当前用户
    roomInfo: {
      type: Object,
    },
    audioShow: {
      type: Boolean,
    },
  },
  computed: {
    ...mapState({
      soundNotify: (state) => state.ws.soundNotify,
    }),
  },
  methods: {
    // 開始計時
    startHandler() {
      this.resetTime();
      this.flag = setInterval(() => {
        if (this.three === 60 || this.three === "60") {
          this.three = "00";
          this.abc = 0;
          if (this.two === 60 || this.two === "60") {
            this.two = "00";
            this.cde = 0;
            if (this.efg + 1) {
              this.efg++;
              this.one = "0" + this.efg;
            } else {
              this.efg++;
              this.one = this.efg;
            }
          } else {
            if (this.cde + 1 <= 9) {
              this.cde++;
              this.two = "0" + this.cde;
            } else {
              this.cde++;
              this.two = this.cde;
            }
          }
        } else {
          if (this.abc + 1 <= 9) {
            this.abc++;
            this.three = "0" + this.abc;
          } else {
            this.abc++;
            this.three = this.abc;
          }
        }
      }, 1000);
    },
    // 暫停計時
    endHandler() {
      this.flag = clearInterval(this.flag);
    },

    // 重置秒數
    resetTime() {
      this.one = "00"; // 時
      this.two = "00"; // 分
      this.three = "00"; // 秒
      this.abc = 0; // 秒的計數
      this.cde = 0; // 分的計數
      this.efg = 0; // 時的計數
    },

    // 開啟錄音
    sendAudio() {
      this.resetTime();
      this.endHandler();
      this.onStopAudio();
      this.isFinished = false;
      this.$emit("audioDialogShow", true);

      //初始化按鈕
      this.disabledPlay = false;
      this.endDisabledPlay = true;
      this.uploadDisabledPlay = true;
    },

    // 开始录音
    onStartVoice() {
      this.onStopAudio();
      this.disabledPlay = true;
      this.uploadDisabledPlay = true;
      // this.isFinished = false;
      this.recorder.startRecord({
        success: (res) => {
          this.isVoice = true;
          this.endDisabledPlay = false;
          this.startHandler();
        },
        error: (e) => {
          this.resetTime();
          this.endHandler();
          this.isVoice = false;
          this.disabledPlay = false;
          this.endDisabledPlay = true;
          this.$message({ message: e, type: "warning" });
        },
      });
    },

    // 结束录音
    onEndVoice() {
      this.isFinished = true;
      this.disabledPlay = false;
      this.endDisabledPlay = true;
      this.uploadDisabledPlay = false;
      this.endHandler();
      this.recorder.stopRecord({
        success: (res) => {
          this.isVoice = false;
          //此处可以获取音频源文件(res)，用于上传等操作
          this.audio = document.getElementById("audioVoice-box");
          this.recorder.play(this.audio);
          this.audioMessageData = res;
        },
        error: (e) => {
          this.isVoice = false;
        },
      });
    },
    // 停止播放录音
    onStopAudio() {
      if (document.getElementById("audioVoice"))
        this.recorder.clear(this.audio);
    },

    // 關閉錄音
    audioDialogShowShow() {
      this.audioMessageData = {};
      this.$emit("audioDialogShow", false);
    },

    // 上傳錄音
    onAudioFile() {
      const formData = new FormData();
      formData.append("file", this.audioMessageData, `${Date.now()}.mp3`);
      formData.append("type", "AUDIO");
      this.fullscreenLoading = true;
      uploadMessageFile(formData).then((res) => {
        if (res.code === 200) {
          // 发送服务器
          let message = {
            chatType: this.type,
            deviceId: localStorage.getItem("UUID"),
            fromChatId: "u" + localStorage.getItem("id"),
            id: Math.random(),
            text: Encrypt(res.data, this.aesKey, this.aesIv),
            toChatId: this.roomInfo.toChatId,
            token: getToken("token"),
            tokenType: 0,
          };

          this.soundNotify.forEach((res) => {
            if (res.key === "private" && res.isNofity) this.audioAction();
          });
          Socket.send(message);
          this.fullscreenLoading = false;
          this.audioMessageData = {};
          this.$emit("audioDialogShow", false);
        }
      });
    },

    audioAction() {
      let audioEl = document.getElementById("notify-send-audio");
      var playPromise = audioEl.play();
      if (playPromise) {
        playPromise
          .then((_) => {
            audioEl.pause();
          })
          .catch((error) => {});
      }
      audioEl.src = ""; // 移除src, 防止之后播放空白音频
      setTimeout(() => {
        // 用setTimeout模拟一个2秒的延迟
        audioEl.src = require("./../../static/wav/send.mp3");
        audioEl.play();
      }, 150);
    },
  },
};
</script>

<style lang="scss" scoped>
.record-time {
  margin-bottom: 1em;
}
</style>
