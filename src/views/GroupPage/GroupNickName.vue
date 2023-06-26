<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <template v-if="device === 'mobile'">
          <el-header height="55px">
            <div class="home-header">
              <div class="home-user" @click="back"></div>
              <span class="home-header-title">编辑群组内昵称</span>
              <div class="home-add-user"></div>
            </div>
          </el-header>
        </template>
        <template v-else>
          <el-header height="70px">
            <div class="home-header">
              <span class="home-header-title">
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                  @click="back"
                >
                  <span style="padding-right: 10px"
                    ><img
                      src="./../../../static/images/pc/arrow-left.png"
                      alt=""
                  /></span>
                  <span>编辑群组内昵称</span>
                </div>
              </span>
              <div
                class="home-add-user home-edit-img"
                @click="editSubmit"
              ></div>
            </div>
          </el-header>
        </template>
        <div class="home-content">
          <div class="user-edit-form">
            <el-form ref="form" :model="groupForm" label-width="100px">
              <el-form-item label="昵称预览">
                <el-input
                  v-model="groupForm.name"
                  placeholder="昵称预览"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="home-footer-btn" v-if="device === 'mobile'">
          <el-button
            :class="disabled ? 'gray-btn' : 'orange-btn'"
            :disabled="disabled"
            @click="editSubmit"
            >编辑群组内昵称</el-button
          >
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { mapState, mapMutations } from "vuex";
import { getToken } from "_util/utils.js";
import { setGroupNickname } from "@/api/groupController";

export default {
  name: "EditContact",
  data() {
    return {
      groupForm: {
        name: "",
      },
      disabled: true,
      device: localStorage.getItem("device"),
    };
  },
  watch: {
    groupForm: {
      handler(val) {
        this.disabled = !val.name;
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
    }),
  },
  created() {
    this.groupForm.name =
      !this.groupUser.groupNickname
        ? this.groupUser.groupNumber
        : this.groupUser.groupNickname;
  },
  methods: {
    ...mapMutations({
      setChatGroup: "ws/setChatGroup",
      setMsgInfoPage: "ws/setMsgInfoPage",
    }),
    editSubmit() {
      let params = {
        groupId: this.groupUser.groupId,
        nickname: this.groupForm.name,
      };
      setGroupNickname(params)
        .then((res) => {
          if (res.code === 200) {
            this.groupUser.groupNickname = this.groupForm.name;
            this.setChatGroup(this.groupUser);
            this.back();
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
          return false;
        });
    },
    back() {
      if (this.device === "mobile") {
        this.$router.back(-1);
      } else {
        this.setMsgInfoPage({ pageShow: true, type: "" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home-header {
  .home-user {
    background-color: #fff;
    background-image: url("./../../../static/images/back.png");
  }
  .home-edit-img {
    background-color: #fff;
    background-image: url("./../../../static/images/pc/check.png");
  }
}
.home-content {
  .group-data {
    .el-image {
      width: 4em;
      height: 4em;
    }
    span {
      height: 4.5em !important;
      overflow: hidden;
      img {
        width: 4em;
        border-radius: 10px;
      }
    }
    .photo-edit {
      height: 1.5em !important;
      color: #fe5f3f;
    }
  }
}
.user-edit-form {
  margin: 1em;
  background-color: #fff;
  border-radius: 10px;
  ::v-deep.el-form {
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        font-size: 16px;
      }
      .el-input {
        font-size: 19px;
        .el-input__inner {
          border: none;
        }
      }
    }
  }
}
.hichat-pc {
  .home-content {
    .group-data {
      .el-image {
        width: auto;
        height: 6em;
      }
      span {
        height: 6.5em !important;
      }
    }
  }
  .user-edit-form {
    ::v-deep.el-form {
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.05);
      .el-form-item {
        .el-form-item__label {
          font-size: 16px;
        }
        .el-input {
          .el-input__inner {
            background: none;
          }
        }
      }
    }
  }
  .photo-edit {
    cursor: pointer;
  }
  .el-dialog-loginOut {
    ::v-deep.el-dialog__footer {
      padding: 0 !important;
      .el-button {
        &:nth-child(2) {
          border-left: 1px solid #efefef;
        }
      }
    }
  }
}
</style>
