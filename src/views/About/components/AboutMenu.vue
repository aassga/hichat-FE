<template>
  <div class="home-content">
    <div
      class="setting-button"
      v-for="(item, index) in aboutData"
      :key="index"
      :class="{ 'mt10 border-bottom': item.name === '服务条款' }"
    >
      <a @click="checkDialog(item,item.type)">
        <div class="setting-button-left">
          <img :src="item.icon" alt="" />
          <span>{{ item.name }}</span>
        </div>
        <div
          class="setting-button-right version"
          v-if="item.name === '使用版本'"
        >
          <span>{{ item.version }}</span>
        </div>
        <div class="setting-button-right" v-else>
          <img src="./../../../../static/images/next.png" alt="" />
        </div>
      </a>
    </div>
    <el-dialog
      :title="dialogTitle"
      :class="{'el-dialog-iframe':device === 'pc'}"
      center
      append-to-body

      :visible.sync="dialogVisible"
      width="100%">
      
      <iframe :src="dialogUrl" frameborder="0" v-if="device === 'pc'"></iframe>
      <template v-else>
        <agreementH5 v-if="dialogType === 'userAgreement'"/>
        <privacyH5 v-if="dialogType === 'privacyPolicy'"/>
      </template>
      
    </el-dialog>
  </div>
</template>

<script>
import { getAndroidVersion } from '@/api/version'
import agreementH5 from "./agreementH5.vue";
import privacyH5 from "./privacyH5.vue";

export default {
  name: "AboutMenu",
  components:{
    agreementH5,
    privacyH5
  },
  data() {
    return {
      aboutData: [
        {
          name: "使用版本",
          path: "",
          version: "",
        },
        {
          name: "服务条款",
          path: "",
          type: "userAgreement",
          url:"/#/userAgreementIOS",
        },
        {
          name: "隐私权政策",
          path: "",
          type: "privacyPolicy",
          url:"/#/privacyPolicyIOS",
        },
      ],
      dialogVisible:false,
      dialogTitle:"",
      dialogUrl:"",
      device: localStorage.getItem("device"),
      dialogType:"",
    };
  },
  created() {
    this.androidVersion()
  },

  methods: {
    androidVersion(){
      getAndroidVersion().then((res)=>{
        this.aboutData[0].version = res.data.version
      })
    },
    checkDialog(item,type){
      console.log(item,type)
      const locationOrigin = location.host === "test.hailiao.net" || location.hostname === "localhost" ? location.origin + '/pub/' : location.origin
      switch (type) {
        case "userAgreement":
          this.dialogType = 'userAgreement'
          this.dialogVisible = true
          this.dialogTitle = item.name
          this.dialogUrl = locationOrigin + item.url
          break
        case "privacyPolicy":
          this.dialogType = 'privacyPolicy'
          this.dialogVisible = true
          this.dialogTitle = item.name
          this.dialogUrl = locationOrigin + item.url
          break;
      }
    },
    back() {
      this.$router.back(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
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
        cursor: pointer;
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
::v-deep.el-dialog-iframe{
    .el-dialog{
      width: 50% !important;
      iframe{
        width: 100%;
        height: 620px;
      }
    }
  }
</style>
