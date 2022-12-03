/**
 * 导入本地地址
 */
export function getWxAddress(callBack) {
  wx.authorize({
    scope: 'scope.address',
    success: function (res) {
      // 打开地址选择
      wx.chooseAddress({
        // 选择完毕
        success: function (res) {
          callBack(res)
        },
        fail: function (res) {},
      })
    },
    fail: function (res) {},
    complete: function (res) {},
  })
}


/**
 * 获取当前位置
 */
export function getLocation(callBack) {
  // 请求用户授权获取地址
  wx.getLocation({
    type: 'gcj02',
    // 用户点了允许
    success: function (res) {
      callBack(res)
    },
    // 用户点了拒绝或者曾经拒绝
    fail: function (res) {
      if (res.errMsg == 'getLocation:fail auth deny') {
        // 弹窗是否再次授权
        wx.showModal({
          title: '',
          content: '请在小程序设置中授权位置',
          success: function (res) {
            if (res.cancel) {} else if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  if (res.authSetting["scope.userLocation"] == true) {
                    console.log('用户打开设置同意了位置授权')
                    wx.getLocation({
                      type: 'gcj02',
                      success: function (res) {
                        callBack(res)
                      }
                    })
                  } else {
                    console.log('用户打开设置又返回了')
                  }
                }
              })
            }
          }
        })
      } else if (res.errMsg == 'getLocation:fail 频繁调用会增加电量损耗，可考虑使用 wx.onLocationChange 监听地理位置变化') {
        wx.showToast({
          title: '请勿频繁定位',
          icon: 'error'
        })
      }
    }
  })
}