
//去除重复
export function filterCountry(list){
  if(list.countryCode === "other"){
    return "其他"
  }
  return "+" + list.countryCode
}