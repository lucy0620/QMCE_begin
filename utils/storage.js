/**
 * 判断是否需要登录
 * @param {*} key  
 */
export function isLogin(key){
  let uuid = getKey(key)
  return uuid != '' && uuid != undefined ? true : false
}
/**
 * 获取本地存储
 */
export const getKey = (key) => wx.getStorageSync(key)
export const setKey = (key,params) => wx.setStorageSync(key, params)
export const removeKey = (key) => wx.removeStorageSync(key)
