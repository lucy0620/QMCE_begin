const app = getApp();
Component({

  /**
   * 使用全局样式
   */
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 是否关闭数据包
     */
    isClosePackets: {
      type: Boolean,
      value: true,
    },
    /**
     * 开启数据包情况下，跳转的页面
     */
    msgUrl: {
      type: String,
      value: '/pages/chatPages/chatList/index'
    },
    /**
     * 消息数量
     */
    newsCount: {
      type: Number,
      value: 0,
    },
    icon: {
      type: String,
      value: 'messagefill'
    },
    // 聊天模板id
    chatTemplateList: {
      type: Array,
      value: ['32m_cPKwYNc39wpd8iQIiO47Vs1JHr3c1YSdCRyIAvs']
    },
    // 订阅的模板id
    templateIds: {
      type: Array,
      value: wx.getStorageSync('templateIds')
    },
    //距离底部初始位置
    bottom: {
      type: String,
      value: '100px'
    }
  },

  /**
   * 组件监听属性
   */
  observers: {
    newsCount: function (val) {
      if (val > 0 && !this.data.isClosePackets) {
        this.init()
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  lifetimes: {
    attached() {
      if(!this.data.isClosePackets){
        this.init()
      }
    },
    detached() {},
  },

  /**
   * 组件的初始数据
   */
  data: {
    // tempavaUrlman: app.globalData.imgStockUrl + '/boyactive.png',
    // tempavaUrlwman: app.globalData.imgStockUrl + '/girlActive.png',
    globalColor: '#FD7055',
    homeActive: false, // 是否开启动画
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //移动事件
    setTouchMove: function (e) {
      var that = this;
      if (e.touches[0].clientY < 545 && e.touches[0].clientY > 66) {
        that.setData({
          top: e.touches[0].clientY
        })
      }
    },
    /**
     * 初始化动画效果
     */
    init: function () {
      let that = this;
      if (that.properties.newsCount > 0) {
        const innerAudioContext = wx.createInnerAudioContext(); //新建一个createInnerAudioContext();
        innerAudioContext.autoplay = true; //音频自动播放设置
        innerAudioContext.src = app.globalData.mp3Url + 'wechat-tip.mp3'; //链接到音频的地址
        innerAudioContext.onPlay(() => {
          setTimeout(() => {
            innerAudioContext.onStop()
          }, 3000);
        }); //播放音效
        innerAudioContext.onError((res) => { //打印错误
          console.log(res.errMsg); //错误信息
          console.log(res.errCode); //错误码
        })
        that.setData({
          homeActive: true
        })
        setTimeout(() => {
          that.setData({
            homeActive: false
          })
        }, 4000);
      }
    },
    //点击咨询 
    clickOk: function () {
      if(this.data.isClosePackets){
        this.triggerEvent('onClick')
        return
      }
      // 先授权接收订阅消息
      let templateIds = this.data.templateIds
      let filterList = templateIds.filter(v => this.data.chatTemplateList.includes(v))
      console.log('过滤后的数组 = ', filterList);
      this.subscribeMessage(filterList);
      wx.navigateTo({
        url: this.data.msgUrl
      })
    },
    /**
     * 微信小程序订阅消息
     */
    subscribeMessage(templateList, callback) {
      let that = this;
      if (templateList.length === 0) {
        if (callback) callback()
      } else {
        wx.requestSubscribeMessage({
          tmplIds: templateList,
          success(res) {
            console.log("订阅成功：" + JSON.stringify(res))
            setTimeout(() => {
              if (callback) callback()
            }, 500);
          },
          fail(err) {
            console.log("订阅失败：" + JSON.stringify(err))
            if (err.errMsg === 'requestSubscribeMessage:fail can only be invoked by user TAP gesture.') {
              wx.showModal({
                title: '消息订阅',
                content: '为了更好的通知您,请务必订阅消息推送',
                confirmText: "同意",
                cancelText: "拒绝",
                success: function (res) {
                  if (res.confirm) {
                    //调用订阅消息
                    console.log('用户点击确定');
                    //调用订阅
                    that.subscribeMessage(templateList);
                  } else if (res.cancel) {
                    console.log('用户点击取消');
                    ///显示第二个弹说明一下
                    wx.showModal({
                      title: '温馨提示',
                      content: '拒绝后,您将不会收到消息',
                      confirmText: "知道了",
                      showCancel: false,
                      success: function (res) {
                        ///点击知道了的后续操作 
                        ///如跳转首页面 
                      }
                    });
                  }
                }
              });
            }
          }
        })
      }
    },
  }
})