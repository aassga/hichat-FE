
//去除重复
export function showIcon(iconData,key) {
  if (!iconData.icon) {
    return require(`./../../static/images/image_${key}_defult.png`);
  } else {
    return iconData.icon;
  } 
}

export function groupIcon(el , { groupUser , authority , authorityGroupData }) {
  let icon = ""
  if(!el.icon){
    icon = require("./../../static/images/image_user_defult.png")
  } else{
    icon = el.icon;
  }
  const iconHide = require("./../../static/images/user_photo_hide.png");
  const isAdmin = groupUser.isAdmin;
  const isMangerGroup = groupUser.isManager && ( authority.checkUserInfo || authorityGroupData.checkUserInfo);
  const isAuthorityGroup = authorityGroupData.checkUserInfo;

  if(isAdmin || isMangerGroup || isAuthorityGroup ){
    return icon;
  }
  return iconHide
}

//去除重复
export function showServiceIcon(item) {
  let myInfo = JSON.parse(localStorage.getItem("myUserInfo"))
  return item.isCustomerService && (Number(item.contactId) !== myInfo.id)
}