<template>
  <div class="home-wrapper">
    <template v-if="device === 'mobile'">
      <el-container>
        <el-main>
          <el-header height="70px">
            <div class="home-header">
              <div class="home-user"></div>
              <span class="home-header-title">删除帐号</span>
              <div class="home-add-user"></div>
            </div>
          </el-header>
          <div class="success-box">
            <img src="./../../../static/images/success.png" alt="" />
            <div class="success-title">您的帐号已删除</div>
          </div>

          <div class="home-footer-btn">
            <el-button class="background-org" @click="back()">返回登录页</el-button>
          </div>
        </el-main>
      </el-container>
    </template>
    <template v-else>
      <el-dialog :visible.sync="successShow" class="el-dialog-success" width="70%" :show-close="false"
        :close-on-click-modal="false" center>
        <div class="success-box">
          <img src="./../../../static/images/success.png" alt="" />
          <div class="success-title">您的帐号已删除</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="background-org" @click="back()">返回登录页</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>

export default {
  name: "DeleteSuccess",

  data() {
    return {
      successShow: true,
      device: localStorage.getItem("device"),

    };
  },
  methods: {
    back() {
      const device = localStorage.getItem('device');
      if(this.$cookie.get("phone")){
        this.$cookie.set("phone", "");
        this.$cookie.set("countryCode", {});
      }
      localStorage.clear();
      //remain device
      localStorage.setItem('device', device);
      window.location.reload(); // 于 Electron 应用时,会被停用
      this.$router.push('/login')
    }
  },
};
</script>

<style lang="scss" scoped>
.hichat-mobile {
  .success-box {
    margin: 45px auto 0 auto; 
    text-align:center;
    img {
      height: 70px;
    }

    .success-title {
      margin: 15px 0;
    }
  }

  .home-footer-btn {
    width: 100%;
    position: absolute;
    bottom: 0;

    .background-org {
      background: #FF6900;
      color: #FFFFFF;
    }
  }
}

.el-dialog-success {
  ::v-deep.el-dialog {
    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      border: 0;
      padding: 45px 25px 0 25px !important;

      .success-box {
        img {
          height: 70px;
        }

        .success-title {
          margin: 15px 0;
        }
      }
    }

    .el-dialog__footer {
      .dialog-footer {
        justify-content: center;

        .el-button {
          &:nth-child(1) {
            border-radius: 10px !important;

          }
        }

        .background-org {
          background: #FF6900;
          color: #FFFFFF;
        }
      }
    }
  }

}</style>
