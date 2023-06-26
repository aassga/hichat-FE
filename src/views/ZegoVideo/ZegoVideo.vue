<template>
  <div class="container main-wrapper" @touchmove="$root.handleTouch" >
    <!-- <div class="row"> -->

    <div class="page-wrapper" id="page-wrapper" style="overflow: auto;">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-lg-6 preview-wrapper">
            <div class="row">
              <div class="preview-pushlishInfo col-lg-12 col-6">
                <div class="pushlishInfo-title">
                  <span data-lang="Preview">視頻畫面</span>
                </div>
                <div class="preview-content">
                  <div id="localVideo"></div>
                </div>
              </div>
              <div class="preview-playInfo m-t-10 col-lg-12 col-6">
                <div class="pushlishInfo-title">
                  <span data-lang="PlayStream">Play Stream</span>&emsp;StreamID:
                  <span id="playInfo-id">{{ playInfoStreamID }}</span>
                </div>
                <div class="preview-content">
                  <div id="remoteVideo"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-6 action-wrapper">
            <div class="action-step">
              <div class="action-title">
                Step1&emsp;<span class="action-info"
                  >Create ZegoExpressEngine</span
                >
              </div>
              <div class="btn-wrapper">
                <button
                  @click="createZegoExpressEngineOption"
                  type="button"
                  class="btn-outline-info btn cuBtn"
                  title="new ZegoExpressEngine()"
                >
                  <div
                    class="success-svg"
                    id="createSuccessSvg"
                    v-show="createSuccessSvgStatus"
                    style="display: inline-block"
                  >
                    <svg
                      class="ft-green-tick"
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      width="15"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <circle
                        class="circle"
                        fill="#5bb543"
                        cx="24"
                        cy="24"
                        r="22"
                      />
                      <path
                        class="tick"
                        fill="none"
                        stroke="#FFF"
                        stroke-width="6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        d="M14 27l5.917 4.917L34 17"
                      />
                    </svg>
                  </div>
                  Create Engine
                </button>
              </div>
            </div>
            <div class="action-step">
              <div class="action-title">
                Step2&emsp;<span class="action-info">Test Compatiblity</span>
              </div>
              <div class="btn-wrapper">
                <button
                  @click="checkSystemRequire"
                  type="button"
                  :class="[
                    checkSystemRequireStatus == 'ERROR'
                      ? 'btn-outline-danger'
                      : 'btn-outline-info',
                    'btn',
                    'cuBtn',
                  ]"
                  title="checkSystemRequirements()"
                >
                  <div
                    class="success-svg"
                    id="checkSuccessSvg"
                    v-show="checkSystemRequireStatus == 'SUCCESS'"
                    style="display: inline-block"
                  >
                    <svg
                      class="ft-green-tick"
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      width="15"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <circle
                        class="circle"
                        fill="#5bb543"
                        cx="24"
                        cy="24"
                        r="22"
                      />
                      <path
                        class="tick"
                        fill="none"
                        stroke="#FFF"
                        stroke-width="6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        d="M14 27l5.917 4.917L34 17"
                      />
                    </svg>
                  </div>
                  <div
                    class="error-svg"
                    id="checkErrorSvg"
                    v-show="checkSystemRequireStatus == 'ERROR'"
                    style="display: inline-block"
                  >
                    <svg
                      class="ft-green-tick"
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      width="15"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <circle
                        class="circle"
                        fill="#5bb543"
                        cx="24"
                        cy="24"
                        r="22"
                      />
                      <path
                        class="tick"
                        fill="none"
                        stroke="#FFF"
                        stroke-width="6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        d="M14 14 34 34 M34 14 14 34"
                      />
                    </svg>
                  </div>
                  <div class="warn-svg" id="checkWarnSvg" style="display: none">
                    <svg
                      t="1617876217862"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="8340"
                      width="15"
                      height="15"
                    >
                      <circle
                        class="circle"
                        fill="#5bb543"
                        cx="512"
                        cy="512"
                        r="510"
                      />
                      <path
                        class="tick"
                        fill="none"
                        stroke="#FFF"
                        stroke-width="6"
                        stroke-linecap="round"
                        d="M512 736.1m-63 0a63 63 0 1 0 126 0 63 63 0 1 0-126 0Z"
                        p-id="8344"
                      ></path>
                      <path
                        class="tick"
                        fill="none"
                        stroke="#FFF"
                        stroke-width="6"
                        stroke-linecap="round"
                        stroke-miterlimit="10"
                        d="M512 611.8s63-220.5 63-306.3S549.5 204 512 204s-63 15.8-63 101.5 63 306.3 63 306.3z"
                      ></path>
                    </svg>
                  </div>
                  Test Compatiblity
                </button>
              </div>
            </div>
            <div class="action-step">
              <div class="action-title">
                Step3&emsp;<span class="action-info">Login Room</span>
              </div>
              <div class="action-content">
                <div class="action-room font-14">
                  <div class="action-roomId">
                    RoomID
                    <div class="icon-question">
                      ?
                      <div class="pop-box" data-lang="RoomIDDesc">
                        Tooltip text
                      </div>
                    </div>
                    <input
                      type="text"
                      class="w-70"
                      id="RoomID"
                      v-model="roomID"
                      :disabled="isLogin"
                    />
                  </div>
                  <div class="action-userName">
                    UserID
                    <div class="icon-question">
                      ?
                      <div class="pop-box">
                        <span data-lang="UserIDDesc"></span>
                      </div>
                    </div>
                    <input
                      type="text"
                      class="w-70"
                      id="UserID"
                      v-model="userID"
                      :disabled="isLogin"
                    />
                  </div>
                  <div class="action-token">
                    Token
                    <div class="icon-question">
                      ?
                      <div class="pop-box">
                        <span data-lang="TokenDesc"></span>
                        <a
                          href="https://console.zego.im"
                          data-lang="ApplyToken"
                          target="_blank"
                        ></a>
                      </div>
                    </div>
                    <input
                      type="text"
                      class="w-70"
                      id="Token"
                      v-model="token"
                    />
                  </div>
                </div>
                <!-- <button id="LoginRoom" type="button" class="btn-info btn cuBtn">Login Room</button> -->
                <button
                  id="LoginRoom"
                  class="play-pause-button"
                  title="loginRoom()"
                  @click="loginRoomOption"
                >
                  <div
                    class="success-svg m-r-5"
                    id="loginSuccessSvg"
                    v-show="isLogin"
                    style="display: inline-block"
                  >
                    <svg
                      class="ft-green-tick"
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      width="15"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <circle
                        class="circle"
                        fill="#5bb543"
                        cx="24"
                        cy="24"
                        r="22"
                      />
                      <path
                        class="tick"
                        fill="none"
                        stroke="#FFF"
                        stroke-width="6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        d="M14 27l5.917 4.917L34 17"
                      />
                    </svg>
                  </div>
                  Login Room
                </button>
              </div>
            </div>
            <div class="action-step">
              <div class="action-title">
                Step4&emsp;<span class="action-info"
                  >Start Publishing Stream</span
                >
                <div class="action-content">
                  <div class="publish-setting m-t-10">
                    <div class="action-input font-14 m-b-15">
                      Publish StreamID
                      <input
                        type="text"
                        id="PublishID"
                        v-model="streamID"
                        :disabled="publishStreamStatus"
                      />
                    </div>
                    <div class="font-12 publish-check m-b-15">
                      <div class="check-wrappre m-r-5">
                        <label
                          class="form-check-label m-r-5"
                          for="Camera"
                          data-lang="Camera"
                          >Camera</label
                        >
                        <input
                          class="check-input"
                          type="checkbox"
                          v-model="cameraCheckStatus"
                          id="Camera"
                          :disabled="publishStreamStatus"
                        />
                      </div>
                      <div class="check-wrappre">
                        <label
                          class="form-check-label m-r-5"
                          for="Microphone"
                          data-lang="Microphone"
                          >Microphone</label
                        >
                        <input
                          class="check-input"
                          type="checkbox"
                          v-model="microphoneCheckStatus"
                          id="Microphone"
                          :disabled="publishStreamStatus"
                        />
                      </div>
                    </div>
                  </div>
                  <!-- <button id="startPublishing" type="button" class="btn-info btn cuBtn">Start
                    Publishing</button> -->
                  <button
                    id="startPublishing"
                    @click="startPublishing"
                    class="play-pause-button"
                    title="createStream() / startPublishingStream()"
                  >
                    <div
                      class="success-svg m-r-5"
                      id="publishSuccessSvg"
                      v-show="publishStreamStatus"
                      style="display: inline-block"
                    >
                      <svg
                        class="ft-green-tick"
                        xmlns="http://www.w3.org/2000/svg"
                        height="15"
                        width="15"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <circle
                          class="circle"
                          fill="#5bb543"
                          cx="24"
                          cy="24"
                          r="22"
                        />
                        <path
                          class="tick"
                          fill="none"
                          stroke="#FFF"
                          stroke-width="6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          d="M14 27l5.917 4.917L34 17"
                        />
                      </svg>
                    </div>
                    Start Publishing
                  </button>
                  <div class="publish-setting m-t-10 m-b-10">
                    <div class="font-12 select-wrapper">
                      <span data-lang="Mirror">Mirror</span>
                      <select
                        class="form-control form-control-sm m-l-5"
                        id="Mirror"
                        v-model="mirrorVal"
                        :disabled="publishStreamStatus"
                      >
                        <option value="none">none</option>
                        <option value="onlyPreview">onlyPreview</option>
                        <option value="onlyPlay">onlyPlay</option>
                        <option value="both">both</option>
                      </select>
                    </div>
                    <div class="font-12 select-wrapper f-b-7">
                      <span data-lang="CameraSwitch">Camera Switch</span>
                      <select
                        class="form-control form-control-sm m-l-5"
                        id="CameraDevices"
                        v-model="cameraDevicesVal"
                        :disabled="publishStreamStatus"
                      >
                        <option
                          :value="item.deviceID"
                          v-for="item in videoDeviceList"
                        >
                          {{ item.deviceName }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="font-12 select-wrapper">
                    <span data-lang="MicrophoneSwitch">Microphone Switch</span>
                    <select
                      class="form-control form-control-sm m-l-5"
                      id="MicrophoneDevices"
                      :disabled="!microphoneCheckStatus"
                      @change="changeAudioDevices"
                      v-model="microphoneDevicesVal"
                    >
                      <option
                        :value="item.deviceID"
                        v-for="item in audioDeviceList"
                      >
                        {{ item.deviceName }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="action-step">
              <div class="action-title">
                Step5&emsp;<span class="action-info">Start Play Stream</span>
                <div class="action-content">
                  <div class="publish-setting m-t-5">
                    <div class="action-input font-14 m-b-15">
                      Play StreamID
                      <input
                        type="text"
                        id="PlayID"
                        v-model="playStreamID"
                        :disabled="playStreamStatus"
                      />
                    </div>
                    <div class="font-12 publish-check m-b-15">
                      <div class="check-wrappre m-r-5">
                        <label
                          class="form-check-label m-r-5"
                          for="Video"
                          data-lang="Video"
                          >Video</label
                        >
                        <input
                          class="check-input"
                          type="checkbox"
                          id="Video"
                          v-model="videoCheckStatus"
                          :disabled="playStreamStatus"
                        />
                      </div>
                      <div class="check-wrappre">
                        <label
                          class="form-check-label m-r-5"
                          for="Audio"
                          data-lang="Audio"
                          >Audio</label
                        >
                        <input
                          class="check-input"
                          type="checkbox"
                          id="Audio"
                          v-model="audioCheckStatus"
                          :disabled="playStreamStatus"
                        />
                      </div>
                    </div>
                  </div>
                  <!-- <button id="startPlaying" type="button" class="btn-info btn cuBtn">Start Playing</button> -->
                  <button
                    id="startPlaying"
                    class="play-pause-button"
                    @click="startPlaying"
                    title="startPlayingStream()"
                  >
                    <div
                      class="success-svg m-r-5"
                      id="playSuccessSvg"
                      v-show="playStreamStatus"
                      style="display: inline-block"
                    >
                      <svg
                        class="ft-green-tick"
                        xmlns="http://www.w3.org/2000/svg"
                        height="15"
                        width="15"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <circle
                          class="circle"
                          fill="#5bb543"
                          cx="24"
                          cy="24"
                          r="22"
                        />
                        <path
                          class="tick"
                          fill="none"
                          stroke="#FFF"
                          stroke-width="6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          d="M14 27l5.917 4.917L34 17"
                        />
                      </svg>
                    </div>
                    Start Playing
                  </button>
                </div>
              </div>
            </div>
            <div class="action-step">
              <div class="action-content">
                <button
                  id="reset"
                  type="button"
                  @click="reset"
                  class="btn-danger btn cuBtn"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul class="goToDoc">
        <li>
          <span data-lang="HelpDocsVideoCodec">
            Web 端视频编码默认使用 VP8。如果需要体验和其他端互通或者转推 CDN
            功能，请在调试与配置页面修改为 H.264。</span
          >
          &nbsp;
          <a
            href="../../DebugAndConfig/LogAndVersionAndDebug/index.html"
            data-lang="HelpSettingsPage"
            target="_blank"
          >
            点击修改
          </a>
        </li>
        <li>
          <span data-lang="MoreDocs">更多文档，请跳转至即构 </span> &nbsp;
          <a
            href="https://doc-zh.zego.im/article/7638"
            data-lang="HelpDocs"
            target="_blank"
          >
            帮助文档
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ZegoExpressEngine } from "zego-express-engine-webrtc";

export default {
  name: "ZegoVideo",
  data() {
    return {
      appID:651358946,
      appUrl:"wss://webliveroom651358946-api.coolzcloud.com/ws",

      userID: "867",
      roomID: "group_room_657",
      token: 867,
      streamID: "group_657_887",
      playStreamID: "0001",
      
      zg: null,
      localStream: null,
      remoteStream: null,
      isLogin: false,
      videoCodec:
        localStorage.getItem("VideoCodec") === "H.264" ? "H264" : "VP8",
      audioDeviceList: [],
      videoDeviceList: [],
      createSuccessSvgStatus: false,
      checkSystemRequireStatus: "",
      connectStatus: "DISCONNECTED",
      microphoneDevicesVal: null,
      cameraDevicesVal: "",
      cameraCheckStatus: true,
      microphoneCheckStatus: true,
      publishStreamStatus: false,
      videoCheckStatus: true,
      audioCheckStatus: false,
      playStreamStatus: false,
      mirrorVal: "none",
      publishInfoStreamID: "",
      playInfoStreamID: "",
    };
  },
  created() {
  },
  mounted() {
    this.getToken()
  },
  methods: {
    // 获取token
    async getToken() {
      this.token = await this.getTokenFun(this.appID, this.userID)
    },
    // 获取token的方法
    getTokenFun(appID, userID) {
      return new Promise((resolve, reject) => {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = e => {
          if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
              resolve(xmlhttp.response);
            } else {
              reject(e);
            }
          }
        };
        xmlhttp.open(
          "GET",
          `https://wsliveroom-alpha.zego.im:8282/token?app_id=${appID}&id_name=${userID}`,
          true
        );
        xmlhttp.send(null);
      });
    },
    async enumDevices() {
      const deviceInfo = await this.zg.enumDevices();
      this.audioDeviceList =
        deviceInfo &&
        deviceInfo.microphones.map((item, index) => {
          if (!item.deviceName) {
            item.deviceName = "microphone" + index;
          }
          console.log("microphone: " + item.deviceName);
          return item;
        });
      this.audioDeviceList.push({ deviceID: 0, deviceName: "禁止" });
      this.microphoneDevicesVal = this.audioDeviceList[0].deviceID;
      this.videoDeviceList =
        deviceInfo &&
        deviceInfo.cameras.map((item, index) => {
          if (!item.deviceName) {
            item.deviceName = "camera" + index;
          }
          console.log("camera: " + item.deviceName);
          return item;
        });
      this.videoDeviceList.push({ deviceID: 0, deviceName: "禁止" });
      this.cameraDevicesVal = this.videoDeviceList[0].deviceID;
    },
    initEvent() {
      this.zg.on("roomStateUpdate", (roomId, state) => {
        if (state === "CONNECTED") {
          this.connectStatus = "CONNECTED";
        }
        if (state === "DISCONNECTED") {
          this.connectStatus = "DISCONNECTED";
        }
      });

      this.zg.on("publisherStateUpdate", (result) => {
        if (result.state === "PUBLISHING") {
          this.publishInfoStreamID = result.streamID;
        } else if (result.state === "NO_PUBLISH") {
          this.publishInfoStreamID = "";
        }
      });

      this.zg.on("playerStateUpdate", (result) => {
        if (result.state === "PLAYING") {
          this.playInfoStreamID = result.streamID;
        } else if (result.state === "NO_PLAY") {
          this.playInfoStreamID = "";
        }
      });
    },
    // Step1 Create ZegoExpressEngine
    createZegoExpressEngine() {
      this.zg = new ZegoExpressEngine(this.appID, this.appUrl);
      // window.zg = this.zg;
    },
    // Step2 Check system requirements
    async checkSystemRequirements() {
      console.log("sdk version is", this.zg.getVersion());
      try {
        const result = await this.zg.checkSystemRequirements();

        console.warn("checkSystemRequirements ", result);

        if (!result.webRTC) {
          console.error("browser is not support webrtc!!");
          return false;
        } else if (!result.videoCodec.H264 && !result.videoCodec.VP8) {
          console.error("browser is not support H264 and VP8");
          return false;
        } else if (!result.camera && !result.microphone) {
          console.error("camera and microphones not allowed to use");
          return false;
        } else if (result.videoCodec.VP8) {
          if (!result.screenSharing)
            console.warn("browser is not support screenSharing");
        } else {
          console.log("不支持VP8，请前往混流转码测试");
        }
        return true;
      } catch (err) {
        console.error("checkSystemRequirements", err);
        return false;
      }
    },
    // Step3 Login room
    async loginRoom(roomId, userID, token) {
      return await this.zg.loginRoom(
        roomId,
        token,
        { userID,userName:userID },
        { uesrUpdata:true}
      );
    },
    // Step4 Start Publishing Stream
    async startPublishingStream(streamId, config) {
      try {
        this.localStream = await this.zg.createStream(config);
        this.zg.startPublishingStream(streamId, this.localStream, {
          videoCodec: this.videoCodec,
        });
        if (this.zg.getVersion() < "2.17.0") {
          this.$refs["publishVideo"].srcObject = this.localStream;
        } else {
          const localView = this.zg.createLocalStreamView(this.localStream);
          localView.play("localVideo", {
            mirror: true,
            objectFit: "cover",
            enableAutoplayDialog: true,
          });
        }
        return true;
      } catch (err) {
        console.error("error", err);
        return false;
      }
    },
    // Step5 Start Play Stream
    async startPlayingStream(streamId, options = {}) {
      try {
        this.remoteStream = await this.zg.startPlayingStream(streamId, options);
        if (this.zg.getVersion() < "2.17.0") {
          this.$refs["playVideo"].srcObject = this.remoteStream;
        } else {
          const remoteView = this.zg.createRemoteStreamView(this.remoteStream);
          remoteView.play("remoteVideo", {
            objectFit: "cover",
            enableAutoplayDialog: true,
          });
        }
        return true;
      } catch (err) {
        return false;
      }
    },
    // Logout room
    logoutRoom(roomId) {
      this.zg.logoutRoom(roomId);
    },
    // Stop Publishing Stream
    async stopPublishingStream(streamId) {
      this.zg.stopPublishingStream(streamId);
    },
    // Stop Play Stream
    async stopPlayingStream(streamId) {
      this.zg.stopPlayingStream(streamId);
    },
    clearStream() {
      this.localStream && this.zg.destroyStream(this.localStream);
      this.localStream = null;
      this.remoteStream && this.zg.destroyStream(this.remoteStream);
      this.remoteStream = null;
      if (zg.getVersion() < "2.17.0") {
        this.$refs["publishVideo"].srcObject = null;
        this.$refs["playVideo"].srcObject = null;
      }
    },
    changeAudioDevices() {
      if (!this.zg || !this.localStream) {
        return;
      }
      const isMicrophoneMuted = this.zg.isMicrophoneMuted();
      if (!isNaN(this.microphoneDevicesVal) && !isMicrophoneMuted) {
        this.zg.muteMicrophone(true);
      } else {
        this.zg.muteMicrophone(false);
        this.zg.useAudioDevice(this.localStream, this.microphoneDevicesVal);
      }
    },
    // ==============================================================
    // This part of the code binds the button click event
    // ==============================================================
    createZegoExpressEngineOption() {
      if (!this.createSuccessSvgStatu) {
        this.createZegoExpressEngine();
        this.createSuccessSvgStatus = true;
        this.initEvent();
      }
    },
    async checkSystemRequire() {
      if (!this.zg) return alert("you should create zegoExpressEngine");
      const result = await this.checkSystemRequirements();
      if (result) {
        this.checkSystemRequireStatus = "SUCCESS";
        this.enumDevices();
      } else {
        this.checkSystemRequireStatus = "ERROR";
      }
    },
    async loginRoomOption() {
      try {
        this.isLogin = await this.loginRoom(
          this.roomID,
          this.userID,
          this.token,
        );
      } catch (err) {
        this.isLogin = false;
        console.log(err);
      }
    },
    async startPublishing() {
      const flag = await this.startPublishingStream(this.streamID, {
        camera: {
          audioInput: this.microphoneDevicesVal,
          videoInput: this.cameraDevicesVal,
          video: this.cameraCheckStatus,
          audio: this.microphoneCheckStatus,
        },
      });
      if (flag) {
        this.publishStreamStatus = true;
      }
    },
    async startPlaying() {
      const flag = await this.startPlayingStream(this.playStreamID, {
        video: this.videoCheckStatus,
        audio: this.audioCheckStatus,
      });
      if (flag) {
        this.playStreamStatus = true;
      }
    },
    async reset() {
      if (!this.zg) {
        return;
      }
      await this.stopPublishingStream(this.streamID);
      await this.stopPlayingStream(this.playStreamID);
      if (this.isLogin) {
        this.isLogin = false;
        this.logoutRoom(this.roomID);
      }
      this.clearStream();
      this.zg = null;
      window.zg = null;
      this.playStreamStatus = false;
      this.publishStreamStatus = false;
      this.createSuccessSvgStatus = false;
      this.checkSystemRequireStatus = "";
      this.audioCheckStatus = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.pushlishInfo-title {
  font-weight: 500;
}

.preview-content {
  width: auto;
  height: 200px;
  border: 1px solid #ccc;
}

.preview-content>video,
#localVideo,
#remoteVideo {
  width: 100%;
  height: 100%;
}

.preview-roomInfo {
  font-weight: 500;
}

#roomInfo-id {
  display: inline-block;
  font-weight: normal;
}

#roomInfo-state {
  display: inline-block;
  font-weight: normal;
}


.logger-wrapper {
  margin-top: 20px;
  width: 100%;
  height: 250px;
  background-color: #ccc;
  color: rgb(252, 250, 250);
  overflow: scroll;
}

.btn-wrapper {
  display: flex;
  width: 100%;
  background-color: rgb(252, 250, 250);
  border-radius: 10px;
  height: 30px;
  justify-content: center;
  align-items: center;
}

.action-step {
  margin: 10px 0;
}

.action-content {
  width: 100%;
  background-color: rgb(252, 250, 250);
  border-radius: 10px;
  padding: 10px;
}

.action-title {
  font-weight: 700px;
  color: black;
}

.action-info {
  font-size: 14px;
}

.cuBtn {
  display: block;
  padding: 0 12px;
  font-size: 13px;
  cursor: pointer;
  height: 30px;
  width: 95%;
}

.action-room {
  padding-bottom: 15px;
}

.action-room>div+div {
  margin-top: 4px;
}

.icon-question {
  display: inline-block;
  text-align: center;
  line-height: 16px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #0575ff;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
}

/* Tooltip text */
.icon-question .pop-box {
  visibility: hidden;
  width: 120px;
  background-color: #fff;
  box-shadow: 0 0 10px #dfdfdf;
  color: #000;
  text-align: center;
  border-radius: 6px;
  padding: 4px;
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
  font-weight: 100;
  font-size: 12px;
}

/* Show the tooltip text when you mouse over the tooltip container */
.icon-question:hover .pop-box {
  visibility: visible;
}

.f-b-3 {
  flex-basis: 30%;
}

.f-b-7 {
  flex-basis: 70% !important;
}

input {
  width: 40%;
  height: 21px;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  color: #495057;
}

.w-70 {
  width: 70%;
}

.publish-setting {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}

.publish-check {
  flex-basis: 50%;
  display: flex;
  justify-content: space-around;
}

.check-wrappre {
  text-align: center;
  display: flex;
  align-items: center;
}

.check-input {
  display: inline-block;
  width: auto !important;
  height: auto !important;
}

select {
  width: 45% !important;
  height: 21px !important;
  padding: 0 !important;
  font-size: 12px !important;
}

.select-wrapper {
  flex-basis: 30%;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

option {
  height: 21px !important;
  font-size: 14px;
}

.mirror {
  transform: scale(-1, 1);
}

@media (max-width: 375px) {
  .preview-playInfo {
    margin-top: 0 !important;
  }
}
</style>