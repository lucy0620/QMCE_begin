// app.js
import * as utilStorage from './utils/storage'
import * as utilRoute from './utils/route'
App({

  globalData: {
    /* 页面配置 */
    indexUrl: '/pages/index/index', // 首页路径：用于导航中的回到首页按钮
    authorizeUrl: '/pages/authorize/authorize', // 登录页：用于未登录时的跳转页
    searchUrl: '/pages/search/search', // 搜索页：用于点击假搜索框的跳转

    /* 本地配置 */
    appId: 'wx78d9e0fee4fe52f5',
    appSecret: '310f942962c3668ee77d09ed51e70716',
    applet: { // 小程序名称和图片
      appletName: '叁仟院',
      appletHeadImage: '/static/appletHeadImage.jpg'
    },
    isIphoneX: false, // 是否为苹果X以上：用于设置底部安全距离
    background: '#C9D6FF', // 主题色：用于很多组件颜色配置
    navHeight: '', // 导航高度：用于自定义顶部导航
    /* 请求地址 */
    mp3Url: 'https://mall.gzpgkj.cn/mp3/', // mp3链接地址
    baseUrl: 'http://localhost:7890', // 服务器
    /* 用户信息 */
    user_info: null,
    phone: '',
  },

  onLaunch() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        /* 本地配置 */
        // 导航高度
        that.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 97;
        let modelmes = res.model
        if (modelmes.search('iPhone') != -1) { // 根据手机类型来判断是否是 iphone
          if (res.safeArea.top > 20) { // 根据手机屏幕来判断是否是 iphone x 以上 x及以上的异形屏top为44，非异形屏为20
            that.globalData.isIphoneX = true;
          }
        }
        /* 用户信息 */
        if (utilStorage.isLogin('user_info')) {
          that.globalData.user_info = utilStorage.getKey('user_info')
        }
      }
    })
  },

  /**
   * 是否已经登录
   * 已登录 执行回调
   * 未登录 跳转到授权登录页
   */
  isLoginHandle(callback) {
    if (this.globalData.user_info) {
      callback
    } else {
      utilRoute.navigate(this.globalData.authorizeUrl)
    }
  }
})