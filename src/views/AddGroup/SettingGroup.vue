<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'mobile'">
      <el-main>
        <el-header height="60px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">权限</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <template v-if="groupData.isAdmin">
            <div class="setting-title">群组成员</div>
            <div
              v-for="(item, index) in groupPeopleData"
              :key="item.key + index"
            >
              <div class="setting-button" v-if="item.key !== 'editGroupNickname' || !showNickname">
                <div class="setting-box">
                  <div class="setting-button-left" :class="{'pl15':item.key === 'editGroupNickname'}" >
                    <el-switch
                      v-model="item.isCheck"
                      :inactive-text="item.name"
                      active-color="#fd5f3f"
                      inactive-color="#666666"
                    >
                    </el-switch>
                  </div>
                </div>
              </div>
            </div>    
            <div class="setting-title">信息传递</div>
            <div
              class="setting-button"
              v-for="(item, index) in messagePermissionData"
              :key="item + index"
            >
              <div class="setting-box">
                <!-- <div class="setting-button-left">
                  <span>{{ item.name }}</span>
                </div> -->
                <div class="setting-button-left">
                  <el-switch
                    v-model="item.isCheck"
                    :inactive-text="item.name"
                    active-color="#fd5f3f"
                    inactive-color="#666666"
                  >
                  </el-switch>
                </div>
              </div>
            </div>
            <div class="setting-title">管理員</div>
            <div class="setting-button mt10">
              <router-link to="/AdminSetting">
                <div class="setting-button-left">
                  <span>管理员设定</span>
                </div>
                <div class="setting-button-right">
                  <img src="./../../../static/images/next.png" alt="" />
                </div>
              </router-link>
            </div>
          </template>
          <div
            v-for="(item, index) in settingPermission"
            :key="index"
          >
            <div class="setting-title" >{{item.name}}</div>
            <div class="setting-button mt10">
              <router-link :to="item.path">
                <div class="setting-button-left">
                  <span>{{item.value}}</span>
                </div>
                <div class="setting-button-right">
                  <img src="./../../../static/images/next.png" alt="" />
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div class="home-footer-btn" v-if="groupData.isAdmin">
          <el-button
            class="orange-btn"
            @click="authoritySettingBtn"
            >储存设定</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="320px">
        <el-header height="70px">
          <div class="home-header flex-start" :style="!groupPermissionData.addGroup ? 'position: relative; left: -4px; top: -1px;':''">
            <div class="home-user-pc" @click="back()"></div>
            <span class="home-header-title">权限</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          
          <template v-if="groupData.isAdmin">
            <div class="setting-title">群组成员</div>
            <div
              v-for="(item, index) in groupPeopleData"
              :key="item.key + index"
            >
              <div class="setting-button" v-if="item.key !== 'editGroupNickname' || !showNickname">
                <div class="setting-box">
                  <div class="setting-button-left no-center" :class="{'pl15':item.key === 'editGroupNickname'}" >
                    <el-switch
                      v-model="item.isCheck"
                      :inactive-text="item.name"
                      active-color="#fd5f3f"
                      inactive-color="#666666"
                    >
                    </el-switch>
                    <div class="tip-text">{{ item.tip }}</div>
                  </div>
                  
                </div>
              </div>
            </div>            
            <div class="setting-title">信息传递</div>
            <div
              class="setting-button"
              v-for="(item, index) in messagePermissionData"
              :key="item.key + index"
            >
              <div class="setting-box">
                <!-- <div class="setting-button-left">
                  <span>{{ item.name }}</span>
                </div> -->
                <div class="setting-button-left">
                  <el-switch
                    v-model="item.isCheck"
                    :inactive-text="item.name"
                    active-color="#fd5f3f"
                    inactive-color="#666666"
                  >
                  </el-switch>
                </div>
              </div>
            </div>
            <div class="setting-title">管理員</div>
            <div class="setting-button mt10">
              <a @click="changeSettingGroupShow">
                <div class="setting-button-left">
                  <span>管理员设定</span>
                </div>
                <div class="setting-button-right">
                  <img src="./../../../static/images/next.png" alt="" />
                </div>
              </a>
            </div>
          </template>

          <div
            v-for="(item, index) in settingPermission"
            :key="index"
          >
            <div class="setting-title">{{item.name}}</div>
            <div class="setting-button mt10">
              <a @click="goBanSetting(item)">
                <div class="setting-button-left">
                  <span>{{item.value}}</span>
                </div>
                <div class="setting-button-right">
                  <img src="./../../../static/images/next.png" alt="" />
                </div>
              </a>
            </div>
          </div>
        </div>
        <div class="home-footer-btn" v-if="groupData.isAdmin">
          <el-button
            class="orange-btn"
            @click="authoritySettingBtn" 
            >储存设定</el-button
          >
        </div>
      </el-aside>
    </el-container>    
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
import { addGroup,getGroupAuthoritySetting,setGroupAuthority } from '@/api/groupController'

export default {
  name: "SettingGroup",
  data() {
    return {
      groupPeopleData:[
        {
          name:"显示为群组內昵称",
          key:"showGroupNumber",
          isCheck:false,
          tip:"所有成员的暱稱以成员1、成员2....方式顯示。"
        },
        {
          name:"允许修改群组內昵称",
          key:"editGroupNickname",
          isCheck:false,
          tip:"允许成员编辑昵称，该昵称仅限此群组使用。"
        },
        {
          name:"查看群组成员资讯",
          key:"checkUserInfo",
          isCheck:false,
          tip:"",
        },
      ],
      messagePermissionData:[
        {
          name:"传送文字讯息",
          key:"sendMessage",
          isCheck:true,
        },
        {
          name:"传送图片或语音讯息",
          key:"sendImage",
          isCheck:true,
        },
        {
          name:"传送档案或链接网址",
          key:"sendLink",
          isCheck:true,
        },               

        {
          name:"置顶讯息",
          key:"pin",
          isCheck:false,
        },
        {
          name:"发起群组通话",
          key:"startGroupCall",
          isCheck:false,
        },
      ],
      settingPermission:[
        {
          name:"禁言",
          value:"禁言设定",
          path:"/BanSetting",
        },
        {
          name:"禁用字词屏蔽",
          value:"禁用字词设定",
          path:"/BanWord",
        }
      ],
      device: localStorage.getItem("device"),
      showNickname:false,
    };
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      infoMsg: (state) => state.ws.infoMsg,      
      groupPermissionData: (state) => state.ws.groupPermissionData,
    }),
  },  
  created() {
    this.groupData = this.groupPermissionData.addGroup ? JSON.parse(localStorage.getItem("addGroupData")): this.groupUser
  },
  mounted() {
    if(!this.groupPermissionData.addGroup) {
      this.getGroupAuthority()
    }else{
      this.showNickname = !this.groupPeopleData[0].isCheck 
    }
    this.mangerAuthority()
  },
  watch:{
    groupPeopleData: {
      handler(value) {
        if(value[0].isCheck){
          this.showNickname = false
        }else{
          value[1].isCheck = false
          this.showNickname = true
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations({
      setInfoMsg:"ws/setInfoMsg",
      setChatGroup: "ws/setChatGroup",
      setMsgInfoPage:"ws/setMsgInfoPage",
      setAuthorityGroupData:"ws/setAuthorityGroupData",
    }),
    changeSettingGroupShow() {
      if(this.groupPermissionData.addGroup){
        this.$router.push({ path: "/AdminSetting"});
      }else{
        this.setMsgInfoPage({ pageShow: false, type: "AdminSetting" });
      }
    },
    mangerAuthority(){
      if(this.groupData.isManager){
        if(!JSON.parse(localStorage.getItem("authority")).banUserPost){
          this.settingPermission = this.settingPermission.filter((list)=>{
            return list.path !== "/BanSetting"
          })
        }
        if(!JSON.parse(localStorage.getItem("authority")).disabledWord){
          this.settingPermission = this.settingPermission.filter((list)=>{
            return list.path !== "/BanWord"
          })
        }
      } 
    },
    goBanSetting(data){
      if(this.groupPermissionData.addGroup){
        this.$router.push({ path: data.path});
      }else{
        this.setMsgInfoPage({ pageShow: false, type: data.path.replace("/", "") });
      }
    },

    getGroupAuthority(){
      let groupId = this.groupData.groupId;
      getGroupAuthoritySetting({groupId}).then((res)=>{
        if(res.code === 200 ){
          this.authorityData = res.data
          this.showNickname = !this.authorityData.showGroupNumber
          for (let item in this.authorityData) {
            this.messagePermissionData.forEach((res)=>{
              if(item === res.key){
                return res.isCheck = this.authorityData[item]
              }
            })
            this.groupPeopleData.forEach((res)=>{
              if(item === res.key){
                return res.isCheck = this.authorityData[item]
              }
            })
          }
          this.setAuthorityGroupData(this.authorityData);
        }
      })
    },
    authoritySettingBtn(){
      this.newAuthorityData ={}
      let groupNewArray = this.messagePermissionData.concat(this.groupPeopleData)
      groupNewArray.forEach((el)=>{
        this.newAuthorityData[el.key] = true;
        let newData = groupNewArray.filter((res) => {
          return (res.key === el.key);
        });
        this.newAuthorityData[el.key] = newData[0].isCheck
      })
      if(!this.groupPermissionData.addGroup){
        let params = {
          authority: this.newAuthorityData,
          groupId: this.groupData.groupId
        }
        setGroupAuthority(params).then((res)=>{
          if(res.code === 200){
            if(this.device === "mobile"){
              this.$router.push({ path: "/GroupPage",});
            }else{
              this.setInfoMsgTrue()
            }  
            this.setAuthorityGroupData(params.authority);
          }
        })
      }else{
        delete this.groupPermissionData.addGroup
        delete this.groupPermissionData.peopleData
        this.groupPermissionData.groupAdminAuthority = this.newAuthorityData
        localStorage.removeItem('addGroupData')
        addGroup(this.groupPermissionData).then((res)=>{
          if(res.code === 200){
            let groupData = {
              groupId: res.data.id,
              groupName: res.data.groupName,
              icon: res.data.icon,
              isAdmin: true,
              setting:{
                prompt:true,
              },
              toChatId: "g" + res.data.id,
              memberId: JSON.parse(localStorage.getItem("id")),
            };
            this.setChatGroup(groupData);
            this.$router.push({
              path: this.device === "mobile" ? "/ChatGroupMsg" : "Home",
            });
          }
        })
      }
    },
    back() {
      if(this.groupPermissionData.addGroup){
        this.$router.push({ path: "/AddGroupList",});
      }else{
        if (this.device === "mobile"){
          this.$router.push({ path: "/GroupPage",});
        }else{
          this.setInfoMsgTrue()
        }
      }
    },    
    setInfoMsgTrue(){
      if (this.infoMsg.infoMsgMap === "address") {
        this.setInfoMsg({
          infoMsgShow: true,
          infoMsgNav: "GroupPage",
          infoMsgChat: false,
          infoMsgMap: "address",
        });
        this.setMsgInfoPage({ pageShow: true, type: "" });
      } else {
        this.setInfoMsg({ infoMsgShow: true, infoMsgChat: true, infoMsgNav: "GroupPage", });
        this.setMsgInfoPage({ pageShow: true });
      }
    }
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
    .home-user-pc {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/arrow-left.png");
      cursor: pointer;
    }
  }
  .home-content {
    .setting-title {
      padding: 15px 20px;
      color: rgba(0, 0, 0, 0.4);
      font-size: 15px;
    }
    .setting-button {
      padding: 0.5em 0 0.5em 0.5em;
      background-color: #fff;
      &::after {
        content: "";
        display: block;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        width: 100%;
        margin-left: 10px;
        position: relative;
        top: 9px;
      }
      a,.setting-box {
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
        width: 100vw;
        flex-direction: column;
        span {
          font-size: 15px;
          color: #333333;
        }
        .el-switch{
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .tip-text{
          font-size: 12px;
          color: #c5c5c5;
          margin-top: 10px;
        }
        ::v-deep.el-switch__label.is-active{
          color: #333333;
        }
      }
      .no-center{
        align-items: flex-start;
      }
      .setting-button-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 10em;
        span {
          margin-right: 1em;
          font-size: 15px;
          color: #b3b3b3;
        }
      }
    }    
  }
}
.pl15{
  padding-left: 15px;
}
</style>
