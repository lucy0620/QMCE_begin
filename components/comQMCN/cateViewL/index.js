// components/comQMCN/cateViewL/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 分类列表
    list: {
      type: Array,
      value: null
    },
    // 默认激活的分类下标
    active: {
      type: Number,
      value: '0'
    },
    // 主题色
    color: {
      type: String,
      value: 'red'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _height: 0, // 列表视图高度
    _rightList: []
  },
  attached () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        // 自定义tabbar：用screenHeight，非自定义用windowHeight - navbar
        that.setData({
          _height: (res.screenHeight) * (750 / res.windowWidth) - app.globalData.navHeight - 110 - (app.globalData.isIphoneX ? 68 : 0)
        })
      },
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 切换分类
    changeCate(e) {
      this.setData({
        active: e.currentTarget.dataset.index
      })
      this.triggerEvent('changeCate', { ...e.currentTarget.dataset.obj})
    }
  }
})
