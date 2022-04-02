// components/home/index.js
Component({

  /**
   * 使用全局样式
   */
  options: {
    addGlobalClass: true
  },

  /**
   * 组件属性列表
   */
  properties: {
    
    //图标name或图片src
    name: {
      type: String,
      value: 'chat-o'
    },
    //距离底部初始位置
    bottom: {
      type: String,
      value: '100px'
    },
    pageList: {
      type: Array,
      value: [
        {
          url: '/pages/homePages/main_index/index',
          name: 'chat-o',
          openType: 'switchTab',
        },
        {
          url: '/pages/homePages/order_addcart/order_addcart',
          name: 'shopping-cart-o',
          openType: 'switchTab',
        },
        {
          url: '/pages/homePages/user/user',
          name: 'contact',
          openType: 'switchTab',
        },
      ]
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    homeActive: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setTouchMove: function (e) {
      var that = this;
      if (e.touches[0].clientY < 545 && e.touches[0].clientY > 66) {
        that.setData({
          top: e.touches[0].clientY
        })
      }
    },
    open: function () {
      // this.setData({
      //   homeActive: !this.data.homeActive
      // })
      console.log('触发事件buttonEvent')
      this.triggerEvent('buttonEvent');
    },
  }
})