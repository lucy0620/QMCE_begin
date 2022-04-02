var app = getApp();
Component({
  /**
   * 使用全局样式
   */
  options: {
    addGlobalClass: true
  },

  properties: {
    // 传入的navbar参数
    navbarData: {
      type: Object,
      value: {
        class: '', // 自定义class
        return: true, // 可以返回
        home: true,
        /**
         *  导航栏类型
         *  类型: 1. 大标题
         *        2. 搜索框
         */
        type: 1,
        search: { // 搜索对象参数
          disabled: false,
          placeholder: '请输入搜索内容',
          path: ''
        },
        title: ''
      },
    },
    // 背景颜色
    backgroundColor: {
      type: String,
      value: app.globalData.background
    },
    // 字体颜色
    color: {
      type: String,
      value: '#fff'
    }
  },

  data: {
    height: app.globalData.navHeight,
    value: '',
  },

  ready: function () {
    var pages = getCurrentPages();
    if (pages.length <= 1) this.setData({
      'navbarData.return': false
    });
  },

  methods: {
    // 返回首页
    goHome(){
      wx.switchTab({
        url: app.globalData.indexUrl, 
      })
    },
    // 返回上一页
    return () {
      wx.navigateBack({
        delta: 1
      });
    },
    // 提交搜索事件
    onSearch(e){
      this.setData({
        value: e.detail,
      })
      this.triggerEvent("searchConfirm", e.detail);
    },
    // 点击导航栏，跳转到搜索页
    onClick(){
      if(this.data.navbarData.search.disabled){
        let that = this
        wx.navigateTo({
          url: that.data.navbarData.search.path
        })
      }
    },
  }
})