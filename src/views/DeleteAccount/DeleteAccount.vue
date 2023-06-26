<template>
  <div class="home-wrapper">
    <el-container v-if="device === 'mobile'">
      <el-main>
        <el-header height="70px">
          <div class="home-header">
            <div class="home-user" @click="back"></div>
            <span class="home-header-title">删除帐号</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <captionText @disabled="disabled" @password="pass" />
        <div class="home-footer-btn">
          <el-button :disabled="disabledButton" :class="{ 'red-btn': !disabledButton }"
            @click="deleteShow = true">删除帐号</el-button>
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="370px">
        <el-header height="70px">
          <div class="home-header">
            <div style="display: flex; align-items: center; cursor: pointer">
              <router-link :to="'/Setting'">
                <div class="home-user-pc"></div>
              </router-link>
              <span class="home-header-title">删除帐号</span>
            </div>
          </div>
        </el-header>
        <captionText @disabled="disabled" @password="pass" />
        <div class="home-footer-btn">
          <el-button :disabled="disabledButton" :class="{ 'red-btn': !disabledButton }"
            @click="deleteShow = true">删除帐号</el-button>
        </div>
      </el-aside>
    </el-container>
    <el-dialog :visible.sync="deleteShow" class="el-dialog-delete" :width="device === 'pc' ? '70%' : '90%'"
      :show-close="false" :close-on-click-modal="false" center>
      <div class="delete-box">
        <img src="./../../../static/images/warn.png" alt="" />
        <div class="delete-title">确认删除您的帐号吗？</div>
        <div class="delete-content">执行后无法回溯此操作。</div>
        <div class="delete-content">帐号删除后可重新使用此号码注册，但其
          数据资料无法回复。</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="deleteShow = false">取消</el-button>
        <el-button class="background-red" @click="submit()">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { deleteUser } from "_api/index.js";
import captionText from "./components/caption.vue";
import { initGlobalState } from "@/store/ws.js";
import { Encrypt } from "@/utils/AESUtils.js";

export default {
  name: "DeleteAccount",
  components: {
    captionText,
  },
  data() {
    return {
      password: "",
      disabledButton: true,
      deleteShow: false,
      device: localStorage.getItem("device"),
      //加解密 key iv
      aesKey: "142c7ec1b64ae0c6",
      aesIv: "0000000000000000",
    };
  },
  created() {
  },
  methods: {
    disabled(Boolean) {
      this.disabledButton = Boolean
    },
    pass(password) {
      this.password = password
    },
    submit() {
      let params = {
        password: Encrypt(
          this.password,
          this.aesKey,
          this.aesIv),
        version: 1
      }
      deleteUser(params).then((res) => {
        if(res.code === 200){
          this.$router.push({ path: "/DeleteSuccess" });
        } 
        initGlobalState()
        Socket.close(); // for [PC] Electron App

      })
    },
    back() {
      this.$router.back(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .home-header {
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
  }
}

.hichat-pc {
  .home-header {
    .home-user-pc {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/arrow-left.png");
    }

    .home-header-title {
      margin-left: 5px;
    }
  }
}

.is-disabled {
  background-color: #00000066;
  color: #ffffff;

  &:hover {
    background-color: #00000066;
    color: #ffffff;
  }
}

.el-dialog-delete {
  ::v-deep.el-dialog {
    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      border: 0;

      .delete-title {
        margin: 15px 0;
        font-size: 18px;
        font-weight: 600;
      }

      .delete-content {
        line-height: 25px;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .el-dialog__footer {
      .dialog-footer {
        .el-button {
          border-radius: 8px !important;

          &:nth-child(1) {
            border-radius: 8px !important;
          }

          &:nth-child(2) {
            border-radius: 8px !important;
            margin-left: 10px !important;
          }

        }

        .background-red {
          background-color: #ee5253 !important;
          color: #fff !important;
        }
      }
    }
  }

}
</style>
