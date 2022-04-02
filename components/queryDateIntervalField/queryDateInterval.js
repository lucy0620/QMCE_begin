// components/queryDateInterval/queryDateInterval.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 默认查询的日期时间: 开始时间
     */
    startTime: {
      type: String,
      value: ''
    },
    
    /**
     * 默认查询的日期时间: 结束时间
     */
    endTime: {
      type: String,
      value: ''
    },
    /**
     * 最小日期 毫秒级时间戳Number
     * 默认值为当前一年前
     */
    minDate: {
      type: String,
      value: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1).getTime()
    },
    /**
     * 最大日期 毫秒级时间戳Number
     */
    maxDate: {
      type: Number,
      value: new Date().getTime()
    }
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached: function () {
      let startTime = this.data.startTime
      let endTime = this.data.endTime
      let now = this.dateStrToFormat(new Date())
      if(startTime == '' || endTime == '') {
        if(startTime) {
          endTime = startTime
        }else if(endTime) {
          startTime = endTime
        }else {
          endTime = now
          startTime = now
        }
      }
      this.setData({
        startTime,
        endTime
      })
      this.triggerEvent('getDateInterval', {startTime,endTime})
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 是否显示 vant 日历查询组件
    show: false,
    // 设置最小日历日期和最大日历日期
    minDate: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).getTime(),
    // 选中的id
    selectId: 1,
    // 日期默认值
    datetimeValue: new Date().getTime(),
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 日期时间选择器：点击完成按钮时触发的事件
     */
    onDatetimePickerConfirm(event) {
      //选择的日期值
      let timeDate = event.detail;
      //获取选择的id
      let id = this.data.selectId;
      //将时间戳转为 yyyy-MM-dd 格式
      let time = this.parseDate(timeDate);
      //开始时间
      let startTime = id == 1 ? time : this.data.startTime;
      //结束时间
      let endTime = id == 2 ? time : this.data.endTime;
      //判断开始日期是否大于结束日期，结束日期是否小于开始日期
      let timeBol = this.comparedate(startTime, endTime);
      //获取开始日期与结束日期相差的天数
      let day = new Date(endTime).getTime() - new Date(startTime).getTime();
      //提示语
      if (id == 1 && endTime && timeBol) { //开始日期不大于结束日期
        wx.showToast({
          title: '开始日期不大于或等于结束日期',
          icon: 'none'
        })
      }
      else if (Math.floor(day / 86400000) <= -1) {
        wx.showToast({
          title: '结束日期不能小于开始日期',
          icon: 'none'
        })
      }
      else {
        //覆盖数据
        this.setData({
          datetimeValue: timeDate, //日期选择器的值
          show: false, //关闭日期选择器
          startTime: startTime, //点击开始日期，则赋值
          endTime: endTime, //点击结束日期，则赋值
        });
        let parmas = {
          startTime: this.data.startTime,
          endTime: this.data.endTime
        }
        // 自定义名称事件，父组件中使用
        this.triggerEvent('getDateInterval', parmas)
      }
    },
    /**
     * 日期时间选择器：点击取消按钮时触发的事件
     */
    onDatetimePickerCancel(event) {
      this.setData({
        show: false //关闭日期选择器
      });
    },
    /**
     * 显示查看日历组件
     */
    onOpenDate(e) {
      let id = e.currentTarget.dataset.id;
      this.setData({
        show: true,
        selectId: id,
        dateTimeTitle: id == 1 ? '开始时间' : '结束时间',
        datetimeValue: id == 1 ? this.formatDate(this.data.startTime) : this.formatDate(this.data.endTime)
      });
    },
    // 将中国标准时间日期格式化成指定的格式
    dateStrToFormat(dateStr, symbol = '-') {
      let dateTime = new Date(dateStr);
      let year = dateTime.getFullYear();
      let month = dateTime.getMonth() + 1 < 10 ? `0${dateTime.getMonth() + 1}` : dateTime.getMonth() + 1;
      let day = dateTime.getDate() < 10 ? `0${dateTime.getDate()}` : dateTime.getDate();
      return `${year}${symbol}${month}${symbol}${day}`
    },
    // 时间戳转为yyyy-MM-dd格式
    parseDate(dateVal) {
      let date = new Date(dateVal);
      let y = 1900 + date.getYear();
      let m = "0" + (date.getMonth() + 1);
      let d = "0" + date.getDate();
      return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
    },
    // yyyy-MM-dd HH:mm:ss格式转为时间戳
    formatDate(date) {
      return new Date(date).getTime();
    },
    // 判断开始日期是否大于结束日期，结束日期是否小于开始日期
    comparedate(startTime, endTime) {
      return this.formatDate(startTime) >= this.formatDate(endTime);
    }
  }
})