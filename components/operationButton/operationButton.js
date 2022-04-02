// components/operationButton/index.js

Component({

  lifetimes: {
    attached: function() {
      this.setData({
        isLine : !this.data.isButton
      })
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //是否两个按钮
    isButton: {
      type: Boolean,
      value: true
    },
    //左边浅色按钮标题
    leftTitle: {
      type: String,
      value: "取消"
    },
    //右边深色按钮标题
    rightTitle: {
      type: String,
      value: "确定"
    },
    //是否固定在底部
    isPosition: {
      type: Boolean,
      value: false
    },
    iphoneX: {
      type: Boolean,
      value: false
    },
    //按钮是否占满一行
    isLine: {
      type: Boolean,
      value: true
    },
    //左边按钮背景颜色
    leftButbackgroundColor: {
      type: String,
      value: '#eeee'
    },
    //右边按钮背景颜色
    rightButbackgroundColor: {
      type: String,
      value: '#005FFF'
    },
    //固定在底部时的背景颜色
    absoluteBackground: {
      type: String,
      value: '#fff'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 返回
     */
    back() {
      this.triggerEvent('buttonOperation', false);
    },
    /**
     * 确定
     */
    complete() {
      this.triggerEvent('buttonOperation', true);
    }
  }
})