const app = getApp();
import * as utilShow from '../../utils/show'
import * as utilRoute from '../../utils/route'

import {
  loginThirdPartyV2, // 获取获取授权信息
  getPhoneThirdParty, //  根据appId获取用户微信绑定手机号
  saveInfoThirdPartyV2, // 保存新的用户信息V2有返回接口
  getInfo, // 获取用户信息
} from '../../api/api'

Page({
  data: {
    app,
    isGetPhone: false, // 是否需要获取手机号码
    getInfoDataSend: "", //saveInfoThirdPartyV2 要的GetInfo参数
  },
  cancelGetUserInfo: function () {
    utilRoute.back()
  },
  /**
   * 授权登录
   */
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: (userProfileRes) => {
        let {
          rawData, //不包括敏感信息的原始数据字符串，用于计算签名
          signature, //使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息
          encryptedData, //包括敏感数据在内的完整用户信息的加密数据
          iv, //加密算法的初始向量
        } = userProfileRes;
        let that = this;
        wx.login({
          success(res) {
            if (res.code && rawData) {
              app.globalData.signature = signature
              app.globalData.rawData = rawData
              let data = {
                appid: app.globalData.appid,
                code: res.code,
              };
              loginThirdPartyV2(data).then(rep => {
                // 用户 已经 绑定手机号在本系统中
                if (rep.data.status == 0) {
                  that.getAuthorInfoUnifiedOperation(rep);
                }
                // 用户 没有 绑定手机号在本系统中
                else if (rep.data.status == -1) {
                  //  需要授权手机号
                  that.setData({
                    isGetPhone: true
                  })
                  // 把请求数据入参存到data里面
                  that.setData({
                    getInfoDataSend: {
                      str: rep.data.errorMsg,
                      signature: signature,
                      rawData: rawData,
                      encryptedData: encryptedData,
                      iv: iv
                    }
                  })
                } else {
                  utilShow.showMyMsg("接口出错");
                }
              }).catch(res => {
                utilShow.showMyMsg("授权出错！");
              })
            }
          }
        })
      },
      fail: (err) => {
        //用户按了拒绝按钮
        utilShow.showMyModal('您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。','警告通知',false,{
					success:(res)=>{
						if(res.confirm){
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
  /**
   *  返回  uuid refreshToken 刷新令牌(用于换取新的token) authorization token(2小时过期)
   */
  getAuthorInfoUnifiedOperation: function (rep) {
    let that = this;
    if (rep.data.data.refreshToken != null && rep.data.data.refreshToken != "") {
      app.globalData.refreshToken = rep.data.data.refreshToken
    }
    if (rep.data.data.authorization != null && rep.data.data.authorization != "") {
      app.globalData.authorization = rep.data.data.authorization
    }
    if (rep.data.data.uuid != null && rep.data.data.uuid != "") {
      app.globalData.uuid = rep.data.data.uuid
      // 获取登陆用户信息
      that.getUserInfo();
    }
  },
    /**
   * 获取用户信息
   */
  getUserInfo() {
    let that = this;
    getInfo().then(res => {
      if (res.data.status === 0) {
        app.globalData.userInfo = that.data.userInfo
      }
    })
  },
  /**
   * 获取手机号
   * @param {} e 微信返回的用户手机号信息
   */
  getPhoneNumber(e) {
    var that = this;
    if (e.detail.encryptedData != undefined) {
      //再重新调用微信登录接口
      wx.login({
        success(res) {
          if (res.code) {
            if (e.detail.encryptedData != '') {
              let data = {
                appId: app.globalData.appid,
                code: res.code,
                signature: app.globalData.signature,
                rawData: app.globalData.rawData,
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
        }
      })
    }
  }
})