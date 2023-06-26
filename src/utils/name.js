
//整理名子 群組權限
export function nameTidy({ name,el,showGroupNumber,editGroupNickname }){
  let device = localStorage.getItem("device")
  if (showGroupNumber && editGroupNickname) {
    if (!el.groupNickname && !el.groupNumber) {
      return "未知成员";
    } else if (!el.groupNickname) {
      return el.groupNumber;
    } else {
      return el.groupNickname;
    }
  } else if (showGroupNumber && !editGroupNickname) {
    return name;
  } else if (!showGroupNumber && !editGroupNickname) {
    const num = device === "mobile" ? 20 : 10;
    return el.name.length > 20
    ? el.name.slice(0, num) + "..."
    : el.name;
  }
}
//整理名子 群組權限2
export function nameTidy2({ name,el,showGroupNumber,editGroupNickname }){
  if (showGroupNumber && editGroupNickname) {
    if (!el.fromChatGroupNickname && !el.fromChatGroupNumber) {
      return "未知成员";
    } else if (!el.fromChatGroupNickname) {
      return "成员" + el.fromChatGroupNumber;
    } else {
      return el.fromChatGroupNickname;
    }
  } else if (showGroupNumber && !editGroupNickname) {
    return name;
  } else if (!showGroupNumber && !editGroupNickname) {
    return el.fromChatNickname;
  }
}