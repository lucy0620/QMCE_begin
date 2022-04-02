const app = getApp()
import * as utilShow from '../../utils/show'
import * as utilRoute from '../../utils/route'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    background: app.globalData.background,
    // 菜单列表
    menuList: [{
      id: 1,
      title: '消息订阅',
      link: true,
      url: '/pages/user/msgManage/index',
      auth: true
    },{
      id: 2,
      title: '退出',
      link: true
    }],
    // user数据
    user: {}

  },
  // 点击菜单
  menuTap(e) {
    let item = e.currentTarget.dataset.item
    if ( item.url) {
      if( item.auth) {
        if ( this.data.user.uuid) {
          utilRoute.navigate( item.url)
        } else {
        }
      }
    }
  },
  // 点击登录
  loginTap() {
    let user = {
      nickname: '喵喵',
      avatar: '/static/user/userImg.png',
      uuid: 1
    }
    this.setData({
      user: user
    })
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