import Vue from "vue";
let baseURL={
  ol:`wss://${location.host}/ws/im/echo`,//OL動態環境
  pre:"wss://pre.hailiao.app/ws/im/echo",//PRE動態環境
  test:"ws://test.hailiao.net/ws/im/echo",//Test動態環境
}
// const wsUrl = baseURL[process.env.NODE_ENV]//動態環境
var locationProtocol = location.protocol === "http:" || process.env.NODE_ENV === "test" ? "ws" : "wss"
var locationHost = location.host
if(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"){
  locationHost = "test.hailiao.net"
}
const wsUrl = `${locationProtocol}://${locationHost}/ws/im/echo`//動態環境

var socket = null;
var isManualClose = false; // 手动关闭 WS 连线
var retryCount = 0; // 记录 retry 次数
var heartbeatCount = 0;
var heartBeatTimerId = null;
const emitter = new Vue({
  data() {
    return {
      chatDataKey: {
        chatType:"CLI_AUTH",
        id:Math.random(),
        deviceId: localStorage.getItem('UUID'),
        token: localStorage.getItem('token'),
        tokenType: 0,
      },
    }
  },
  methods: {
    send(message) {
      if (!!socket && socket.readyState === 1) socket.send(JSON.stringify(message));
    },
    close() {
      // eslint-disable-next-line no-console
      console.log('[ws]manual close websocket');
      let leaveChatKey = this.chatDataKey;
      leaveChatKey.chatType = "CLI_LEAVE_ROOM";
      leaveChatKey.id = Math.random();
      socket.send(JSON.stringify(leaveChatKey));
      clearInterval(heartBeatTimerId);
      socket.close();
      isManualClose = true;
    },
    isStartConnect() {
      // 若已开始重连流程或 ws 已存在
      if (retryCount > 0) {
        return true;
      }

      return !!socket;
    },
    setupInitState() {
      this.chatDataKey = {
        chatType:"CLI_AUTH",
        id:Math.random(),
        deviceId: localStorage.getItem('UUID'),
        token: localStorage.getItem('token'),
        tokenType: 0,
      };
      return this.chatDataKey;
    },
    resetIsManualClose() {
      isManualClose = false;
    },
    // 初始化 websocket 
    connect() {
      let joinChatKey = this.setupInitState()
      socket = new WebSocket(wsUrl);
      socket.onopen = function () {
        retryCount = 0;
      }
      socket.onmessage = function (msg) {
        let messageData = JSON.parse(msg.data)
        let chatType = messageData.chatType
        switch (chatType) {
          // 连线成功
          case "SRV_NEED_AUTH":
            socket.send(JSON.stringify(joinChatKey));
            heartBeatTimerId = setInterval(() => {
              socket.send(JSON.stringify({chatType:"CLI_HEARTBEAT"}));
              heartbeatCount++;
              // 若3秒内 server 端没返回心跳回应就重新连线
              setTimeout(function() {
                if (heartbeatCount > 0) {
                  clearInterval(heartBeatTimerId);
                  socket.close();
                  heartbeatCount = 0;
                }
              }, 3000);
            }, 120000);
            break;
          // server heartbeat response
          case "SRV_HEARTBEAT":
            heartbeatCount--;
            break;
          default:
            break;
        }
        emitter.$emit("message", msg.data);
      };
      socket.onerror = function (err) {
        emitter.$emit("error", err);
        // eslint-disable-next-line no-console
        console.log('[ws]error occurred', err);
      };
      socket.onclose = function (e) {
        socket = null;
        if (isManualClose) return

        retryCount++;
        // eslint-disable-next-line no-console
        console.log('[ws]re-try connect', retryCount);
        setTimeout(() => emitter.connect(), 5000);
      };
    },
  }
});
//emitter.connect();
export default emitter;