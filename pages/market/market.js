const app = getApp()
import * as utilRoute from "../../utils/route"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    background: app.globalData.background,
    navbarData: {
      type: 2,
      search: {
        disabled: false,
        placeholder: '请输入搜索内容',
      }
    },
    cateList: [{
      name: '专业配送22222222'
    }, {
      name: '传统'
    }, {
      name: '传统'
    }, {
      name: '传统'
    }, {
      name: '传统'
    }, {
      name: '传统'
    }, {
      name: '传统'
    }, {
      name: '传统'
    }, {
      name: '传统'
    }, {
      name: '传统'
    }, {
      name: '传统'
    }, {
      name: '传统'
    }, {
      name: '传统5'
    }, {
      name: '传统'
    }, {
      name: '传统'
    }, {
      name: '传统2'
    }, {
      name: '传统3'
    }, {
      name: '传统4'
    }, {
      name: '传统5'
    }]

  },
  // 导航搜索
  search(e) {
    utilRoute.navigate('/pages/search/index?search=' + e.detail)
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