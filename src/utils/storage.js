
const data = {
  'input':[],
  'history':[],
  'editReplay':[],
}
const storage = localStorage.getItem("storageData")
if(!storage){
  localStorage.setItem("storageData",JSON.stringify(data))
}
const storageData = JSON.parse(storage) || data 

/**
 * -放入Storage  
 */
export function setStorage(list,type) {
  const newArea = storageData[type].some(el => el.chatRoomId === list.chatRoomId)
  if(!newArea && list.data){
    storageData[type].push(list)
  } else{
    storageData[type].forEach(res=>{
      if(res.chatRoomId === list.chatRoomId){
        Object.assign(res,list)
      }
    })
  }
  localStorage.setItem('storageData',JSON.stringify(storageData))
}
/**
 * -獲取Storage
 */
export function getStorage(roomData,type) {
  const findStorage = storageData[type].find(item => item.chatRoomId === roomData.toChatId)
  if(findStorage) {
    if(type === 'input'){
      return findStorage.data
    }
    return findStorage
  } 
}
/**
 * -移除Storage
 */
export function removeStorage(roomData,type) {
  const removeStorage = storageData[type].filter(res => res.chatRoomId !== roomData.toChatId)
  storageData[type] = removeStorage
  localStorage.setItem('storageData',JSON.stringify(storageData))
}
