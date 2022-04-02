// component/tabbar/tabbar.js
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    active: {
      type: Number,
      value: 0,
    },
    activeColor: {
      type: String,
      value: 'red'
    },
    isIphoneX: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    tabBar: [
      {
        "iconName": 'cuIcon-home',
        "pagePath": "/pages/index/index",
        "text": "首页",
      },
      {
        "iconName": 'cuIcon-shop',
        "pagePath": "/pages/market/index",
        "text": "超市",
      },
      {
        "iconName": 'cuIcon-vip',
        "pagePath": "/pages/user/index",
        "text": "我的",
      }
    ]
  },
  lifetimes: {
    attached: function () {
      // 隐藏原生tabbar
      wx.hideTabBar();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    navigateDetail: function (e) {
      wx.switchTab({ // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
        url: e.currentTarget.dataset.url
      })
    }
  }
})
