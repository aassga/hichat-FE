<template>
  <div class="home-content">
    <div class="home-content__img">
      <img src="./../../../../static/images/warn.png" alt="">
    </div>
    <div class="home-content__title">{{ title }}</div>
    <div class="home-content__text">
      <ul>
        <li v-for="(item, index) in textData" :key="index" class="home-content__text--li">
          <div>{{ index + 1 }}. </div>
          <div>{{ item.text }}</div>
        </li>
      </ul>
    </div>
    <el-form ref="loginForm" :model="loginForm" class="login-form" label-position="top">
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
            ? require('./../../../../static/images/pc/eye-off.png')
            : require('./../../../../static/images/pc/eye.svg')
            " alt="" />
        </span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "captionText",
  data() {
    return {
      title: "为确保用户帐号资料安全，用户可在任何时候，自行删除嗨聊帐号，若要删除您的帐号，请务必详细阅读相关说明。",
      textData: [
        {
          text: "帐号删除后，所有资料将会被清除，包括帐号、密码、使用纪录及使用期间上传之相片、影片、音档......等等。"
        },
        {
          text: "上述资料一经删除帐号后即无法进行复原。"
        },
        {
          text: "成功删除后即无法再使用原帐号资料登入，但可使用相同帐号重新注册。"
        },
        {
          text: "使用同帐号重新注册后即视为新帐号，登入后并不会保留或继承原来帐号之资料。"
        },

      ],
      loginForm: {
        password: "",
      },
      passwordType: "password",
      passwordDisabled: false,
      device: localStorage.getItem("device"),
    };
  },
  created() {

  },
  watch:{
    loginForm: {
      handler(val) {
        if (val.password.toString().length >= 4) {
          this.$emit('disabled',false)
        } else {
          this.$emit('disabled',true)
        }
        this.$emit('password',val.password)
      },
      deep: true,
    },
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === "password" ? "" : "password";
      this.$nextTick(() => this.$refs.password.focus());
    },
    recover() {
      let agentValue = navigator.userAgent;
      // userAgent属性是一个只读的字符串，声明了浏览器用于 HTTP 请求的用户代理头的值，用于判断是Android设备还是IOS设备
      let isIOS = !!agentValue.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // 判断是否是ios终端
      if (isIOS) {
        window.scrollTo(0, 0); // 如果是ios终端，则在失焦的时候使页面返回顶部
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home-content {
  padding: 0 20px;

  &__img {
    display: flex;
    justify-content: center;
    margin: 50px 0 25px 0;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
  }

  &__text {
    margin-top: 30px;

    &--li {
      display: flex;
      font-size: 16px;
      line-height: 25px;
      font-weight: 600;
    }
  }
}

.login-form {
  position: relative;
  width: 80vw;
  max-width: 100%;
  padding: 4em 0;
  margin: 0 auto;

  .el-form-item {
    background: #0000000D;
    border-radius: 10px;
    color: #454545;
    margin-bottom: 20px;

    ::v-deep.el-form-item__content {
      .el-input {
        display: inline-block;
        height: 47px;
        width: 60%;

        input {
          background-color: #a9a9a90d;
          border: 0px;
          -webkit-appearance: none;
          border-radius: 0px;
          padding: 12px 5px 12px 10px;
          color: #666666;
          height: 47px;
          

          &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px #fff inset !important;
          }
        }
      }
    }
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
}

.svg-container {
  padding: 6px 0 6px 15px;
  color: #889aa4;
  font-size: 14px;
  width: 60px;
  vertical-align: inherit;
  color: #454545;
  display: inline-block;

  img {
    height: 17px;
  }
}
</style>
