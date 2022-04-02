// components/closePopup/closePopup.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示弹框
    isPopupShow: {
      type: Boolean,
      value: false
    },
    //标题
    title: {
      type: String,
      value: ""
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
    //点击遮罩层
    close(e) {
      this.triggerEvent('closeMode');
    }
  }
})