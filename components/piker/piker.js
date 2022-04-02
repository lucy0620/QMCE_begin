// components/piker/piker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    /**
     * 默认项下标
     */
    defaultIndex: {
      type: Number,
      value: 0
    },
    /**
     * 标题
     */
    title: {
      type: String,
      value: '请选择'
    },
    list: {
      type: Array,
      value: [
        {
          text: '',
          disabled: true
        }
      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCancel() {
      this.setData({
        show: false //关闭选择器
      });
    },
    onConfirm(e) {
      this.setData({
        show: false //关闭选择器
      });
      // 自定义名称事件，父组件中使用
      this.triggerEvent('getList', e)
      console.log('当前选择项',e.detail)
    },
  }
})
