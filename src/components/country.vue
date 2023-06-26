<template>
  <div>
    <div v-if="device === 'pc'">

      <ul class="dropdown">
        <li
          v-for="(item, index) in newCountryList"
          :key="index"
          class="country-select__list"
          @click="changeCountry(item)"
        >
          <div>{{ item.countryName }}</div>
          <div>{{ countryItem(item) }}</div>
        </li>
      </ul>
    </div>
    <div class="country-select__mobile" v-else >
      <div class="country__mobile--box">
        <div class="home-search">
          <el-input
            placeholder="请输入要搜寻的区码或地区名称"
            prefix-icon="el-icon-search"
            clearable
            v-model="searchKey"
          >
          </el-input>
        </div>
        <div class="country__mobile--scroll" @touchmove="$root.handleTouch">
          <ul>
            <li
              v-for="(item, index) in newCountryList"
              :key="index"
              class="country-select__list"
              @click="changeCountry(item)"
            > 
            <div class="country-select__box"> 
              <div class="country-select__box--msg">
                <div>{{ countryItem(item) }}</div>
                <div>{{ item.countryName }}</div>
              </div>
              <div class="country-select__bottom--border"></div>
            </div>

            </li>
          </ul>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { getCountryList } from "_api/index.js";

export default {
  data() {
    return {
      searchKey: "",
      countryList: [],
      newCountryList:[],
      device: localStorage.getItem("device"),
    };
  },
  props:["countryName",'page'],
  watch:{
    searchKey(val) {
      this.search(val)
    },
    countryName(val){
      this.search(val)
    }
  },
  created() {
    this.getCountry();
  },
  methods: {
    search(val){
      let searchKeyData = val.split(" ");
      const otherData = {
        countryCode: "other",
        countryName: "其他",
        regionCode: "other",
      }
      searchKeyData.forEach((el) => {
        let searchCase = this.countryList;
        this.searchData = searchCase.filter((item) => {
          return item.newCountryCode.indexOf(el) !== -1 || item.countryName.indexOf(el) !== -1;
        });
      });
      this.newCountryList = this.searchData;
      const other = this.newCountryList.some(el => el.countryCode === "other")
      if(!other && !["register","forgetPassword"].includes(this.page)){
        this.newCountryList.push(otherData)
      }
      
    },
    countryItem(item) {
      if (item.countryCode === "other") {
        return "";
      }
      return "+" + item.countryCode;
    },
    changeCountry(item) {
      localStorage.setItem("countryCode", JSON.stringify(item));
      this.$cookie.set("countryCode", JSON.stringify(item))
      this.$emit("changeCountry", item);
    },
    getCountry() {
      getCountryList().then((res) => {
        if(["register","forgetPassword"].includes(this.page)){
          this.countryList = res.data.filter(el => el.countryCode !=="other");
        }else{
          this.countryList = res.data
        }
        
        this.countryList.forEach((el)=>{
          el.newCountryCode = "+" + el.countryCode
        })
        this.newCountryList = this.countryList
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.country {
  &-select {
    &__list {
      display: flex;
      justify-content: space-between;
      padding: 5px 15px;
    }
    &__mobile {
      width: 100%;
      height: 100%;
      background: #00000099;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9;
    }
    &__bottom{
      &--border{
        width: 100%;
        border-bottom: 0.02em solid rgba(0, 0, 0, 0.05);
      }
    }
    &__box{
      width: 100%;
      &--msg{
        display: flex;
        justify-content: space-between;
      }
    }
  }
  &__mobile {
    &--box {
      width: 100%;
      height: 380px;
      background: #fff;
      position: fixed;
      bottom: 0;
      border-radius: 10px 10px 0 0;
    }
    &--scroll{
      overflow: auto;
      height: 305px;
    }
  }
}
::v-deep.home-search {
  margin: 10px;
  z-index: 9;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  .el-input {
    width: 100%;
    .el-input__inner {
      border: 0;
      color: #666666;
      position: relative;
      left: 20px;
    }

    .el-input__prefix {
      color: #666666;
    }

    ::placeholder {
      /* CSS 3 標準 */
      color: #666666;
    }
  }
}
</style>
