import Vue from "vue";
const baseWsUrl = process.env.NODE_ENV === 'test' ? 'test.hailiao.net':location.host
// const wsUrl = `wss://${baseWsUrl}/ws/im/echo`;//動態環境
// const wsUrl = `wss://www.hailiao.info/ws/im/echo`;//OL動態環境
// const wsUrl = `wss://pre.hailiao.app/ws/im/echo`;//PRE動態環境
const wsUrl = `ws://test.hailiao.net/ws/im/echo`;//Test動態環境
var socket = new WebSocket(wsUrl);
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
      if (socket.readyState === 1) socket.send(JSON.stringify(message));
    },
    onClose() {
      this.chatDataKey.chatType = "CLI_LEAVE_ROOM";
      this.chatDataKey.id = Math.random();
      socket.send(JSON.stringify(this.chatDataKey));
      socket.close();
    },

    // 初始化 websocket 
    connect() {
      socket = new WebSocket(wsUrl);
      socket.onmessage = function (msg) {
        let messageData = JSON.parse(msg.data)
        let chatType = messageData.chatType
        switch (chatType) {
          // 连线成功
          case "SRV_NEED_AUTH":
            socket.send(JSON.stringify(this.chatDataKey));
            break;
          // 连线失敗
          case "SRV_ERROR_MSG":
            if(messageData.text === "50002"){
              this.chatDataKey.chatType = "CLI_AUTH";
              this.chatDataKey.id = Math.random();
              socket.send(JSON.stringify(this.chatDataKey));
            } 
            break;
        }
        emitter.$emit("message", msg.data);
      };
      socket.onerror = function (err) {
        emitter.$emit("error", err);
      };
      socket.onclose = function (e) {
        setTimeout(() => emitter.connect(), 5000);
      };
    },
  }
});
emitter.connect();
export default emitter;