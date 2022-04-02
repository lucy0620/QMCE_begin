const API_HOST = 'https://mall.chengdan.pro/gateway/';
const app = getApp();
/**
 * 封装请求统一格式
 * @param {*} method 请求头
 * @param {*} url 请求url
 * @param {*} params 请求参数
 * @param {*} contentType 请求头类型
 */
function requestPromise(method, url, params, contentType) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    wx.request({
      url: API_HOST + url,
      method: method,
      data: params,
      header: {
        'Authorization': wx.getStorageSync('token'),
        'uuid': wx.getStorageSync('uuid'),
        'Content-type': contentType,
        'appid': app.globalData.appid
      },
      success(res) {
        let refreshToken = wx.getStorageSync('refreshToken');
        let isRefreshToken = wx.getStorageSync('isRefreshToken')
        if (res.data.status == 401 && refreshToken && (isRefreshToken == '' && !isRefreshToken)) {
          wx.setStorageSync('isRefreshToken', true)
          wx.request({
            url: API_HOST + `wechat/wx/user/${app.globalData.appid}/refreshToken/${refreshToken}?clientType=11`,
            method: 'get',
            header: {
              'Authorization': wx.getStorageSync('token'),
              'uuid': wx.getStorageSync('uuid'),
              'appid': app.globalData.appid
            },
            success(req) {
              // 用户 已经 绑定手机号在本系统中
              if (req.data.status == 0) {
                wx.setStorageSync('refreshToken', req.data.data.refreshToken);
                wx.setStorageSync('token', req.data.data.authorization);
                wx.setStorageSync('uuid', req.data.data.uuid);
                wx.request({
                  url: API_HOST + url,
                  method: method,
                  data: params,
                  header: {
                    'Authorization': wx.getStorageSync('token'),
                    'uuid': wx.getStorageSync('uuid'),
                    'Content-type': contentType,
                    'appid': app.globalData.appid
                  },
                  success(res) {
                    if (res.data.status == 0) {
                      resolve(res)
                      wx.hideLoading();
                    }
                  }
                })
              } else { // refreshToken 失效
                wx.setStorageSync('isRefreshToken', true);
                // 清空对应的数据
                wx.setStorageSync('uuid', '')
                wx.setStorageSync('userInfo', '')
                wx.setStorageSync('shop', '')
                wx.setStorageSync('phone', '')
                wx.hideLoading();
              }
            }
          })
        } else if (res.data.errorMsg == "答案错误!" && res.data.status !== 0 && res.data.status !== 401) { // 显示接口抛错信息
          wx.showLoading({
            title: res.data.errorMsg,
            mask: true,
          });
          setTimeout(() => {
            wx.hideLoading();
          }, 2000);
        } else if (res.data.status !== 0) {
          wx.hideLoading();
          let isRefreshToken = wx.getStorageSync('isRefreshToken')
          resolve(res);
          if (wx.getStorageSync('phone') && wx.getStorageSync('phone') != -1 && !isRefreshToken && res.data.errorMsg != '未授权') {

          }
        } else {
          wx.hideLoading();
          resolve(res);
        }
      },
      fail(err) {
        reject(err);
      },
      complete(com) {
      }
    })
    // }
  })

}

//请求
const requestApi = (method, url, params, contentType = 'application/json') => {
  return requestPromise(method, url, params, contentType);
}

module.exports = {
  requestApi
}