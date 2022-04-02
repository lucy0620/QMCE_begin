// components/appMsgL/index.js
Component({
  
  /**
   * 组件的属性列表
   */
  properties: {

    //获取配置开关
    getConfigStatus: {
      type: Function,
      value: null
    },
    //获取配置列表
    getConfigList: {
      type: Function,
      value: null
    },
    //更改配置开关
    setConfigStatus: {
      type: Function,
      value: null
    },
    //新增订阅次数
    setRecord: {
      type: Function,
      value: null
    },
    // 请求携带其他参数
    params: {
      type: Object,
      value: null
    }
  },
  lifetimes: {
    attached( ) {
      let that = this
      // 获取模板消息列表
      let params = that.data.params
      that.data.getConfigList(params).then(res => {
        if (res.data.status === 0) {
          console.log('获取的模板消息列表 = ', res.data.data);
          let templateIds = res.data.data;
          that.setData({
            _templateIds: templateIds
          })
        }
      })
      // 获取消息通知开关
      that.data.getConfigStatus().then(res => {
        if (res.data.status === 0) {
          let status = res.data.data.isOpenSubscribe
          that.setData({
            _isOpen: status == 1 ? true : false
          })
        }
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _isOpen: true, // 控制订阅消息通知开关
    _templateIds: [] // 后台返回的订阅消息列表
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 刷新模板消息列表
    getConfigRefresh() {
      let that = this
      let params = that.data.params
      that.data.getConfigList(params).then(res => {
        wx.showToast({
          title: '订阅次数+1成功',
          icon: 'none'
        })
        if (res.data.status === 0) {
          console.log('获取的模板id = ', res.data.data);
          let templateIds = res.data.data;
          that.setData({
            _templateIds: templateIds
          })
        }
      })
    },
    // 订阅消息通知开关
    change(e) {
      let that = this
      let status = e.detail.value 
      // 当用户打开开关时，判断授权是否设置
      if(status == true) {
        // 获取设置信息
        wx.getSetting({
          withSubscriptions: true,
          success:function(res) {
            console.log('getSetting',res)
            // 获取订阅消息的状态
            let isOpen = res.subscriptionsSetting.mainSwitch
            if (isOpen == false) {
              // 提示用户去开启授权
              wx.showModal({
                content: '检测到您尚未开启订阅消息授权，请在小程序设置中开启授权',
                success: (res) => {
                  if(res.confirm) {
                    wx.openSetting({
                      withSubscriptions: true,
                      success : (res)=>{
                        console.log('openSetting',res)
                        // 从设置页面返回
                        wx.getSetting({
                          withSubscriptions: true,
                          success:function(res) {
                            // 获取订阅消息的授权状态
                            let isOpen = res.subscriptionsSetting.mainSwitch
                            // 用户设置授权了
                            if(isOpen) {
                              // 发送给后台
                              that.changeStatus(true,function(bol){
                                if(bol) {
                                  wx.showToast({
                                    title: '您已开启订阅消息通知',
                                    icon:'none'
                                  })
                                  that.setData({
                                    _isOpen: status
                                  })
                                } else {
                                  wx.showToast({
                                    title: '更改失败！',
                                    icon:'none'
                                  })
                                  that.setData({
                                    _isOpen: !status
                                  })
                                }
                              })
                              
                            } else { // 用户设置未授权
                              that.setData({
                                _isOpen: !status
                              })
                              wx.showToast({
                                title: '开启订阅消息通知失败，请在设置中开启授权',
                                icon:'none'
                              })
                            }
                          }
                        })
                      }
                    })
                  }
                  if( res.cancel) {
                    that.setData({
                      _isOpen: !status
                    })
                    wx.showToast({
                      title: '开启订阅消息通知失败',
                      icon:'none'
                    })
                  }
                }
              })
              
            } else {
              // 发送给后台
              that.changeStatus(false,function(bol){
                if(bol) {
                  that.setData({
                    _isOpen: status
                  })
                  wx.showToast({
                    title: '您已开启订阅消息通知',
                    icon:'none'
                  })
                } else {
                  that.setData({
                    _isOpen: !status
                  })
                  wx.showToast({
                    title: '关闭失败！',
                    icon:'none'
                  })
                }
              })
              
            }
          }
        })
      } else {
        // 发送给后台
        that.changeStatus(false,function(bol){
          if(bol) {
            that.setData({
              _isOpen: status
            })
            wx.showToast({
              title: '您已关闭订阅消息通知',
              icon:'none'
            })
          } else {
            that.setData({
              _isOpen: !status
            })
            wx.showToast({
              title: '关闭失败！',
              icon:'none'
            })
          }
        })
        
      }
    },
    // 修改订阅信息开关
    changeStatus(bol,callBack) {
      let params = {
        isOpenSubscribe: bol == true ? 1 : 0,
      }
      this.data.setConfigStatus(params).then(res => {
        if (res.data.status === 0) {
          callBack(true)
        } else {
          callBack(false)
        }
      })
    },
    // 点击单项订阅
    book(e) {
      console.log(e)
      let id = [e.currentTarget.dataset.item.priTmplId]
      this.reqMsg(id)
    },
    /**
     * 通过id调用消息订阅
     * @param {*} 消息模板数组
     */
    reqMsg(id) {
      let that = this
      let idStr = id[0]
      wx.requestSubscribeMessage({
        tmplIds: id,
        success: (res) => {
          console.log("res消息", res)
          // 先判断相关授权是否开启
          that.getIdSetting(idStr,function(isOpen,str){
            // 相关授权开启
            if(isOpen) {
              // 用户点击了取消
              if(res[idStr] === 'reject') {
                wx.showToast({
                  title: '取消本次操作',
                  icon: 'none'
                })
              } else {
                // 用户点击了授权 或 用户曾点了总是 --> 次数+1
                that.saveRecord(idStr)
              }
            } else {
              // 引导开启相关授权
              that.auth('检测到尚未授权该项消息订阅');
            }
          })

        },
        fail(err) {
          //失败
          console.error('err = ',err);
          // 微信授权总开关未开启
          if(err.errCode === 20004) {
            that.auth('检测到尚未授权消息订阅')
          } else if (err.errMsg == "requestSubscribeMessage:fail last call has not ended") {
            wx.showToast({
              title: '请勿频繁点击',
              icon: 'error'
            })
          } else {
            wx.showToast({
              title: '订阅失败',
              icon: 'error'
            })
            console.log('订阅失败,错误码 = ',err.errCode)
          }
        }
      })
    },
    
    
    /**
     * 保存订阅记录
     */
    saveRecord(idStr){
      let that = this
      let params = [{
        ...that.data.params,
        priTmplId: idStr,
        status: 0
      }]
      that.data.setRecord(params).then(res => {
        if (res.data.status === 0) {
          // getConfigRefresh发送请求中的hideloding会覆盖showToast所以提示放在下次请求
          that.getConfigRefresh()
        } else {
          wx.showToast({
            title: '服务器繁忙',
            icon: 'error'
          })
          console.log('后台错误 = ',res.data.errorMsg)
        }
      })
    },

    /**
     * 传入模板id 判断是否授权了该项的接收
     */
    getIdSetting (id,callBack) {
      wx.getSetting({
        withSubscriptions: true,
        success:function(res) {
          // 用户是否设置该项订阅 总是
          if(res.subscriptionsSetting.hasOwnProperty(id)){
            // 用户设置了该订阅项 总是，且关闭了设置授权
            if(res.subscriptionsSetting[id] == "reject") {
              callBack(false)
            } else {
              callBack(true)
            }
          } else {
            callBack(true)
          }
        }
      })
    },
    /**
     * 引导用户打开设置授权
     */
    auth(tipMsg) {
      wx.showModal({
        title: '消息订阅',
        content: tipMsg + '，是否去开启？(注意: 在通知管理里面打开接受通知,并且接受才能收到消息)',
        confirmText: "去开启",
        cancelText: "不开启",
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
            })
          } else if (res.cancel) {
            ///显示第二个弹说明一下
            wx.showModal({
              title: '温馨提示',
              content: '拒绝后,您将不会收到消息推送',
              confirmText: "知道了",
              showCancel: false,
              success: function (res) {
              }
            });
          }
        }
      });
      
    },

  }
})
