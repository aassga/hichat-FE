<template>
  <div :class="`register-container-${device}`">
    <div class="register-header">
      <template v-if="device === 'mobile'">
        <router-link :to="'/Login'">
          <div class="register-back"></div>
        </router-link>
        <span class="register-header-title">忘记密码</span>
      </template>
      <div class="title-container" v-else>
        <img src="./../../../static/images/material_ic_logo.png" alt="" />
        <span class="register-header-title">忘记密码</span>
      </div>
    </div>
    <div class="register-content">
      <el-form ref="loginForm" :model="loginForm" class="login-form" label-position="top">
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
            <country v-show="countryShow" page="forgetPassword" :countryName="countryName"
              @changeCountry="changeCountry" />
          </div>
        </el-form-item>
        <el-form-item prop="phoneNo">
          <span class="svg-container" :class="{ brr: device === 'pc' }" @click="showCountryList()">
            <span>{{ filterCountry(country) }}
              <i class="el-icon-arrow-down" v-if="device === 'mobile'"></i></span>
          </span>
          <el-input ref="phone" v-model.trim="loginForm.phoneNo" :placeholder="device === 'mobile' ? '手机号码' : ''"
            name="phone" type="text" tabindex="1" maxLength="30" @blur="recover">
          </el-input>
          <country v-if="showCountryModule()" page="forgetPassword" @changeCountry="changeCountry" />
        </el-form-item>
        <el-form-item prop="authCode">
          <span class="svg-container">验证码</span>
          <el-input ref="authCode" v-model="loginForm.authCode" placeholder="验证码" name="authCode" type="authCode"
            tabindex="2" maxLength="6" @input="(v) => (loginForm.authCode = v.replace(/[^\d]/g, ''))" @blur="recover">
          </el-input>
          <el-button class="verification-style" :style="disabledTime ? 'border: 1px solid #b3b3b3;color: #b3b3b3;' : ''
            " plain :disabled="disabledTime" @click="getAuthCodeData(loginForm.phoneNo, false)">获取驗證碼 <span
              v-if="timer">({{ count }})</span>
          </el-button>
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">登录密码</span>
          <el-input ref="password" v-model.trim="loginForm.newPassword" placeholder="登录密码" name="password"
            :type="passwordType === 'password' ? 'password' : 'text'" tabindex="2" maxLength="12" @input="(v) =>
                (loginForm.newPassword = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
              " @blur="recover">
          </el-input>
          <span class="show-pwd" :class="{ 'eye-off': passwordType === 'password' }" @click="showPwd('password')">
            <img :src="passwordType === 'password'
                ? require('./../../../static/images/pc/eye-off.png')
                : require('./../../../static/images/pc/eye.svg')
              " alt="" />
          </span>
        </el-form-item>
        <el-form-item prop="passwordAganin">
          <span class="svg-container">确认密码</span>
          <el-input ref="passwordAganin" v-model.trim="loginForm.passwordAganin" placeholder="再次确认登录密码"
            name="passwordAganin" :type="passwordTypeAgain === 'password' ? 'password' : 'text'" tabindex="2"
            maxLength="12" @input="(v) =>
              (loginForm.passwordAganin = v.replace(
                /^[\u4E00-\u9FA5]+$/,
                ''
              ))
              " @blur="recover">
          </el-input>
          <span class="show-pwd" :class="{ 'eye-off': passwordTypeAgain === 'password' }"
            @click="showPwd('passwordAgain')">
            <img :src="passwordTypeAgain === 'password'
                ? require('./../../../static/images/pc/eye-off.png')
                : require('./../../../static/images/pc/eye.svg')
              " alt="" />
          </span>
        </el-form-item>
        <div class="register-footer">
          <div>
            <el-button style="width: 100%; margin-bottom: 30px" :class="disabled ? 'gray-btn' : 'orange-btn'"
              :disabled="disabled" @click="submitForm('loginForm')">提交</el-button>
          </div>
          <div v-if="device === 'pc'">
            <router-link :to="'/Login'">
              <el-button style="
                  width: 100%;
                  background-color: #67c23a00;
                  border: 1px solid #fd5f3f;
                  color: #fd5f3f;
                ">回到登录</el-button>
            </router-link>
          </div>
        </div>
      </el-form>
    </div>
    <el-dialog :title="device === 'pc' ? '忘記密碼' : ''" :visible.sync="dialogShow" class="el-dialog-loginOut" width="70%"
      :show-close="false" :close-on-click-modal="false" center>
      <div class="loginOut-box">
        <div v-if="device === 'mobile'"><img src="./../../../static/images/success.png" alt="" /></div>
        <span>密码已变更，请重新登录。</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :class="device === 'mobile' ? 'background-orange' : 'background-red'" @click="back">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { forgetPassword, genAuthCode } from "@/api";
import { Encrypt, Decrypt } from "@/utils/AESUtils.js";
import * as phoneValidator from "@/utils/phoneValidator";

import country from "@/components/country.vue";
import { filterCountry } from "@/utils/countryName";

export default {
  components: { country },

  data() {
    return {
      loginForm: {
        phoneNo: "",
        authCode: "",
        newPassword: "",
        passwordAganin: "",
        version: 1,
        country: "CN",
      },
      country: {},
      countryName: "",
      passwordType: "password",
      passwordTypeAgain: "password",
      count: 60,
      timer: false,
      disabled: true,
      dialogShow: false,
      countryShow: false,
      disabledTime: false,
      countryCodeShow: false,
      device: localStorage.getItem("device"),

      //加解密 key iv
      aesKey: "142c7ec1b64ae0c6",
      aesIv: "0000000000000000",
      options: [
        {
          value: 'CN',
          label: '中国 (86)'
        },
      ],
      value: 'CN'
    };
  },
  watch: {
    loginForm: {
      handler(val) {
        let newNum = []
        Array.from(val.phoneNo).forEach((num) => {
          if (!/^[\u4E00-\u9FA5_a-zA-Z/@~!#$%.^&*=<>:?"{}()]+$/.test(num)) newNum.push(num)
        })
        this.loginForm.phoneNo = newNum.toString().replace(/,/g, "")
        if (val.newPassword === val.passwordAganin) {
          if (
            Object.values(val).every((el) => el) &&
            val.newPassword.toString().length >= 4 &&
            val.passwordAganin.toString().length >= 4 &&
            /^[A-Za-z0-9_\_]{5,}$/.test(val.username)
          ) {
            this.disabled = false;
          } else {
            this.disabled = true;
          }
        } else {
          this.disabled = true;
        }
      },
      deep: true,
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.onClickEvent);
  },
  mounted() {
    document.addEventListener("click", this.onClickEvent);
  },
  created() {
    this.countryInitial();
  },
  methods: {
    showCountryModule() {
      return (this.device === 'mobile' && this.countryCodeShow)
    },
    countryInitial() {
      const countryCode = JSON.parse(localStorage.getItem("countryCode"));
      if (!countryCode || countryCode.countryCode === "other") {
        const cnCountry = {
          countryCode: "86",
          countryName: "中国",
          regionCode: "CN",
        };
        this.countryName = cnCountry.countryName;
        this.country = cnCountry;
        localStorage.setItem("countryCode", JSON.stringify(cnCountry));
      } else {
        this.countryName = countryCode.countryName;
        this.country = countryCode;
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
        (event.target.className === "hichat-pc");
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
      this.countryName = item.countryName;
      this.countryCodeShow = false;
    },
    recover() {
      let agentValue = navigator.userAgent;
      // userAgent属性是一个只读的字符串，声明了浏览器用于 HTTP 请求的用户代理头的值，用于判断是Android设备还是IOS设备
      let isIOS = !!agentValue.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // 判断是否是ios终端
      if (isIOS) {
        window.scrollTo(0, 0); // 如果是ios终端，则在失焦的时候使页面返回顶部
      }
    },
    getAuthCodeData(phone, key) {
      const countryCode = JSON.parse(localStorage.getItem("countryCode"));
      const validatePhone = countryCode.regionCode === "CN" && !phoneValidator.isPhoneNumberValid(phone, "CN")

      if (phone === "") {
        this.$message({ message: "手机号码尚未输入", type: "error" });
        return;
      } else if (validatePhone) {
        this.$message({
          message: "請輸入正確手机号码格式!",
          type: "error",
        });
        return;
      }
      this.disabledTime = true;
      let params = { phoneNo: phone, forRegister: key, country: countryCode.regionCode, };
      genAuthCode(params).then((res) => {
        if (res.code === 200) {
          this.$message({ message: "请至注册手机号码确认验证码", type: "success" });
          this.timer = true;
          let time = null;
          time = setInterval(() => {
            if (this.count > 0) {
              this.count = this.count - 1;
            } else {
              clearInterval(time);
              this.count = 60;
              this.timer = false;
              this.disabledTime = false;
            }
          }, 1000);
        } else {
          this.timer = false;
          this.disabledTime = false;
        }
      });
    },
    showPwd(value) {
      switch (value) {
        case "password":
          this.passwordType =
            this.passwordType === "password" ? "" : "password";
          break;
        case "passwordAgain":
          this.passwordTypeAgain =
            this.passwordTypeAgain === "password" ? "" : "password";
          break;
      }
      this.$nextTick(() => this.$refs.password.focus());
    },
    //登录&&註冊
    submitForm(rules) {
      //驗證註冊表單是否通過
      this.$refs[rules].validate((valid) => {
        if (!valid) {
          this.$message({
            message: "输入失败，请重新输入并确认",
            type: "error",
          });
          return;
        }
        delete this.loginForm.passwordAganin;
        const countryCode = JSON.parse(localStorage.getItem("countryCode"));
        this.loginForm.country = countryCode.regionCode
        this.loginForm.newPassword = Encrypt(this.loginForm.newPassword, this.aesKey, this.aesIv)
        this.disabled = true;
        forgetPassword(this.loginForm)
          .then((res) => {
            this.loginForm.newPassword = Decrypt(this.loginForm.newPassword, this.aesKey, this.aesIv)
            if (res.code === 200) {
              this.dialogShow = true;
            } else {
              this.loginForm.authCode = "";
            }
          })
          .catch((err) => {
            this.disabled = false;
            this.$message({
              message: "输入失败，请重新输入并确认",
              type: "error",
            });
            return false;
          });
      });
    },
    back() {
      this.$router.back(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
//H5 PC 共同樣式
.register-container-pc,
.register-container-mobile {
  width: 100%;
  height: 100%;
  background-color: #eaf5fa;
  overflow: hidden;

  .register-header {
    margin: 1em;
    display: flex;
    align-items: center;

    .register-back {
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }

    .register-header-title {
      margin: 0 auto;
      position: relative;
      left: -0.5em;
      color: #10686e;
    }
  }

  .register-content {
    .tip-text {
      font-size: 12px;
      color: #6666667c;
      position: relative;
      top: -10px;
    }

    .login-form {
      position: relative;
      height: 80vh;
      max-width: 100%;
      padding: 0.5em 0;
      margin: 1em;
      overflow: hidden;

      .el-form-item {
        background: #ffffff;
        border-radius: 10px;
        color: #454545;
        margin-bottom: 20px;

        .el-input {
          display: inline-block;
          height: 47px;
          width: 65%;

          ::v-deep.el-input__inner {
            border: 0 !important;
          }

        }

        ::v-deep.el-select {
          width: 115px;

          .el-input {
            display: inline-block;
            height: 47px;
            width: 100%;

            .el-input__inner {
              vertical-align: middle;
              background-color: #ffffff !important;
              border: none;
            }
          }
        }
      }

      .verification-style {
        border-radius: 5px !important;
        padding: 8px 10px;
        font-size: 12px;
        position: absolute;
        top: 1em;
        right: 1em;
        text-align: center;
        border: 1px solid #fd5f3f;
        color: #fd5f3f;
        border-radius: 5px;
      }

      .gray-btn {
        background-color: #b3b3b3;
        color: #fff;
      }

      .orange-btn {
        background-color: #fe5f3f;
        color: #fff;
      }
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

    .svg-container {
      padding: 6px 0 6px 15px;
      vertical-align: middle;
      font-size: 14px;
      width: 60px;
      display: inline-block;

      img {
        height: 17px;
      }
    }

    .register-footer {
      position: relative;
      top: 2em;
    }
  }

  .read-check-box {
    margin-bottom: 1em;

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
}

//PC版本樣式
.register-container-pc {
  width: 370px;
  margin: 3em auto;
  overflow: initial;

  .register-header {
    justify-content: center;

    .register-header-title {
      left: 0;
      color: #474747;
      margin: 20px 0;
      font-size: 20px;
    }

    .title-container {
      display: flex;
      align-items: center;
      flex-direction: column;

      img {
        height: 5em;
      }
    }
  }

  .register-content {
    .svg-container {
      font-size: 14px;
      width: 60px;
    }

    .login-form {
      margin: 1em 0;

      .el-form-item {
        ::v-deep.el-select {
          width: 115px;

          .el-input {
            display: inline-block;
            height: 47px;
            width: 100%;

            .el-input__inner {
              vertical-align: middle;
              background-color: #ffffff !important;
              border: none;
            }
          }
        }
      }
    }

    .register-footer {
      top: 0;
    }

    .show-pwd {
      cursor: pointer;

      img {
        height: 1.5em;
      }
    }

    .eye-off {
      img {
        height: 1.5em;
      }
    }
  }

  .verification-style {
    font-size: 14px !important;
    border: 0 !important;
    right: 0.5em;
  }

  ::v-deep.el-dialog-loginOut {
    overflow: auto;

    .el-dialog {
      .el-dialog__footer {
        padding: 0 !important;
      }
    }
  }
}

.-webkit-input-placeholder {
  background-color: #ffffff;
}
</style>