<template>
  <div class="home-content-box" id="rate-box">
    <div class="home-content"  >
      <div class="content-top">
        <div>{{ ratingList.ratingAverage }}</div>
        <div>用户评价平均分数</div>
        <div>评价总数 {{ ratingList.ratingCount }}个</div>
        <div>
          <i
            class="el-icon-star-on"
            :class="index <= rateNumber ? 'org-color' : 'gray-color'"
            v-for="index in 5"
            :key="index"
          >
            <span>{{ index }}</span>
          </i>
        </div>
      </div>
      <div class="content-bottom">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="已评论" name="isComment">
            <div
              class="address-box"
              v-for="(item, index) in isComment"
              :key="index"
            >
              <el-image :src="noIconShow(item.ratingMember, 'user')" />
              <div class="content-box">
                <div class="msg-box">
                  <div>
                    <span style="margin-top: 1px">{{
                      item.ratingMember.nickname.slice(0, 10)
                    }}</span>
                    <span class="gray-light">{{
                      $root.formatTimeXS(item.ratingTime)
                    }}</span>
                  </div>
                  <div class="rate">
                    <i
                      class="el-icon-star-on"
                      :class="index <= item.rating ? 'org-color' : 'gray-color'"
                      v-for="index in 5"
                      :key="index"
                    >
                      <span>{{ index }}</span>
                    </i>
                  </div>
                </div>
                <div class="content-border-bottom"></div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="尚未评论" name="noComment">
            <div
              class="address-box"
              v-for="(item, index) in noComment"
              :key="index"
            >
              <el-image :src="noIconShow(item.ratingMember, 'user')" />
              <div class="content-box">
                <div class="msg-box">
                  <div>
                    <span style="margin-top: 1px">{{
                      item.ratingMember.nickname.slice(0, 10)
                    }}</span>
                    <span class="gray-light">{{
                      $root.formatTimeXS(item.ratingTime)
                    }}</span>
                  </div>
                </div>
                <div class="content-border-bottom"></div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { showIcon } from "@/utils/icon";

export default {
  name: "list",
  props:[ "ratingList", "isComment" ,"noComment" ,"rateNumber"],
  data() {
    return {
      activeName: "isComment",
    }
  },
  mounted() {
    this.homeScrollHeight();
  },
  methods: {
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    handleClick() {
      this.$emit('checkActive',this.activeName)
    },
    homeScrollHeight() {
      let scrollTop = document.querySelector('#rate-box');
      let headerScrollTop = document.getElementById('rate-box').querySelector(".is-top");
      let contentScrollTop = document.getElementById('rate-box').querySelector(".content-top");
      let tabsContentHeight =
        scrollTop.clientHeight - headerScrollTop.scrollHeight - contentScrollTop.scrollHeight - 90;
        document.getElementById('rate-box').querySelector(".el-tabs__content").style.height =
        tabsContentHeight + "px";
    },
  },
};
</script>

<style lang="scss" scoped>
.gray-light{
  color: #00000066;
}
.org-color{
  background:linear-gradient(132.31deg, #FFDB2D -0.19%, #FF9900 100.06%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
.gray-color{
  color: #00000033;
}
.el-icon-star-on{
  span{
    display: none !important;
  }
}

.hichat-pc {
  .home-wrapper {
    .home-content {
      .content-bottom {
        border-top: 0.01em solid rgba(0, 0, 0, 0.05);
      }
    }
  }
}
.home-wrapper {
  .home-content-box{
    overflow: hidden;
    height: -webkit-fill-available;
    .home-content{
      overflow-y: hidden;
      .content-top{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin:25px;
        line-height: 35px;
        div{
          &:nth-child(1){
            color: #FF6900;
            font-size: 32px;
          }
          &:nth-child(2){
            color: #000000CC;
            font-size: 18px;
          }
          &:nth-child(3){
            color: #00000066;
            font-size: 16px;
          }
        }
        .el-icon-star-on{
          font-size: 35px;
        }
      }
    }
    .address-box{
      .content-box{
        width: 75%;
        .msg-box{
          .rate{
            display: flex;
            align-items: center;
            position: absolute;
            right: 14px;
            margin-top: 12px;
            .el-icon-star-on{
              font-size: 16px;
            }
          }
        }
      }
      &:last-child{
        // padding-bottom: 13em;
      }
    }
  }
}
</style>

