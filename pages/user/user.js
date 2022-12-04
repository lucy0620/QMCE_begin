const app = getApp()
import * as utilStorage from '../../utils/storage'
import * as utilRoute from '../../utils/route'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    isIphoneX: app.globalData.isIphoneX,
    background: app.globalData.background,
    // 菜单列表
    menuList: [{
      title: '消息订阅',
      link: true,
      url: '/pages/user/msgManage/msgManage',
      auth: true,
      show: false
    }, {
      title: '意见反馈',
      link: true,
      url: '/pages/user/msgManage/msgManage',
      auth: true,
      show: true
    }, {
      title: '退出',
      link: true,
      show: app.globalData.user_info ? true : false
    }],
    user_info: ''
  },

  // 点击登录
  loginTap() {
    utilRoute.navigate(app.globalData.authorizeUrl)
  },
  // 点击菜单
  menuTap(e) {
    let item = e.currentTarget.dataset.item
    if (item.url) {
      if (item.auth) {
        app.handleIsLogin(function(){
          utilRoute.navigate(item.url)
        })
      }
    } else {
      if (item.title == '退出') {
        app.globalData.user_info = null;
        utilStorage.removeKey('user_info');
        this.onShow()
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user_info = app.globalData.user_info;
    let index = this.data.menuList.length - 1
    let menuList = `menuList[${index}].show`
    if (user_info) {
      this.setData({
        user_info,
        [menuList]: true
      })
    } else {
      this.setData({
        user_info,
        [menuList]: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})