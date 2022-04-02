// app.js
App({
  
  globalData: {
    //页面配置
    indexUrl: '/pages/index/index',
    authorizeUrl: '/pages/authorize/index',

    // mp3链接地址
    mp3Url: 'https://mall.gzpgkj.cn/mp3/',

    appid: '',
    isIphoneX: false,
    background: '#C9D6FF',
    navHeight: '',
    
    //根据appid请求findAppletBaseInfo获得
    applet: {
      appletHeadImage: '',
      appletName: '测试小程序'
    },
    //用户信息
    signature:'',//登录签名
    rawData:'',//微信用户数据
    refreshToken:'',//用于换取新的token
    authorization:'',//作为header中的参数
    uuid:'',
    userInfo: null,
    phone: ''
    
  },

  onLaunch() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        // 导航高度
        that.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 97;
        // 根据手机类型来判断是否是 iphone
        let modelmes = res.model
        if(modelmes.search('iPhone') != -1) {
          // 根据手机屏幕来判断是否是 iphone x 以上 x及以上的异形屏top为44，非异形屏为20
          if(res.safeArea.top > 20) {
            that.globalData.isIphoneX = true;
          }
        }
      }
    })

  },

  
})
