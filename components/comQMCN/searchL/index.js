// components/search/search.js
Component({
  /**
   * 使用全局样式
   */
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    inputWidth: {
      type: String,
      value: '600rpx'
    },
    placeholder: {
      type: String,
      value: '请输入搜索内容'
    },
    background: {
      type: String,
      value: 'transparent'
    },
    iptBackground: {
      type: String,
      value: '#fff'
    },
    fixed: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    searchValue: {
      type: String,
      value: ''
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
    // 绑定搜索框事件
    onChange(e) {
      let that = this;
      that.setData({
        searchValue: e.detail.value
      })
      this.triggerEvent("onChange", this.data.searchValue);
    },
    onSearch(){
      this.triggerEvent("onSearch",this.data.searchValue);
    },
    clear(){
      this.setData({
        searchValue: ''
      })
      this.triggerEvent("onClear", this.data.searchValue);
    }
  }
})
