const app = getApp();
import * as utilShow from '../../utils/show'
import * as utilRoute from '../../utils/route'
import * as utilStorage from '../../utils/storage'
Page({
  data: {
    app,
    background: app.globalData.background,
    navbarData: {
      type: 1,
      title: '授权登录',
      return: true,
      home: true
    },
    isGetPhone: false, // 是否需要获取手机号码
  },

  backPage() {
    utilRoute.back()
  },

  /**
   * 授权登录
   * (不要纠结为什么不直接根据唯一标识拿到用户信息，因为只有按钮有能力获取微信授权信息。
   * 为了避免用户未注册的时候需要再次调F用，索性直接调用微信接口先获取授权信息)
   */
  getUserProfile() {
    let that = this
    // 获取用户头像昵称信息
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: (userProfileRes) => {
        that.getUserInfo(JSON.parse(userProfileRes.rawData))
      },
      fail: () => {
        //用户按了拒绝按钮
        utilShow.showMyModal('您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。', '警告通知', false, {
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userInfo"]) { //如果用户重新同意了授权登录
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  getUserInfo(rawData) {
    let that = this;
    // 获取code
    wx.login({
      success: (loginRes) => {
        // 获取用户唯一标识openId和授权凭证session_key
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appId: app.globalData.appId,
            secret: app.globalData.appSecret,
            js_code: loginRes.code,
            grant_type: 'authorization_code',
          },
          success: (openidRes) => {
            let {
              openid, // 唯一标识
              session_key // 授权凭证 5min刷新一次 不知道干啥用先放这吧
            } = openidRes.data
            let data = {
              nickName: rawData.nickName,
              avatarUrl: rawData.avatarUrl,
              openid,
            }
            // 请求后台获取用户信息
            wx.request({
              url: app.globalData.baseUrl + '/getUserInfo',
              data,
              success: (res) => {
                that.setData({
                  user_info: res.data.user_info
                })
                utilStorage.setKey('user_info', res.data.user_info)
                app.globalData.user_info = res.data.user_info
                // 先不做手机号授权了，登录完成直接返回吧
                that.backPage()
                // 这个用户没绑手机号 todo
                if (!res.data.user_info.phone) {
                  that.setData({
                    isGetPhone: true
                  })
                }
              }
            })
          }
        })
      },
    })
  },
  /**
   * 授权手机号
   */
  getPhoneNumber(e) {
    utilShow.showMyMsg('暂未开放')
    return
    let code = e.detail.code
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/business/getuserphonenumber',
      data: {
        code,
        access_token: '',
      },
    })
  },

  /**
   * 获取手机号
   * @param {} e 微信返回的用户手机号信息
   */
  getPhoneNumber2(e) {
    var that = this;
    if (e.detail.encryptedData != undefined && e.detail.encryptedData != '') {
      //再重新调用微信登录接口
      wx.login({
        success(res) {
          if (res.code) {
            let data = {
              appId: app.globalData.appid,
              code: res.code,
              signature: app.globalData.signature,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            };
            // 根据appId获取用户微信绑定手机号
            getPhoneThirdParty(data).then(rep => {
              if (rep.data.status == 0 && rep.data.data != undefined && rep.data.data.phoneNumber != undefined && rep.data.data.phoneNumber != null && rep.data.data.phoneNumber != "") {
                app.globalData.phone = rep.data.data.phoneNumber
                //之前存的入参重组入参
                let getInfoDataSend = that.data.getInfoDataSend;
                let data = {
                  phone: that.data.phone,
                  appid: app.globalData.appid,
                  str: getInfoDataSend.str,
                  signature: getInfoDataSend.signature,
                  rawData: getInfoDataSend.rawData,
                  encryptedData: getInfoDataSend.encryptedData,
                  iv: getInfoDataSend.iv
                };
                // 调用再保存 用户信息接口V2  会重新拿到uuid
                saveInfoThirdPartyV2(data).then(rep => {
                  if (rep.data.status == 0) {
                    // // 处理uuid 和token
                    that.getAuthorInfoUnifiedOperation(rep);
                  } else {
                    utilShow.showMyMsg(rep.data.errorMsg);
                  }
                }).catch(rep => {
                  utilShow.showMyMsg('绑定手机号出错，稍后重试');
                })
              } else {
                utilShow.showMyMsg('没有获取到手机号，请再次点击获取');
              }
            })
          }
        }
      })
    }
  }
})