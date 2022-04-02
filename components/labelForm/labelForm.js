// components/labelForm/index.js
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
    //表单内容
    assistantLabelData: {
      type: Array,
      value: []
    },
    //是否显示底部按钮
    isDetails: {
      type: Boolean,
      value: true,
      observer(val) {
        console.log('isDetails', typeof val);
      }
    },
    //底部按钮是否固定在底部
    isPosition: {
      type: Boolean,
      value: true,
    },
    //底部按钮文字
    rightTitleValue: {
      type: String,
      value: "确定"
    },
    //是否显示两个按钮
    isButton: {
      type: Boolean,
      value: false
    },
    //是否占满一行
    isLine: {
      type: Boolean,
      value: false
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
   * 组件的初始数据
   */
  data: {
    actionSheetShow: false, //是否弹出底部动作面板
    actionSheetactions: [], //动作面板操作
    dateTimeTitle: "", // 日期选择器标题
    isdatetimePicker: false, //是否显示日期选择器
    minDate: new Date().getTime(), //日期选择器最小时间为当前时间
    datetimeValue: "", //日期选择器的value
    clickDateId: null, //保存点击日期的id
    isPickerShow: false, //是否显示选择器
    pickerList: [], //选择器数据列表
    pickerTitle: "", //选择器标题
    isOverlayPickerShow: false, //选择器遮罩层
    pickerId: null, //点击选择器的id
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 输入框输入的值 
     */
    inputFieldValue(e) {
      //获取输入框id赋值对应的值
      this.data.assistantLabelData.forEach(v => {
        if (v.id == e.currentTarget.dataset.id) v.data = e.detail.value
      })
      this.setData({
        "assistantLabelData": this.data.assistantLabelData
      })
      console.log('输入框输入的值', this.data.assistantLabelData);
    },
    /**
     * 取消操作面板
     */
    onactionSheetCancel() {
      this.setData({
        "actionSheetShow": false
      })
    },
    /**
     * 打开底部面板
     */
    openSheet(e) {
      let dataset = e.currentTarget.dataset;
      if (dataset.isdatetimepicker) { //日期选择器
        let dataObjData = null; //获取点击的对象的data值
        this.data.assistantLabelData.forEach(v => {
          if (v.id == dataset.id) dataObjData = v.data
        });
        this.setData({
          "isdatetimePicker": true,
          "dateTimeTitle": dataset.label,
          "clickDateId": dataset.id,
          "datetimeValue": this.formatDate(dataObjData), //回显日期选择器的值
        })
      } else if (!dataset.noactionsheetshow) { //底部动作面板
        if (dataset.select.length > 0) {
          this.data.assistantLabelData.forEach(v => {
            if (v.id == dataset.id) {
              //获取选项的值
              let select = [];
              v.select.forEach((vv, i) => {
                select.push({
                  labelId: v.id,
                  id: i,
                  name: vv
                })
              })
              this.setData({
                "actionSheetactions": select,
                "actionSheetShow": true
              })
            }
          })
        } else {
          this.promptToast("暂无数据");
        }
      } else if (dataset.noactionsheetshow) { //不显示底部面板
        this.triggerEvent("clickNoActionSheetShowById", dataset.id);
        this.triggerEvent("clickNoActionSheetShowByObj", {
          "id": dataset.id,
          "assistantLabelData": this.data.assistantLabelData
        });
      }
    },
    /**
     * 底部动作面板选择的值
     */
    onactionSheetSelect(e) {
      let {
        id,
        labelId,
        name
      } = e.detail;
      //赋值标签内容id的值
      this.data.assistantLabelData.forEach(v => {
        if (v.id == labelId) {
          v.data = name
        }
      })
      this.setData({
        "assistantLabelData": this.data.assistantLabelData,
        "actionSheetShow": false
      })
      //审批,选择类型后返回方法
      let obj = this.data.assistantLabelData[0];
      if (obj.id == labelId && obj.placeholder == "选择类型") {
        this.buttonOperation();
      }
      this.triggerEvent('onactionSheetSelect', {
        labelId: labelId,
        id: id
      });
    },
    /**
     * 上传图片获取url 
     */
    getUploaderByUrl: function (e) {
      console.log('上传图片获取url', this.data.assistantLabelData);
      this.data.assistantLabelData.forEach(v => v.data = v.id == e.currentTarget.dataset.id ? e.detail[0] : v.data);
      this.setData({
        "assistantLabelData": this.data.assistantLabelData,
      })
    },
    /**
     * 日期时间选择器：点击完成按钮时触发的事件
     */
    onDatetimePickerConfirm(e) {
      //选择的日期值
      let timeDate = e.detail;
      //将时间戳转为 yyyy-MM-dd HH:mm:ss 格式
      let time = this.parseTime(timeDate);
      //开始和结束时间
      let startTime = null;
      let endTime = null;
      //点击的对象
      let clickObj = null;
      //判断是否有开始时间和结束时间，再进行对比
      this.data.assistantLabelData.forEach(v => {
        if (v.id == this.data.clickDateId) {
          clickObj = v;
          v.data = time;
        }
        if (v.startTime) startTime = v.data;
        if (v.endTime) endTime = v.data;
        if (startTime && endTime && v.isRead) { //根据开始日期和结束日期获取相差的时长
          let day = this.getDaysBetween(startTime, endTime);
          if (v.isRead) v.data = day;
        }
      })
      if (startTime || endTime) {
        // 判断开始日期是否大于结束日期，结束日期是否小于开始日期
        let timeBol = this.comparedate(startTime, endTime);
        //获取开始日期与结束日期相差的天数
        let day = new Date(endTime).getTime() - new Date(startTime).getTime();
        //提示语
        if (clickObj.startTime && endTime && timeBol) { //开始日期不大于结束日期
          this.promptToast("开始日期不大于或等于结束日期");
        } else if (clickObj.endTime && startTime && timeBol) { //结束日期不小于开始日期
          this.promptToast("结束日期不小于或等于开始日期");
        } else if (Math.floor(day / 1800000) < 1) {
          this.promptToast("开始日期与结束日期至少相差半小时");
        } else {
          console.log('assistantLabelData', this.data.assistantLabelData);
          this.setData({
            "assistantLabelData": this.data.assistantLabelData,
            "isdatetimePicker": false
          })
        }
      } else {
        this.setData({
          "assistantLabelData": this.data.assistantLabelData,
          "isdatetimePicker": false
        })
      }
    },
    /**
     * 日期时间选择器：点击取消按钮时触发的事件
     */
    onDatetimePickerCancel(e) {
      this.setData({
        isdatetimePicker: false //关闭日期选择器
      });
    },
    /**
     * 点击类型为6，选择器
     */
    clickPicker(e) {
      let {
        id,
        pickerlist,
        label
      } = e.currentTarget.dataset;
      this.setData({
        "isPickerShow": true,
        "pickerList": pickerlist,
        "pickerTitle": label,
        "isOverlayPickerShow": true,
        "pickerId": id,
      })
    },
    /**
     * 监听选择器取消事件
     */
    onCancelPicker(e) {
      this.setData({
        "isOverlayPickerShow": false,
        "isPickerShow": false,
        "pickerId": null
      })
    },
    /**
     * 监听选择器确定事件
     */
    onConfirmPicker(e) {
      let {
        index,
        value
      } = e.detail;
      //根据id赋值给点击弹出选择器的对象值
      this.data.assistantLabelData.forEach(v => {
        if (v.id == this.data.pickerId) v.data = value
      });
      this.setData({
        "assistantLabelData": this.data.assistantLabelData
      })
      console.log('assistantLabelData', this.data.assistantLabelData);
      this.onCancelPicker();
    },
    /**
     * 返回数据
     */
    buttonOperation(e) {
      // var bol = false;
      // this.data.assistantLabelData.forEach(v => {
      //   if (v.isRequired == 1 && !v.data) { //必填信息是否为空
      //     util.promptToast("请完善信息");
      //     bol = true;
      //   }
      // });
      // if (!bol) {
      console.log('form', this.data.assistantLabelData);
      this.triggerEvent("labelOperation", {
        "detail": e ? e.detail : "",
        "assistantLabelData": this.data.assistantLabelData
      });
      // }
    },
    formatDate(date) {
      date = new Date(date);
      return date.getFullYear() + "-" + formatMonthAndDate((date.getMonth() + 1)) + "-" + formatMonthAndDate(date.getDate());
    },
    promptToast(title) {
      setTimeout(() => {
        wx.showToast({
          icon: 'none',
          title: title,
          duration: 3000
        })
      }, 200);
    },
    // 获取两个日期之间相差的天数，小时
    getDaysBetween(dateString1, dateString2) {
      var startDate = Date.parse(dateString1);
      var endDate = Date.parse(dateString2);
      var ms = Math.abs(endDate - startDate);
      var hm = 1000;
      var mi = hm * 60;
      var hh = mi * 60;
      var dd = hh * 24;
      var day = parseInt(ms / dd);
      var hour = (ms - day * dd) / hh;
      return (day > 0 ? day + "天" : "") + (hour > 0 ? hour.toFixed(0) + "小时" : "")
    },
    // 将时间戳转为yyyy-MM-dd HH:mm:ss格式
    parseTime(timestamp) {
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      let strDate = Y + M + D + h + m + s;
      return strDate;
    },
    //判断开始日期是否大于结束日期，结束日期是否小于开始日
  comparedate(startTime, endTime) {
    return this.formatDate(startTime) >= this.formatDate(endTime);
  }
  }
})