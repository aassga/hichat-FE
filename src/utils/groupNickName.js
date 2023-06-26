
//去除重复
export function showGroupNickname({group,myUserInfo,authorityGroupData}) {
  const groupUser = !group.groupNickname ? group.groupNumber : group.groupNickname
  const authority = 
    (authorityGroupData.showGroupNumber && authorityGroupData.editGroupNickname) ||
    (authorityGroupData.showGroupNumber && !authorityGroupData.editGroupNickname)
  const noAuthority = !authorityGroupData.showGroupNumber && !authorityGroupData.editGroupNickname
  if(authority){
    return groupUser
  } 
  return noAuthority ? myUserInfo.nickname : false
}