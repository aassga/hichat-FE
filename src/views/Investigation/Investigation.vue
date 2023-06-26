<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'mobile'">
      <el-main>       
        <el-header height="55px">
          <div class="home-header">
            <!-- <router-link :to="'/Home'" > -->
              <div class="home-user" @click="back()"></div>
            <!-- </router-link> -->
            <span class="home-header-title">用户调查记录</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <invest-list 
          :isComment="isComment" 
          :noComment="noComment" 
          :ratingList="ratingList" 
          :rateNumber="rateNumber"
          @checkActive="checkActive"
          />
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="370px">
        <el-header height="70px">
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back()"></div>
            <span class="home-header-title">用户调查记录</span>
          </div>
        </el-header>
        
        <invest-list 
          :isComment="isComment" 
          :noComment="noComment" 
          :ratingList="ratingList" 
          :rateNumber="rateNumber"
          @checkActive="checkActive"
          />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { showIcon } from "@/utils/icon";
import { getCustomerRating,getUnsubmittedCustomerRating } from "@/api/customerServiceController";

import InvestList from "./components/list.vue";


export default {
  name: "Investigation",
  components:{
    InvestList
  },
  data() {
    return {
      rateNumber:0,
      ratingList:{},
      isComment:[],
      noComment:[],
      activeName:"isComment",
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.getIsCommentList()
    

  },
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
    }),
     checkActive(activeName){
      if (activeName === "isComment") {
        this.getIsCommentList()
      } else {
        this.getNoCommentList()
      }
    },
    getIsCommentList(){
      let params={
        pageSize: 200,
        pageNum:1,
      }
      getCustomerRating(params).then((res)=>{
        if(res.code === 200){
          this.ratingList = res.data
          this.rateNumber = Math.floor( res.data.ratingAverage )
          this.isComment = res.data.ratingDetails.list
        }
      })
    },
    getNoCommentList(){
      let params={
        pageSize: 200,
        pageNum:1,
      }
      getUnsubmittedCustomerRating(params).then((res)=>{
        if(res.code === 200){
          this.noComment = res.data.ratingDetails.list
        }
      })
    }, 
    noIconShow(iconData, key) {
      return showIcon(iconData, key);
    },
    back() {
      this.$router.back(-1);
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
.hichat-mobile{
  .home-wrapper{
    .home-header{
      margin: 16px 1em;
      .home-header-title{
        margin: 0 auto;
        color: #10686e;
        font-weight: 600;
        font-size: 18px;
      }
    }
  }
}
.hichat-pc{
  .home-wrapper{
    .home-header{
      .home-user-pc {
        background-color: #fff;
        background-image: url("./../../../static/images/pc/arrow-left.png");
        cursor: pointer;
      }
      .home-header-title{
        margin-left: 9px;
      }
    }
    .home-content{
      .content-bottom{
        border-top: 0.01em solid rgba(0, 0, 0, 0.05);
      }
    }
  }
}

.home-wrapper {
  .home-header{
    margin: 24px 1em;
    
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
  }
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
      padding-bottom: 1em;
    }
  }
}
.close{
  font-size: 25px;
  cursor: pointer;
}
</style>
