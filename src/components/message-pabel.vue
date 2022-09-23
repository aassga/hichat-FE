<template>
  <div class="message-pabel-box" @touchmove="$root.handleTouch">
    <ul class="message-styles-box">
      <li
        v-for="(item, index) in message"
        :key="index"
        class="message-layout-left"
      >
        <span class="message-nickname"
          v-if="item.username !== 'guest'"
          ><span :class="item.typeStyle"
            >{{ item.nickname }}：</span
          >
         
        </span>
        <span class="message-classic">
           <span :style="item.chatType === 'SRV_JOIN_ROOM' ? 'color: #f00' :'color: #afafaf;'">{{ item.message.content }}</span>
        </span>
        
      </li>
    </ul>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { gotoBottom } from "@/assets/tools";
export default {
  name: "MessagePabel",
  props: {
 
  },
  data() {
    return {
      message:[]
    };
  },

  mounted() {
    
  },
  methods: {
   
  },
};
</script>

<style lang="scss" >
.message-pabel-box {
  padding: 0 20px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: rgba(255, 255, 255, 0.8);

  .message-styles-box {
    margin-bottom: 20px;
    .message-layout-left {
      margin-top: 20px;
      width: 100%;
      display: flex;
      // .message-classic::before {
      //   content: "";
      //   position: absolute;
      //   border-width: 8px;
      //   border-style: solid;
      // }
    }

    .message-layout-left {
      .message-classic {
        // background-color: rgb(243, 249, 255);
        line-height: 1.4rem;
        font-weight: 500;
        letter-spacing: 0.5px;
        // &::before {
        //   left: -16px;
        //   border-color: transparent rgb(243, 249, 255) transparent transparent;
        // }
      }
    }
    .message-nickname {
      color: #777777;
      font-size: 15px;
      line-height: 1.4rem;
      span {
        color: #0079fe;
      }
    }
    .userIdStyle {
      color: rgb(255, 0, 0) !important;
    }
    .message-classic {
      position: relative;
      max-width: 95%;
      display: inline-block;
      font-size: 14px;
      color: #333333;
      border-radius: 5px;
      white-space: pre-line;
      word-break: break-all;
      .red {
        height: 1.5em;
      }
    }
  }
}
.message-pabel-box .eye-more {
  width: 100%;
  padding: 25px 0 15px 0;
  font-size: 15px;
  text-align: center;
}
.bottom-btn{
  position: absolute;
  bottom: 170px;
  right: 25px;
  text-align: right;
}
</style>
