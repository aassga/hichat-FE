<template>
  <div class="home-wrapper">
    <el-container v-if="device === 'mobile'">
      <el-main>
        <el-header :style="num === 2 || num === 1 ? 'height:55px' : 'height:120px'">
          <div class="home-header">
            <div
              class="home-user"
              :class="[
                { 'QRcode-img': num === 0 },
                { 'broadcast-img': num === 1 && activeName === 'address'},
                { 'promote-img': num === 2 },
              ]"
              @click="
                num === 0 || num === 2 ? (centerDialogVisible = true) : activeName === 'address' ? $router.push({ name: 'SpreadChange'}) : false
              "
            ></div>
            <span class="home-header-title">{{
              num === 0 ? "通讯录" : num === 1 ? "嗨聊" : "设定"
            }}</span>
            <div v-if="num === 0 || num === 1">
              <template v-if="['address', 'contact', 'maybeKnow'].includes(activeName || hichatNav.type)">
                <router-link
                  :to="'/AddUser'"
                  :style="
                  ['contact'].includes(activeName || hichatNav.type) ? 'visibility: hidden' : ''
                  "
                >
                  <div class="home-add-user address-img"></div>
                </router-link>
              </template>
              <template v-else-if="['group'].includes(activeName || hichatNav.type)">
                <router-link :to="'/AddGroup'">
                  <div class="home-add-user hichat-img"></div>
                </router-link>
              </template>
            </div>
            <div v-else-if="num === 2">
                <div class="home-add-user"></div>
            </div>
          </div>
          <div class="home-search" v-if="num === 0">
            <el-input
              placeholder="搜索"
              prefix-icon="el-icon-search"
              clearable
              v-model="searchKey"
            >
            </el-input>
          </div>
        </el-header>

        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <el-footer class="home-footer-nav">
          <div
            class="footer-nav-btn"
            v-for="(item, index) in routerNav"
            :key="index"
            @click="changeImg(index)"
          >
            <router-link :to="item.path">
              <span>
                <div class="el-badge-box" v-if="index === 1 && badgeNum !== 0">
                  <el-badge
                    :value="badgeNum > 999 ? 999 : badgeNum"
                    class="item"
                  ></el-badge>
                </div>
                <div class="el-badge-box" v-if="index === 0 && maybeKnowNum !== 0">
                  <el-badge
                    :value="maybeKnowNum > 999 ? 999 : maybeKnowNum"
                    class="item"
                  ></el-badge>
                </div>
                <img :src="index !== num ? item.icon : item.active"
              /></span>
              <span>{{ item.name }}</span>
            </router-link>
          </div>
        </el-footer>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="370px">
        <el-header style="height: 70px">
          <div class="home-header" v-if="num === 2">
            <span class="home-header-title">设定</span>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <img src="./../../../static/images/pc/more.png" alt="" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div class="logout-btn" @click="logoutDialogShow = true">
                    <img src="./../../../static/images/pc/logout.png" alt="" />
                    <span>登出</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="home-search">
            <el-input
              v-if="num === 0"
              placeholder="搜索"
              prefix-icon="el-icon-search"
              v-model="searchKey"
              clearable
            >
            </el-input>
            <div class="home-logo" v-if="num === 1">
              <img src="./../../../static/images/ic_logo.png" alt="">嗨聊
            </div>
            <div v-if="num === 0 || num === 1" :style="num === 1 ? 'width: 69px':''">
              <template v-if="spreadAddressShow()">
                <router-link :to="'/Spread'" class="spread-style" v-if ="num === 1">
                  <img
                    src="./../../../static/images/pc/promotion.svg"
                    alt=""
                  />
                </router-link>    
                <router-link :to="'/AddUser'" :class="{'addimg-style': num === 1}">
                  <img
                    src="./../../../static/images/pc/user-plus.png"
                    alt=""
                  />
                </router-link>
              </template>

              <template v-else-if="['group'].includes(activeName || hichatNav.type)">
                <router-link :to="'/AddGroup'">
                  <img
                    src="./../../../static/images/pc/message-plus.png"
                    alt=""
         
                  />
                </router-link>
              </template>
            </div>
          </div>
        </el-header>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <el-footer class="home-footer-nav">
          <div
            class="footer-nav-btn"
            v-for="(item, index) in routerNav"
            :key="index"
            @click="changeImg(index)"
          >
            <router-link :to="item.path">
              <span>
                <div class="el-badge-box" v-if="index === 1 && badgeNum !== 0">
                  <el-badge
                    :value="badgeNum"
                    class="item"
                  ></el-badge>
                </div>
                <div class="el-badge-box" v-if="index === 0 && maybeKnowNum !== 0">
                  <el-badge
                    :value="maybeKnowNum"
                    class="item"
                  ></el-badge>
                </div>
                <img :src="index !== num ? item.icon : item.active"
              /></span>
            </router-link>
          </div>
        </el-footer>
      </el-aside>
      <el-main>
        <template v-if="num === 1 && $route.name !== 'Spread'">
          <chat-msg
            v-if="
              hichatNav.type === 'address' && chatUser.type !== 'address' && Object.keys(chatUser).length !== 0 
            "
          />
          <chat-group-msg
            v-else-if="
              hichatNav.type === 'group' && groupUser.type !== 'address' && Object.keys(groupUser).length !== 0
            "
          />
          <chat-contact
            v-else-if="
              hichatNav.type === 'contact' &&
              contactUser.type !== 'address' && 
              Object.keys(contactUser).length !== 0
            "
          />
        </template>
        <template v-else-if="infoMsg.infoMsgShow && !infoMsg.infoMsgChat">
          <div class="go-room-style">
            <img src="./../../../static/images/msg-btn.png" alt="" />
            <el-button @click="goChatRoom(chatUser, activeName)"
              >開始聊天</el-button
            >
          </div>
        </template>
        <template v-else-if="$route.name === 'Spread'">
          <chat-spread/>
        </template>
      </el-main>
      <el-aside
        width="315px"
        style="overflow: hidden"
        v-if="infoMsg.infoMsgShow"
      >
        <msg-info-page />
      </el-aside>
    </el-container>
    <el-dialog
      :title="num === 1 ? '我的帐号' : '推廣連結'"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="100%"
      center
    >
      <template v-if="num === 2">
        <a
          :href="promoteCodeConfig.text"
          class="promote-href-text"
          target="_blank"
          >{{ promoteCodeConfig.text }}</a
        >
        <div class="promote-box-text">快来注册并下载嗨聊吧</div>
      </template>
      <div class="qrcode-box">
        <vue-qr
          ref="Qrcode"
          :correctLevel="3"
          :autoColor="false"
          colorDark="#333333"
          :text="num === 0 ? qrCodeConfig.text : promoteCodeConfig.text"
          :download="downloadFilename"
          :size="1000"
          :margin="0"
          :logoSrc="qrCodeConfig.logo"
          :logoCornerRadius="2"
          :logoMargin="1"
        ></vue-qr>
      </div>
      <span class="qrcode-box-text" v-if="num === 0"
        >嗨聊用户扫描此二维码后，可将您加入联络人！</span
      >
      <span
        slot="footer"
        class="dialog-footer"
        :style="num === 2 ? 'justify-content: center;' : ''"
      >
        <router-link :to="'/QRcode'" v-if="num === 0"
          ><img src="./../../../static/images/scan.png" alt=""
        /></router-link>
        <img src="./../../../static/images/share.svg" alt="" @click="copyUrl" />
        <img
          v-if="num === 0"
          src="./../../../static/images/download.png"
          alt=""
          @click="downloadImg"
        />
      </span>
    </el-dialog>
    <el-dialog
      title="登出"
      :visible.sync="logoutDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <span>确认要登出嗎？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="background-gray"
          style="border-right: 1px solid #efefef; border-raduis: 0"
          @click="logoutDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="loginOut">登出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import Socket from "@/utils/socket";
import AESBase64 from "@/utils/AESBase64.js";
import { urlCopy } from "@/utils/urlCopy.js";
import { getToken } from "_util/utils.js";
import { mapState, mapMutations } from "vuex";
import { logout } from "@/api";
import { getUserInfo } from "@/api/memberProfileController";
import { getContactList,maybeKnow } from "@/api/memberContactController";
import { listMember,getGroupList } from '@/api/groupController'
import { Encrypt } from "@/utils/AESUtils.js";
import { showIcon } from "@/utils/icon";
import ChatMsg from "./../Chat/ChatMsg.vue";
import ChatGroupMsg from "./../Chat/Chat.vue";
import ChatContact from "./../Chat/ChatContact.vue";
import ChatSpread from "./../Chat/ChatSpread.vue";
import MsgInfoPage from "./../ContactPage/MsgInfoPage.vue";
import { initGlobalState } from "@/store/ws.js";
import { UAParser } from 'ua-parser-js';
import { updateDeviceInfo } from "@/api";

let sent = false;

export default {
  name: "Home",
  data() {
    return {
      chatDataKey: {
        chatType:"CLI_AUTH",
        id:Math.random(),
        deviceId: localStorage.getItem('UUID'),
        token: localStorage.getItem('token'),
        tokenType: 0,
      },
      routerNav: [
        {
          icon: require("./../../../static/images/address.png"),
          active: require("./../../../static/images/address_hover.png"),
          path: "/Address",
          name: "通讯录",
        },
        {
          icon: require("./../../../static/images/chat.png"),
          active: require("./../../../static/images/chat_hover.png"),
          path: "/HiChat",
          name: "聊天",
        },
        {
          icon: require("./../../../static/images/setting.png"),
          active: require("./../../../static/images/setting_hover.png"),
          path: "/Setting",
          name: "设定",
        },
      ],
      qrCodeConfig: {
        text: `${location.origin}/fe/#/AddUser?username=${localStorage.getItem(
          "username"
        )}&id=${localStorage.getItem("id")}`,
        logo: require("./../../../static/images/material_ic_logo.png"),
      },
      promoteCodeConfig: {
        text: "",
        logo: require("./../../../static/images/material_ic_logo.png"),
      },
      userDefultIcon:require("./../../../static/images/image_user_defult.png"),
      num: 0,
      searchKey: "",
      groupList: [],
      searchData: [],
      recentChat: [],
      addressDataList: [],
      maybeKnowDataList:[],
      downloadFilename: "",
      logoutDialogShow: false,
      centerDialogVisible: false,
      device: localStorage.getItem("device"),

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",

      //推廣 key iv
      promoteKey: "142c7ec1b64ae0c6",
      promoteIv: "0000000000000000",
    };
  },
  created() {
    if (!Socket.isStartConnect()) {
      Socket.resetIsManualClose();
      Socket.connect();
    }
    if (!sent) {
      // send device info request
      this.sendDeviceInfo(this.device);
      sent = true;
    }
    this.num =
      this.$route.fullPath === "/Address"
        ? 0
        : ["/HiChat","/Spread"].includes(this.$route.fullPath)
        ? 1
        : 2;
    Socket.$on("message", this.handleGetMessage); 
    this.init()
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  watch: {
    hichatNav(val) {
      this.num = val.num;
    },
    searchKey(val) {
      const searchKeyData = val.split(" ");
      this.searchCase = []
      switch (this.activeName) {
        case "address":
          this.searchCase = this.addressDataList 
          break;
        case "group":
          this.searchCase = this.newGroupList 
          break;
        default:
          this.searchCase = this.maybeKnowDataList;
          break;
      }
      searchKeyData.forEach((el) => {
        this.searchData = this.searchCase.filter((item) => {
          if (this.activeName === "address") {
            return item.name.indexOf(el.replace("@", "")) !== -1;
          } else if(this.activeName === "group") {
            return item.groupName.indexOf(el.replace("@", "")) !== -1;
          } else {
            return item.nickname.indexOf(el.replace("@", "")) !== -1;
          }
        });
      });
      switch (this.activeName) {
        case "address":
          this.setMyContactDataList(this.searchData)
          break;
        case "group":
        this.setGroupList(this.searchData)
          break;
        default:
          this.setMaybeKnowList(this.searchData)
          break;
      }
    },
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      infoMsg: (state) => state.ws.infoMsg,
      chatUser: (state) => state.ws.chatUser,
      badgeNum: (state) => state.ws.badgeNum,
      maybeKnowNum: (state) => state.ws.maybeKnowNum,
      groupUser: (state) => state.ws.groupUser,
      hichatNav: (state) => state.ws.hichatNav,
      activeName: (state) => state.ws.activeName,
      contactUser: (state) => state.ws.contactUser,
      nofity: (state) => state.ws.nofity,
      soundNotify: (state) => state.ws.soundNotify,
      myContactDataList: (state) => state.ws.myContactDataList,
      groupMemberDataList: (state) => state.ws.groupMemberDataList,
    }),
  },
  methods: {
    ...mapMutations({
      setSoundNotify: "ws/setSoundNotify",
      setRecentChat:"ws/setRecentChat",
      setInfoMsg: "ws/setInfoMsg",
      setBadgeNum: "ws/setBadgeNum",
      setChatUser: "ws/setChatUser",
      setChatGroup: "ws/setChatGroup",
      setGroupList: "ws/setGroupList",
      setHichatNav: "ws/setHichatNav",
      setTopMsgShow: "ws/setTopMsgShow",
      setMyUserInfo: "ws/setMyUserInfo",
      setContactUser: "ws/setContactUser",
      setMaybeKnowList:"ws/setMaybeKnowList",
      setContactListData: "ws/setContactListData",
      setMyContactDataList: "ws/setMyContactDataList",
    }),
    spreadAddressShow(){
      const nav = [
        'address',
        'maybeKnow'
      ]
      const navFilter = nav.some((el) => el === (this.hichatNav.type || this.activeName))
      return navFilter
    },
    goChatRoom(data, type) {
      this.setInfoMsg({
        infoMsgShow: false,
        infoMsgNav: type === "address" ? "ContactPage" : "GroupPage",
      });
      this.setTopMsgShow(true);
      if (type === "address") {
        delete this.chatUser.type;
        this.setChatUser(this.chatUser);
      } else {
        delete this.groupUser.type;
        this.getGroupListMember(data);
        this.setChatGroup(this.groupUser);
      }
      this.setHichatNav({ type: type, num: 1 });
      this.$router.push({ name: "HiChat", params: data });
    },
    
    setNotify(){
      if (!localStorage.getItem("soundNotify")) {
        this.setSoundNotify(this.soundNotify);
      }
    },
    promoteCode(){
      this.promoteCodeConfig.text = `${
        location.origin
      }/pub/#/signUp?${encodeURIComponent(
        Encrypt(
          `agentId=${localStorage.getItem("id")}`,
          this.promoteKey,
          this.promoteIv
        )
      )}`;
    },
    init(){
      this.setNotify()
      this.promoteCode()
      this.getContactDataList();
      this.getGroupDataList()
      this.getMaybeKnow();
      this.getUserData();
    },
    //判斷是否base64
    isBase64(data) {
      return AESBase64(data, this.aesKey ,this.aesIv)
    },
    getContactDataList() {
      getContactList().then((res) => {
        let memberActivityData = []
        this.addressDataList = res.data.list;
        this.addressDataList.forEach((el) => {
          if (el.contactId === localStorage.getItem("id")) {
            el.name = "嗨聊记事本";
            el.icon = require("./../../../static/images/image_savemessage.png");
            el.toChatId = "u" + el.memberId;
          } else if (!el.icon) {
            el.icon = this.userDefultIcon
          }    
         memberActivityData.push(el.contactId)   
         this.setMyContactDataList(this.addressDataList) 
        });
      })
    },
    getGroupDataList(){
      getGroupList().then((res) => {
        this.groupList = res.data.list;
        this.newGroupList = this.groupList.filter((el)=> el.groupName)
        this.setGroupList(this.groupList);
      })
    },
    getMaybeKnow(){
      maybeKnow().then((res) => {
        this.maybeKnowDataList = res.data
      })
    },    
    getUserData() {
      getUserInfo().then((res) => {
        if(!res.data.icon){
          res.data.icon = this.userDefultIcon
        }
        this.qrCodeConfig.text = `${location.origin}/fe/#/AddUser?username=${res.data.username}&id=${res.data.id}`;
        this.setMyUserInfo(res.data);
      })
    },
    getGroupListMember() {
      let groupId = this.groupUser.toChatId.replace("g", "");
      listMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((item) => {
          if (!item.icon) {
            item.icon = this.userDefultIcon
          }
        });
        this.setContactListData(this.contactList);
      });
    },
    changeImg(index) {
      this.num = index;
      this.setInfoMsg({ infoMsgShow: false });
      this.setHichatNav({ type: this.hichatNav.type, num: this.num });
      this.getHistorySetTimeout();
    },
    getHistorySetTimeout() {
      setTimeout(() => this.$root.getHiChatDataList(), 2000);
    },
    copyUrl() {
      let url = this.num === 0? this.qrCodeConfig.text:this.promoteCodeConfig.text;
      urlCopy(url);
    },
    downloadImg() {
      const iconUrl = this.$refs.Qrcode.$el.src;
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = "二维码";
      a.href = iconUrl;
      a.dispatchEvent(event);
    },
    handleGetMessage(msg) {
      let joinChatKey = this.chatDataKey
      let msgInfo = JSON.parse(msg);
      let numNumber = 0;
      switch (msgInfo.chatType) {
        case "SRV_RECENT_CHAT":
          this.recentChat = msgInfo.recentChat;
          this.recentChat.forEach((item) => {
            numNumber += item.unreadCount;
            if (item.toChatId === this.chatUser.toChatId) {
              if (item.toChatId === item.forChatId) {
                item.name = "嗨聊记事本";
                item.username = "嗨聊记事本";
                item.icon = require("./../../../static/images/image_savemessage.png");
              } else {
                item.contactId = this.chatUser.contactId;
                item.username = this.chatUser.username;
              }
            }
            this.setRecentChat(this.recentChat)
            this.setBadgeNum(numNumber);
          });
          break;
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
          if (msgInfo.chat.fromChatId !== "u" + localStorage.getItem("id")) {
            let userNotificationData = this.recentChat.filter((list) =>{
              return list.toChatId === msgInfo.toChatId;
            })
            // 通知
            if(userNotificationData[0].setting || userNotificationData[0].setting.prompt){
              setTimeout(() => this.openNotify(msgInfo, msgInfo.chatType), 500);
            }
          }
          if (this.device === "mobile") {
            this.$root.getHiChatDataList();
          }
          break;
        // 连线失敗
        case "SRV_ERROR_MSG":
          if(msgInfo.text === "50002"){
            joinChatKey.chatType = "CLI_AUTH";
            joinChatKey.id = Math.random();
            Socket.send(joinChatKey);
          } else if (msgInfo.text === "30006") {
            this.$confirm("群組已解散, 是否继续?", "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              type: "danger",
              center: true,
            }).then(() => {
              this.$root.getHiChatDataList();
              this.setHichatNav({ type: "address", num: 1 });
              this.setChatGroup({});
            });
          }
          break;
        case "SRV_CHAT_DEL":
          this.$root.getHiChatDataList();
          break;
        case "SRV_EDIT_CONTACT":  
          this.getMaybeKnow();
          break  
        case  "SRV_GROUP_SETTING":
          this.getGroupDataList()
          break;  
      }
    },
    openNotify(msgInfo, chatType) {
      // 判断浏览器是否支持Notification
      if (!window.Notification) {
        this.$message({ message: "浏览器无法开启桌面通知", type: "error" });
      } else {
        // 检查用户曾经是否同意接受通知
        if (Notification.permission === "granted") {
          this.notifyMe(msgInfo, chatType); // 显示通知
        } else if (Notification.permission === "default") {
          // 用户还未选择，可以询问用户是否同意发送通知
          Notification.requestPermission(function (permission) {
            this.notifyMe(msgInfo, chatType); // 显示通知
          });
        } 
      }
    },
    noIconShow(iconData, key) {
      return showIcon(iconData, key)
    },
    notifyMe(msgInfo, chatType) {
      let notify = {
        name: "",
        icon: "",
        title: "",
        type: "",
      };
      this.recentChat.forEach((el) => {
        if (el.toChatId === msgInfo.toChatId) {
          if (el.isContact) {
            notify.icon = this.noIconShow(el,"user");
            notify.title = "(联络人)";
            notify.type = "address";
          } else if (el.isGroup) {
            notify.icon = this.noIconShow(el,"group");
            notify.title = "(群组)";
            notify.type = "group";
          } else if (!el.isBlock && !el.isContact && !el.isGroup) {
            notify.icon = this.noIconShow(el,"user");
            notify.title = "(陌生人)";
            notify.type = "contact";
          }
          notify.name = el.name;
        }
      });
      switch (chatType) {
        case "SRV_USER_SEND":
        case "SRV_GROUP_SEND":
          if(chatType === "SRV_GROUP_SEND"){
            for (let item in this.groupMemberDataList) {
              if(this.groupMemberDataList[item].groupId === Number(msgInfo.chat.toChatId.replace("g", ""))){
                const dictionary = this.isBase64(msgInfo.chat.text).split(" ")
                this.groupMemberDataList[item].memberList.forEach((name)=> {
                  const xIndex = dictionary.indexOf("@"+name.memberId + "\u200B")
                  if (xIndex > -1) {
                    dictionary.splice(xIndex, 1, "@" + name.name)
                  }
                });
                this.bodyMsg = dictionary.toString().replace(/,/g, " ")
              }
            } 
          }else{
            this.bodyMsg = msgInfo.chat.text;
          }    
          break;
        case "SRV_USER_IMAGE":
        case "SRV_GROUP_IMAGE":
          this.bodyMsg = "传送了图片";
          break;
        case "SRV_USER_AUDIO":
        case "SRV_GROUP_AUDIO":
          this.bodyMsg = "传送了语音";
          break;

      }
      // https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification#Parameters
      this.$notification.show(
        `${notify.name} ${notify.title}`,
        {
          dir: "rtl", //auto（自动）, ltr（从左到右）, or rtl（从右到左）
          lang: "zh", //指定通知中所使用的语言。这个字符串必须在 BCP 47 language tag 文档中是有效的。
          tag: msgInfo.toChatId, //赋予通知一个ID，以便在必要的时候对通知进行刷新、替换或移除。
          icon: notify.icon, //提示时候的图标
          body: this.isBase64(this.bodyMsg), // 一个图片的URL，将被用于显示通知的图标。
          data: msgInfo,
          renotify: true,
        },
        {
          onclick: (even) => {
            this.$router.push({ path: "/HiChat" });
            this.setHichatNav({ type: notify.type, num: 1 });
            this.notifyData = this.recentChat.filter((el) => {
              return el.toChatId === even.target.data.toChatId;
            });
            if (notify.type === "address") {
              this.setChatUser(this.notifyData[0]);
            } else if (notify.type === "contact") {
              this.setContactUser(this.notifyData[0]);
            } else if (notify.type === "group") {
              this.notifyData[0].icon = this.notifyData[0].icon;
              this.notifyData[0].groupName = this.notifyData[0].name;
              this.notifyData[0].groupId = this.notifyData[0].toChatId.replace(
                "g",
                ""
              );
              this.notifyData[0].memberId = JSON.parse(
                this.notifyData[0].forChatId.replace("u", "")
              );
              this.groupList.forEach((item) => {
                if (item.groupName === this.notifyData[0].groupName) {
                  return (this.notifyData[0].isAdmin = item.isAdmin);
                }
              });
              this.setChatGroup(this.notifyData[0]);
              this.getGroupListMember();
            }
            this.getHistorySetTimeout();
          },
        }
      );
    },
    loginOut() {
      logout()
        .then((res) => {
          if (res.code === 200 && res.message === "登出成功") {
            this.$router.push({ path: "/login" });
            const device = localStorage.getItem('device'); //remain device
            localStorage.clear();
            localStorage.setItem('device', device);
            initGlobalState()
            Socket.close(); // for [PC] Electron App
            window.location.reload(); // 于 Electron 应用时,会被停用
          }
        })
        .catch((err) => {
          return false;
        });
    },
    sendDeviceInfo(device) {
      const PWA_MODE = '(display-mode: standalone)';
      const isPWA = window.matchMedia(PWA_MODE).matches;
      const typeMaps = {
        pc: 8,
        mobile: 9,
        pwa_pc: 12,
        pwa_mobile: 14
      };

      let deviceType = 0;
      if (isPWA) {
        deviceType = device === 'pc' ? typeMaps.pwa_pc : typeMaps.pwa_mobile;
      } else {
        deviceType = device === 'pc' ? typeMaps.pc : typeMaps.mobile;
      }

      const parser = new UAParser();
      const deviceInfo = parser.getResult();
      const requestBody = {
        appVersion: !deviceInfo.browser.name ? '' : deviceInfo.browser.name, // 軟件版本
        deviceBrand: !deviceInfo.device.vendor ? '' : deviceInfo.device.vendor, // 裝置品牌
        deviceModel: !deviceInfo.device.model ? '' : deviceInfo.device.model, // 裝置型號
        deviceType: deviceType, // 登入类型: HAILIAO_WEB(8), HAILIAO_H5(9), HAILIAO_PC(10), HAILIAO_PWA(12), HAILIAO_PWA_H5(14);
        systemVersion: !deviceInfo.os.name ? '' : `${deviceInfo.os.name}_${deviceInfo.os.version}` // 系統版本
      };

      updateDeviceInfo(requestBody);
    },
  },
  components: {
    VueQr,
    ChatMsg,
    ChatGroupMsg,
    ChatContact,
    MsgInfoPage,
    ChatSpread,
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .el-container {
    ::v-deep.el-main {
      .el-header {
        .home-header {
          .QRcode-img {
            background-color: #fff;
            background-image: url("./../../../static/images/qrcode.png");
          }
          .promote-img {
            background-color: #fff;
            background-image: url("./../../../static/images/icon_share.png");
          }
          .broadcast-img{
            background-color: #fff;
            background-image: url("./../../../static/images/icon_promotion.png");
          }
      
          .address-img {
            background-color: #fff;
            background-image: url("./../../../static/images/add_user.png");
          }
          .hichat-img {
            background-color: #fff;
            background-image: url("./../../../static/images/add_chat.png");
          }
        }
      }
    }
  }
}
.el-dropdown-menu {
  .el-dropdown-menu__item {
    .logout-btn {
      display: flex;
      align-items: center;
      width: 12em;
      img {
        height: 1.5em;
      }
      span {
        margin-left: 0.3em;
        font-size: 16px;
        color: #EE5253;
        font-weight: 600;
        margin-top: 4px;
      }
    }
  }
}
.el-dialog-loginOut {
  ::v-deep.el-dialog__footer {
    padding: 0 !important;
    .el-button {
      padding: 20px !important;
      border-radius: 0 !important;
    }
  }
}
::v-deep .el-input__suffix {
  .el-icon-circle-close:before {
    content: "\e6db";
    font-size: 18px;
    color: #10686e;
  }
}
.el-badge-box {
  position: absolute;
  margin: -10px 0 0 20px;
}
.go-room-style {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  img {
    height: 8em;
    margin-bottom: 2.5em;
  }
  .el-button {
    color: #ffffff;
    padding: 1.3em 3em;
    background-color: #fe5f3f;
  }
}
.hichat-pc{
  .home-wrapper{
    .el-container{
      .home-search{
        .home-logo{
          width: 100%;
          display: flex;
          align-items: center;
          color: #FF6900;
          img{
            left: 0;
            height: 2.5em;
            margin-right: 10px;
          }
        }
        .spread-style{
          img{
            left: 7px;
            height:1.4em;
          }
        }
        .addimg-style{
          img{
            left: 13px;
          }
        }
      }
    }
  }
}
</style>
