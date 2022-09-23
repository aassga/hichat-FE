<template>
  <div class="wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <span class="title">聊天室</span>
        </el-header>
        
        <message-pabel />
        <message-input />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { login } from "_api/index.js";
import { mapState, mapMutations } from "vuex";
import MessagePabel from "@/components/message-pabel";
import MessageInput from "@/components/message-input";
export default {
  name: "Chat",
  data() {
    return {
      // 登入資訊
      loginForm: {
        code:"",
        device_type:"",
        mobile:"86-15011234567",
        password:"Test12"
      },
    };
  },
  created() { 
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ){
      this.loginForm.device_type = "mobile";
    }else{
      this.loginForm.device_type = "pc";
    }
  },
  mounted() {
    this.userLogin()
    // Socket.$on("message", this.handleGetMessage);
    window.addEventListener("beforeunload", this.closeWebsocket); 
  },
  beforeDestroy() {
    // Socket.$off("message", this.handleGetMessage);
    // this.closeWebsocket();
  },
  destroyed() {
    // window.removeEventListener("beforeunload", this.closeWebsocket);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
    }),
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
    }),
    userLogin(){
      let params = this.loginForm
      login(params).then((res) => {
        if (res.code === 0) {
          console.log(res.data)
          document.cookie = `token=${res.data.token}`;
          // Socket.connect()
        }
      })
      
    },    
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        case "":
          break
      }
    },
    // 关闭socket
    closeWebsocket() {
      Socket.onClose();
      window.location.reload();
    },
  },
  components: {
    MessagePabel,
    MessageInput,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  .el-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 99%;
    max-width: 336px;
    margin: 10px auto;
    .el-aside,
    .el-main {
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      /deep/.el-row {
        float: right;
        .el-button {
          background-image: linear-gradient(#579fff, #3481e8);
          color: #ffffff;
        }
        .el-checkbox__inner {
          border-radius: 0;
          border: 1px solid #dcdfe6;
          &::after {
            border: 1px solid #4fba00;
            border-left: 0;
            border-top: 0;
          }
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #ffffff;
        }
        .el-checkbox__label {
          color: #fff;
        }
      }
    }
    .el-aside {
      border-radius: 6px 0px 6px 6px;
    }
    .el-aside {
      background: rgba(235, 233, 232, 0.8);
    }
    .el-main {
      padding: 0;
    }
    .el-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 55px;
      // background-image: linear-gradient(#579fff, #3481e8);
      overflow: hidden;
      border-bottom: 1px solid #dddddd;
      img {
        position: relative;
        top: 7px;
      }
      .title {
        display: inline-block;
        font-size: 18px;
        letter-spacing: 1px;
        color: #FF0000;
      }
    }
  }
  .footer {
    position: absolute;
    bottom: -23px;
    right: 0;
    left: 0;
    margin: auto;
    font-size: 13px;
    width: 150px;
    color: #ffffff;
    text-align: center;
    a {
      color: #ffffff;
      &:hover {
        color: #377ec8;
      }
    }
  }
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey; 

  // border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background-image: linear-gradient(180deg,rgb(138, 138, 138), rgb(138, 138, 138));
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-image: linear-gradient(180deg,rgb(138, 138, 138), rgb(138, 138, 138));

}
</style>
