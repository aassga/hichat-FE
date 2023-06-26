<template>
  <div class="home-wrapper">
    <el-container v-if="device === 'mobile'">
      <el-main>
        <div class="home-header">
          <div class="home-user" @click="back"></div>
          <span class="home-header-title">提醒</span>
          <div class="home-add-user"></div>
        </div>
        <div class="home-content">
          <div class="setting-title">應用內提醒</div>
          <div
            class="setting-button"
            v-for="(item, index) in soundNotifyData"
            :key="item + index"
            :class="{
              mb10: item.key === 'sound'
            }"
          >
            <div class="setting-box">
              <!-- <div class="setting-button-left">
                <span>{{ item.name }}</span>
              </div> -->
              <div class="setting-button-left">
                <el-switch
                  v-model="item.isNofity"
                  :inactive-text="item.name"
                  active-color="#fd5f3f"
                  inactive-color="#666666"
                  @change="changeSoundNotify(item)"
                >
                </el-switch>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="370px">
        <el-header height="70px">
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back"></div>
            <span class="home-header-title">提醒</span>
          </div>
        </el-header>
        <div class="home-content">
          <!-- 靜音 -->
          <div class="setting-title">靜音</div>
          <router-link :to="'/MuteSound'">
            <div class="setting-button">
              <div class="setting-box">
                <div class="setting-button-left">
                  <span>編輯名單</span>
                </div>
                <div class="setting-button-right">
                  <img src="./../../../static/images/next.png" alt="" />
                </div>
              </div>
            </div>      
          </router-link>
          <!-- 提醒 -->
          <div class="setting-title">應用內提醒</div>
          <div
            class="setting-button"
            v-for="(item, index) in soundNotifyData"
            :key="item + index"
          >
            <div class="setting-box">
              <!-- <div class="setting-button-left">
                <span>{{ item.name }}</span>
              </div> -->
              <div class="setting-button-left">
                <el-switch
                  v-model="item.isNofity"
                  :inactive-text="item.name"
                  active-color="#fd5f3f"
                  inactive-color="#666666"
                  @change="changeSoundNotify(item)"
                >
                </el-switch>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Notify",
  data() {
    return {
      device: localStorage.getItem("device"),
      // nofityData: JSON.parse(localStorage.getItem("nofity")),
      soundNotifyData: JSON.parse(localStorage.getItem("soundNotify")),
    };
  },
  // computed: {
  //   ...mapState({
  //     nofity: (state) => state.ws.nofity,
  //     soundNotify: (state) => state.ws.soundNotify,
  //   }),
  // },
  created() {
    // if(!localStorage.getItem("nofity")){
    //   this.setNotify(this.nofity)
    // }
    // if(!localStorage.getItem("soundNotify")){
    //   this.setSoundNotify(this.soundNotify)
    // }
  },
  methods: {
    ...mapMutations({
      setNotify:"ws/setNotify",
      setSoundNotify: "ws/setSoundNotify",
    }),
    // changeNotify(item){
    //   this.nofityData.forEach((data) => {
    //     if (item.key === "nofity") {
    //       if (!item.isNofity) {
    //         return (data.isNofity = false);
    //       } else if (item.isNofity) {
    //         return (data.isNofity = true);
    //       }
    //     } else if (item.key === data.key) {
    //       if (!item.isNofity) {
    //         return (data.isNofity = false);
    //       } else if (item.isNofity) {
    //         return (data.isNofity = true);
    //       }
    //     }
    //   })
    //   let newNotify = this.nofityData.filter(el => el.key !== "nofity")
    //   let doubleCloseNotify = newNotify.every(item => !item.isNofity);
    //   let doubleOpenNotify = newNotify.every(item => item.isNofity);
    //   if(doubleCloseNotify){
    //     this.nofityData.forEach((el)=> el.isNofity = false)
    //   } 
    //   if(doubleOpenNotify){
    //     this.nofityData.forEach((el)=> el.isNofity = true)
    //   }
    //   this.setNotify(this.nofityData);
    // },
    changeSoundNotify(item) {
      this.soundNotifyData.forEach((data) => {
        if (item.key === "sound") {
          if (!item.isNofity) {
            return (data.isNofity = false);
          } else if (item.isNofity) {
            return (data.isNofity = true);
          }
        } else if (item.key === data.key) {
          if (!item.isNofity) {
            return (data.isNofity = false);
          } else if (item.isNofity) {
            return (data.isNofity = true);
          }
        }
      });
      // let newSoundNotify = this.soundNotifyData.filter(el => el.key !== "sound")
      // let doubleCloseSoundNotify = newSoundNotify.every(item => !item.isNofity);
      // let doubleOpenSoundNotify = newSoundNotify.every(item => item.isNofity);
      // if(doubleCloseSoundNotify){
      //   this.soundNotifyData.forEach((el)=> el.isNofity = false)
      // } 
      // if(doubleOpenSoundNotify){
      //   this.soundNotifyData.forEach((el)=> el.isNofity = true)
      // }
      this.setSoundNotify(this.soundNotifyData);
    },
    back() {
      this.$router.back(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.hichat-pc {
  .home-user-pc {
    background-color: #fff;
    background-image: url("./../../../static/images/pc/arrow-left.png");
    cursor: pointer;
  }
}

.hichat-mobile {
  .home-wrapper {
    .el-container {
      .el-main {
        .home-content {
          .setting-title {
            padding: 12px 0 16px 18px;
            text-decoration: none;
          }
          .setting-button {
            .setting-button-left {
              span {
                margin-left: 0;
              }
              .el-switch{
                width: 100%;
                display: flex;
                justify-content: space-between;
                margin-left:1em;
                font-size: 15px;
                cursor: pointer;
              }
              ::v-deep.el-switch__label.is-active{
                color: #333333;
              }
            }
          }
        }
      }
    }
  }
}
.home-wrapper {
  .home-header {
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
  }
  .home-content {
    
    a{
      text-decoration: none;
    }
    .setting-title {
      padding: 30px 0 5px 33px;
      color: rgba(0, 0, 0, 0.4);
      font-size: 15px;
      
    }
    .setting-button {
      padding: 0.5em 0 0.5em 0.5em;
      background-color: #fff;
      &::after {
        content: "";
        display: block;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        width: 100%;
        margin-left: 10px;
        position: relative;
        top: 9px;
      }
      .setting-box {
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
        width: 20em;
        span {
          margin-left: 1em;
          font-size: 15px;
          color: #333333;
        }
        .el-switch{
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-left:1em;
          font-size: 15px;
          cursor: pointer;
        }
        ::v-deep.el-switch__label.is-active{
          color: #333333;
        }
      }
      .setting-button-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 10em;
        span {
          margin-right: 1em;
          font-size: 15px;
          color: #b3b3b3;
        }
      }
    }
  }
}
.mb10 {
  margin-bottom: 1em;
}
</style>