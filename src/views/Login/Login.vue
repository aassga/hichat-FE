<template>
  <div :class="`login-container-${device}`">
    <el-form ref="loginForm" :model="loginForm" class="login-form" label-position="top">
      <div class="title-container">
        <img src="./../../../static/images/ic_logo.png" alt="" />
        <span class="header-title" v-if="device === 'pc'">登录 嗨聊</span><!--{{ $t('LOGIN.LGOIN_TITLE') }}-->
      </div>
      <el-form-item prop="country" v-if="device === 'pc'">
        <div class="drop" @click="countryShow = !countryShow">
          <div class="dropOption">
            <span class="svg-container">
              <span>区域代码</span>
            </span>
            <el-input ref="country" v-model.trim="countryName" :placeholder="device === 'mobile' ? '手机号码' : ''"
              name="phone" type="text" tabindex="1" maxLength="30" @blur="recover" class="country-box_input">
            </el-input>
          </div>
          <country v-show="countryShow" :countryName="countryName" @changeCountry="changeCountry" />
        </div>
      </el-form-item>
      <el-form-item prop="phone">
        <span class="svg-container" :class="{ brr: device === 'pc' }" @click="showCountryList">
          <span>{{ filterCountry(country) }}
            <i class="el-icon-arrow-down" v-if="device === 'mobile'"></i></span>
        </span>
        <el-input ref="phone" v-model.trim="loginForm.phone" :placeholder="device === 'mobile' ? '手机号码' : ''" name="phone"
          type="text" tabindex="1" maxLength="30" @blur="recover">
        </el-input>
        <country v-if="showCountryModule()" @changeCountry="changeCountry" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container" v-if="device === 'pc'">
          <span>登录密碼</span>
        </span>
        <el-input ref="password" v-model.trim="loginForm.password" :placeholder="device === 'mobile' ? '登录密碼' : ''"
          name="password" :type="passwordType === 'password' ? 'password' : 'text'" :disabled="passwordDisabled"
          tabindex="2" maxLength="12" @input="(v) => (loginForm.password = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
            " @blur="recover">
        </el-input>

        <span class="show-pwd" :class="{ 'eye-off': passwordType === 'password' }" @click="showPwd">
          <img :src="passwordType === 'password'
            ? require('./../../../static/images/pc/eye-off.png')
            : require('./../../../static/images/pc/eye.svg')
            " alt="" />
        </span>
      </el-form-item>
      <div class="remember-style">
        <el-switch v-model="remember" active-color="#fe5f3f" inactive-color="#666666" active-text="记住帐号">
        </el-switch>
        <router-link :to="'/ForgetPassword'" style="text-decoration: none">
          <span>忘记密码</span>
        </router-link>
      </div>
      <div>
        <el-button style="width: 100%; margin-bottom: 30px" :disabled="disabled" :class="{'gray-color':disabled}" @click="submitForm('loginForm')">登录</el-button>
      </div>
      <div>
        <router-link :to="'/Register'">
          <el-button style="
              width: 100%;
              background-color: #67c23a00;
              border: 1px solid #fe5f3f;
              color: #fe5f3f;
            ">注册</el-button>
        </router-link>
      </div>
      <!-- <el-dropdown>
        <span class="el-dropdown-link">
          選擇語言<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item data-lang="tw" @click.native="setLang">中文</el-dropdown-item>
          <el-dropdown-item data-lang="en" @click.native="setLang">English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </el-form>
    <el-dialog :title="device === 'pc' ? '帐号已锁定' : ''" :visible.sync="dialogShow" class="el-dialog-loginOut" width="70%"
      :show-close="false" :close-on-click-modal="false" center>
      <div class="loginOut-box">
        <div v-if="device === 'mobile'">
          <img src="./../../../static/images/warn.png" alt="" />
        </div>
        <div style="margin-bottom: 10px"><span>帐号已锁定。</span></div>
        <div><span>请至请至注册手机号码确认验证码以解锁帐号。</span></div>
      </div>
      <span slot="footer" class="dialog-footer" style="justify-content: center">
        <router-link :to="'/ResetPassword'">
          <el-button :class="device === 'mobile' ? 'background-orange' : 'background-red'
            " @click="dialogShow = false">确认</el-button>
        </router-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { login } from "_api/index.js";
import { Encrypt, Decrypt } from "@/utils/AESUtils.js";
import * as phoneValidator from "@/utils/phoneValidator";
import country from "@/components/country.vue";
import { filterCountry } from "@/utils/countryName";

export default {
  components: { country },
  data() {
    return {
      loginForm: {
        deviceId: "",
        deviceName: "",
        deviceType: 8,
        phone: "",
        password: "",
        country: "CN",
        version: 1,
      },
      passwordType: "password",
      country: {},
      countryName: "",
      remember: true,
      disabled: true,
      dialogShow: false,
      countryShow: false,
      passwordDisabled: false,
      countryCodeShow: false,
      token: localStorage.getItem("token"),
      device: localStorage.getItem("device"),

      //加解密 key iv
      aesKey: "142c7ec1b64ae0c6",
      aesIv: "0000000000000000",
    };
  },
  watch: {
    loginForm: {
      handler(val) {
        if (Object.values(val).every((el) => el) && val.password.toString().length >= 4
        ) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
        if (this.remember) {
          this.$cookie.set("phone", this.loginForm.phone)
          // this.$cookie.set("countryName", this.loginForm.phone)
        } else {
          this.$cookie.set("phone", "");
        }
      },
      deep: true,
    },
    remember(val) {
      if (val) {
        const countryCode = JSON.parse(localStorage.getItem("countryCode"));
        this.$cookie.set("phone", this.loginForm.phone)
        this.$cookie.set("countryCode", JSON.stringify(countryCode))
      } else {
        this.$cookie.set("phone", "");
        this.$cookie.set("countryCode", JSON.stringify({}))
      }
    },
    countryCode() {
      this.loginForm.phone = "";
    },
  },
  created() {
    this.getUUID();
    this.browserType();
    this.countryInitial();
  },

  beforeDestroy() {
    document.removeEventListener("click", this.onClickEvent);
  },
  mounted() {
    if (this.remember) {
      this.loginForm.phone = this.$cookie.get("phone") || "";
      setTimeout(() => {
        
        this.getCookieCountry()
      }, 500);
    }
    document.addEventListener("click", this.onClickEvent);
  },

  methods: {
    showCountryModule() {
      return (this.device === 'mobile' && this.countryCodeShow)
    },
    setCookieCountry() {

    },
    getCookieCountry() {
      const cookieCountryCode = JSON.parse(this.$cookie.get("countryCode")) || {};
      this.countryName = cookieCountryCode.countryName
      this.country = cookieCountryCode;
    },
    countryInitial() {
      const countryCode = JSON.parse(localStorage.getItem("countryCode"));
      if (!countryCode || countryCode.countryCode === "other") {
        const cnCountry = {
          countryCode: "86",
          countryName: "中国",
          regionCode: "CN",
        };
        this.countryName = cnCountry.countryName
        this.country = cnCountry;
        localStorage.setItem("countryCode", JSON.stringify(cnCountry));
      } else {
        this.countryName = countryCode.countryName
        this.country = countryCode;
      }
    },
    recover() {
      let agentValue = navigator.userAgent;
      // userAgent属性是一个只读的字符串，声明了浏览器用于 HTTP 请求的用户代理头的值，用于判断是Android设备还是IOS设备
      let isIOS = !!agentValue.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // 判断是否是ios终端
      if (isIOS) {
        window.scrollTo(0, 0); // 如果是ios终端，则在失焦的时候使页面返回顶部
      }
    },
    filterCountry(list) {
      return filterCountry(list);
    },
    onClickEvent(event) {
      const mobileClick =
        this.device === "mobile" &&
        event.target.className === "country-select__mobile";
      const pcClick = this.device === "pc" &&
        event.target.className === "login-container-pc";
      if (mobileClick) {
        this.countryCodeShow = false;
      } else if (pcClick) {
        this.countryShow = false
      }
    },
    showCountryList() {
      this.countryCodeShow = true;
    },
    changeCountry(item) {
      this.country = item;
      this.countryName = item.countryName
      this.countryCodeShow = false;
    },
    browserType() {
      var userAgent = navigator.userAgent; //取得瀏覽器的userAgent字串
      var isOpera = userAgent.indexOf("Opera") > -1; //判斷是否Opera瀏覽器
      var isIE =
        userAgent.indexOf("compatible") > -1 &&
        userAgent.indexOf("MSIE") > -1 &&
        !isOpera; //判斷是否IE瀏覽器
      var isEdge = userAgent.indexOf("Edge") > -1; //判斷是否IE的Edge瀏覽器
      var isFF = userAgent.indexOf("Firefox") > -1; //判斷是否Firefox瀏覽器
      var isSafari =
        userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判斷是否Safari瀏覽器
      var isChrome =
        userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判斷Chrome瀏覽器
      if (isOpera) {
        this.loginForm.deviceName = "Opera";
      } else if (isIE) {
        this.loginForm.deviceName = "compatible";
      } else if (isEdge) {
        this.loginForm.deviceName = "Edge";
      } else if (isFF) {
        this.loginForm.deviceName = "Firefox";
      } else if (isSafari) {
        this.loginForm.deviceName = "Safari";
      } else if (isChrome) {
        this.loginForm.deviceName = "Chrome";
      }
    },
    setActiveLanguage(lang) {
      localStorage.setItem("language", lang);
    },
    setLang(evt) {
      const lang = evt.target.dataset.lang;
      this.setActiveLanguage(lang);
      return history.go(0);
    },
    showPwd() {
      this.passwordType = this.passwordType === "password" ? "" : "password";
      this.$nextTick(() => this.$refs.password.focus());
    },
    getUUID() {
      let number = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
      localStorage.setItem("UUID", "hiWeb" + number);
      this.loginForm.deviceId = "hiWeb" + number;
    },

    //登录&&註冊
    submitForm(rules) {
      //驗證登录表單是否通過
      this.$refs[rules].validate(() => {
        const validatePhone = this.loginForm.country === "CN" && !phoneValidator.isPhoneNumberValid(this.loginForm.phone, "CN")
        this.country.countryCode !== "other"
          ? (this.loginForm.country = this.country.regionCode)
          : delete this.loginForm.country;

        if (this.disabled && validatePhone) {
          this.$message({
            message: "资料尚未输入完全或帳號密碼格式錯誤",
            type: "error",
          });
          return;
        }

        this.loginForm.phone = this.loginForm.phone.trim();
        (this.loginForm.deviceType = this.device === "pc" ? 8 : 9),
          (this.loginForm.password = Encrypt(
            this.loginForm.password,
            this.aesKey,
            this.aesIv
          ));
        this.passwordDisabled = true;
        login(this.loginForm)
          .then((res) => {
            //登录成功
            if (res.code === 200) {
              localStorage.setItem(
                "token",
                res.data.tokenHead + res.data.token
              );
              localStorage.setItem("id", res.data.memberId);
              this.$router.push({ path: "/Home" });
            } else if (res.code === 10009) {
              //登录失敗
              this.dialogShow = true;
            }
          })
          .catch((err) => {
            this.$message({
              message: "登录验证失败，请重输入并确认",
              type: "error",
            });

            localStorage.clear();
            this.getUUID();
            return false;
          })
          .finally(() => {
            this.passwordDisabled = false;
            this.loginForm.password = Decrypt(
              this.loginForm.password,
              this.aesKey,
              this.aesIv
            );
          });
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg: #eaf5fa;
$cursor: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;

/* reset element-ui css */
.login-container {

  &-pc,
  &-mobile {
    width: 100%;
    height: 100%;
    background-color: $bg;
    overflow: hidden;

    .title-container {
      display: flex;

      img {
        height: 5em;
        margin: 0px auto 40px auto;
        text-align: center;
      }
    }

    .login-form {
      position: relative;
      width: 80vw;
      max-width: 100%;
      padding: 4em 0;
      margin: 0 auto;

      .el-form-item {
        background: #ffffff;
        border-radius: 10px;
        color: #454545;
        margin-bottom: 20px;
      }

      .verification-style {
        width: 6em;
        height: 2.1em;
        line-height: 2.1em;
        font-size: 12px;
        position: absolute;
        top: 1em;
        right: 1em;
        text-align: center;
        border: 1px solid #fe5f3f;
        color: #fe5f3f;
        border-radius: 5px;
      }

      .show-pwd {
        height: 2.1em;
        line-height: 2.1em;
        position: absolute;
        top: 1em;
        right: 1em;

        img {
          height: 1.2em;
        }
      }

      .eye-off {
        img {
          height: 1.5em;
        }
      }

      .remember-style {
        margin: 1em 0 2em 0;
        display: flex;
        justify-content: space-between;

        ::v-deep.is-checked {
          .is-active {
            color: rgba(0, 0, 0, 0.8);
          }
        }

        span {
          font-size: 14px;
          color: #fe5f3f;
        }
      }

      .read-check-box {
        margin-bottom: 3em;

        ::v-deep.el-checkbox__input.is-checked+.el-checkbox__label {
          color: rgba(0, 0, 0, 0.8);
        }

        ::v-deep.el-checkbox {
          .el-checkbox__input {
            .el-checkbox__inner {
              width: 20px;
              height: 20px;
              border-radius: 50%;

              &:after {
                border: 2px solid #ffffff;
                border-left: 0;
                border-top: 0;
                height: 13px;
                left: 7px;
              }
            }
          }
        }

        .el-checkbox__label {
          a {
            color: #10686e;
            text-decoration: none;
          }
        }
      }

      .el-button {
        background-color: #fe5f3f;
        color: #fff;
        padding: 16px 20px;
      }
    }

    .svg-container {
      padding: 6px 0 6px 15px;
      color: $dark_gray;
      font-size: 14px;
      width: 60px;
      vertical-align: inherit;
      color: #454545;
      display: inline-block;

      img {
        height: 17px;
      }
    }

    ::v-deep.el-dialog-loginOut {
      overflow: auto;

      .el-dialog {
        position: relative;
        margin: 0 auto 50px;
        background: #ffffff;
        border-radius: 10px;
        box-sizing: border-box;
        width: 50%;

        .el-dialog__header {
          padding: 10px;
        }

        .el-dialog__body {
          text-align: center;
          padding: 25px 25px 15px;

          .loginOut-box {
            img {
              height: 5em;
              margin-bottom: 1.2em;
            }
          }
        }

        .el-dialog__footer {
          padding: 20px;
          padding-top: 10px;
          text-align: right;
          box-sizing: border-box;

          .dialog-footer {
            display: flex;
            justify-content: space-between;

            a {
              width: 100vw;
            }

            .el-button {
              width: 100%;
              border-radius: 8px;
            }

            .background-red {
              background-color: #ee5253;
              color: #fff;
            }

            .background-orange {
              background-color: #fe5f3f;
              color: #fff;
            }

            .border-red {
              border: 1px solid #fe5f3f;
              color: #fe5f3f;
            }
          }
        }
      }
    }

    .el-input {
      display: inline-block;
      height: 47px;
      width: 60%;

      input {
        width: 260px;
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 10px;
        color: #666666;
        height: 47px;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $cursor inset !important;
        }
      }
    }
  }

  &-pc {
    display: flex;
    align-items: center;

    .login-form {
      width: 370px;

      .show-pwd {
        cursor: pointer;

        img {
          height: 1.5em;
        }
      }

      .remember-style {
        margin: 1em 0 2em 0;
        display: flex;
        justify-content: space-between;

        ::v-deep.is-checked {
          .is-active {
            color: rgba(0, 0, 0, 0.8);
          }
        }

        span {
          font-size: 14px;
          color: #fe5f3f;
        }
      }

      .read-check-box {
        margin-bottom: 3em;
      }
    }

    .title-container {
      display: flex;
      flex-direction: column;
      margin: 0 auto 40px auto;

      img {
        margin: 0px auto;
      }

      .header-title {
        margin: 1em auto 0 auto;
        font-size: 1.2em;
        color: #474747;
      }
    }

    .svg-container {
      font-size: 14px;
      width: 60px;
      vertical-align: inherit;
      color: #454545;
    }

    ::v-deep.el-dialog-loginOut {
      .el-dialog {
        .el-dialog__footer {
          padding: 0 !important;
        }
      }
    }
  }
}

.el-select {
  width: 115px;
}

.container {
  padding: 1rem;
}
.gray-color{
  background-color: #b3b3b3 !important;
  color: #fff !important;
}
</style>

