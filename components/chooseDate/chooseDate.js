// components/queryDateInterval/queryDateInterval.js
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
     * 最大日期 毫秒级时间戳Number
     * 默认值为当前一个月后
     */
    maxDate: {
      type: String,
      value: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getTime()
    },
    /**
     * 最小日期 毫秒级时间戳Number
     * 默认值为当前一个月前
     */
    minDate: {
      type: String,
      value: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime()
    },
    /**
     * 顶部栏标题
     */
    title: {
      type: String,
      value: ''
    },
    formatter: {
      type: Function,
      value: (type, value) => {
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`;
        }
        return value;
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 日期默认值
    value: new Date().getTime()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 日期时间选择器：点击取消按钮时触发的事件
     */
    onDatetimePickerCancel(event) {
      this.setData({
        show: false //关闭日期选择器
      });
    },
    /**
     * 日期时间选择器：点击完成按钮时触发的事件
     */
    onDatetimePickerConfirm(event) {
      //选择的日期值
      let timeDate = event.detail;
      //将时间戳转为 yyyy-MM-dd 格式
      let time = this.parseDate(timeDate);
      //覆盖数据
      this.setData({
        datetimeValue: timeDate, //日期选择器的值
        show: false //关闭日期选择器
      });
      // 自定义名称事件，父组件中使用
      this.triggerEvent('getDateInterval', time)
      console.log('选择了',time)
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
    }
  }
})