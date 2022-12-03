/**
 * 判断是否登录
 * @param {*} key  
 */
export function isLogin() {
  let user_info = getKey('user_info')
  return user_info != '' && user_info != undefined ? true : false
}
/**
 * 获取本地存储
 */
export const getKey = (key) => wx.getStorageSync(key)
export const setKey = (key, params) => wx.setStorageSync(key, params)
export const removeKey = (key) => wx.removeStorageSync(key)