// components/authorize/authorize.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    authorize () {
      if( flag ) {
        // 防止重复点击
        return
      } else {
        that.setData({
          flag: false
        })
        console.log(1)
      }
    },
    back() {

    }
    
  }
})
