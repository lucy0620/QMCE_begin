// components/uploader/index.js
let app = getApp();

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
    // 绑定的图片数组/字符串
    imageList: {
      type: Object,
      value: [],
      // 监听函数
      observer: function (newVal, oldVal) {
        let that = this;
        that._handleComputedArea();
      }
    },
    // 标题
    title: {
      type: String,
      value: null
    },
    // 图片最多不能超过count数量
    count: {
      type: Number,
      value: 1
    },
    // 添加图片描述
    text: {
      type: String,
      value: null
    },
    // 图片宽/高
    width: {
      type: Number,
      value: 200
    },
    // 图片高度
    height: {
      type: Number,
      value: null
    },
    // 图标
    /**
     * icon-tianjiatupian  +号(默认)
     * icon-shangchuantupian 相机
     */
    iconfont: {
      type: String,
      value: 'icon-tianjiatupian'
    },
    // 自定义父组件通讯获取数据 函数名称
    funName: {
      type: String,
      value: 'getImageList'
    },
    // 特殊: 新增图片的高度
    addHeight: {
      type: String,
      value: null
    },
    // 图片高度是否自适应
    autoHeight: {
      type: Boolean,
      value: false
    },
    // 上传图片的Url地址
    uploadUrl: {
      type: String,
      value: `${app.globalData.url}/wechat/${app.globalData.appid}/uploadAndCheckFileThirdParty`
    },
    // 上传的类型 数组 : array , 字符串 : string
    type: {
      type: String,
      value: 'array'
    },
    // 滚动条距离顶部的距离
    scrollTop: {
      type: Number,
      value: 0
    },
    // 图片展示类型 sudoku: 九宫格,  column 列  columnObj 图片对象
    showType: {
      type: String,
      value: 'sudoku'
    },
    // 是否展示数量
    showLimit: {
      type: Boolean,
      value: false
    }
  },

  // 组件的生命周期
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached: function () {
      let that = this;
      // 判断传入的类型
      if (that.properties.type === 'string') {
        let array = [];
        let imageList = that.properties.imageList
        if (imageList != null) {
          array.push(imageList)
        }
        that.setData({
          imageList: array
        })
      }
      // 初始化
      that._handleComputedImage()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageWitdh: 0, // 图片高度
    x: 0, // movable-view的坐标
    y: 0,
    areaHeight: 0, // movable-area的高度
    hidden: true, // movable-view是否隐藏
    currentImg: '', // movable-view的图片地址
    currentIndex: 0, // 要改变顺序的图片的下标
    pointsArr: [], // 每张图片的坐标
    flag: true, // 是否是长按
    editText: "编辑", // 编辑文本 (列)
    isEdit: false, // 是否编辑 (列)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 是否编辑
    handleEdit: function () {
      let that = this;
      let editStatus = !that.data.isEdit;
      that.setData({
        isEdit: editStatus,
        editText: editStatus ? '取消' : '编辑'
      })
    },
    // 图片往上移
    handleTop: function (e) {
      let that = this;
      // 获取移动图片的下标
      let {
        index
      } = e.target.dataset;
      // 获取上一个下标
      let lastIndex = index - 1;
      // 获取要移动的图片数组
      let imageList = that.properties.imageList;
      // 替换的数组下标,
      let oldImage = imageList[index];
      let lastImage = imageList[lastIndex];
      // 后面的图片 赋值到上一个图片
      imageList[index] = lastImage;
      // 原图片 赋值到下一个
      imageList[lastIndex] = oldImage;
      that.setData({
        imageList: imageList
      });
      // 自定义名称事件，父组件中使用
      that.triggerEvent(that.properties.funName, that.properties.imageList)
    },
    // 图片往下移
    handleDown: function (e) {
      let that = this;
      // 获取移动图片的下标
      let {
        index
      } = e.target.dataset;
      // 获取下一个下标
      let nextIndex = index + 1;
      // 获取要移动的图片数组
      let imageList = that.properties.imageList;
      // 替换的数组下标,
      let oldImage = imageList[index];
      let nextImage = imageList[nextIndex];
      // 原图片赋值给 下一张下标
      imageList[nextIndex] = oldImage;
      // 下一张图片赋值给原下标
      imageList[index] = nextImage;
      that.setData({
        imageList: imageList
      });
      // 自定义名称事件，父组件中使用
      that.triggerEvent(that.properties.funName, that.properties.imageList)

    },
    // 预览图片
    handlePreview: function (e) {
      let that = this;
      let urls = that.properties.imageList;
      let current = e.target.dataset.url;
      wx.previewImage({
        current: current, //当前预览的图片
        urls: urls, // 所有要预览的图片数组
      })
    },
    // 预览图片 (对象数组)
    handlePreview2: function (e) {
      let that = this;
      let urls = that.properties.imageList;
      urls = urls.map(v => v.fileUrl)
      let current = e.target.dataset.url;
      wx.previewImage({
        current: current, //当前预览的图片
        urls: urls, // 所有要预览的图片数组
      })
    },
    // 删除图片
    handleDelete: function (e) {
      let that = this;
      // 获取删除图片的下标
      let {
        index
      } = e.target.dataset;
      // 获取要删除的数组
      let imageList = that.properties.imageList;
      // 删除指定的下标
      imageList.splice(index, 1);
      that.setData({
        imageList: imageList
      }, function () {
        // 更新面积
        that._handleComputedArea();
      });
      // 自定义名称事件，父组件中使用
      that.triggerEvent(that.properties.funName, that.properties.imageList)
    },
    // 删除图片 (对象数组)
    handleDelete2: function (e) {
      let that = this;
      // 获取删除图片的下标
      let {
        index
      } = e.target.dataset;
      // 获取要删除的数组
      let imageList = that.properties.imageList;
      // 删除指定的下标
      let deleteImage = imageList.splice(index, 1);
      that.setData({
        imageList: imageList
      }, function () {
        // 更新面积
        that._handleComputedArea();
      });
      let datas = {
        data: that.properties.imageList,
        id: deleteImage[0].id
      }
      // 自定义名称事件，父组件中使用
      that.triggerEvent(that.properties.funName, datas)
    },
    /*打开相册、相机 */
    handleChooseImage: function (e) {
      let that = this;
      let length = 1;
      if (that.properties.imageList != null) {
        length = that.properties.imageList.length;
      }
      wx.chooseImage({
        count: that.properties.count - length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
        success: function (res) {
          // 选择图片后的完成确认操作
          let tempFilePaths = res.tempFilePaths;
          wx.showLoading({
            title: '上传中',
            mask: true
          })
          if (tempFilePaths.length > 1) {
            tempFilePaths.forEach(ele => {
              that.uploadFile(ele)
            });
          } else {
            that.uploadFile(tempFilePaths[0])
          }
        }
      })
    },
    // 上传图片
    uploadFile: function (file) {
      let that = this;
      wx.uploadFile({
        url: that.properties.uploadUrl,
        filePath: file,
        name: 'file',
        header: {
          'Authorization': wx.getStorageSync('token'),
        },
        success(res) {
          wx.hideLoading();
          let img = JSON.parse(res.data)
          let imageList = that.data.imageList;
          if (imageList === null) {
            imageList = [];
          }
          if (img.data === null) {
            this.promptToast("图片上传失败,请重新上传");
          } else {
            // 如果是对象数组
            if (that.properties.showType === 'columnObj') {
              let val = {
                "fileUrl": img.data,
                "id": 0,
                "isMasterMap": 3,
                "shopProductid": 0
              }
              imageList.push(val);
            } else {
              imageList.push(img.data);
            }
            that.setData({
              imageList: imageList
            }, function () {
              // 更新面积
              that._handleComputedArea();
            })
            console.info("生成后预览的图片地址 = ", img.data);
            // 自定义名称事件，父组件中使用
            that.triggerEvent(that.properties.funName, that.properties.imageList)
          }
        },
        fail: function (error) {
          console.log(error);
          wx.hideLoading();
          wx.showToast({
            title: '图片上传失败',
            image: '/static/image/other/err.png',
            icon: 'none'
          })
        }
      })
    },
    // 计算图片宽度
    _handleComputedImage: function (e) {
      const windowWidth = wx.getSystemInfoSync().windowHeight;
      const width = windowWidth - 16;
      const imageWitdh = (width - 16) / 3;
      this.setData({
        imageWitdh
      })
    },
    // 计算movable-area的高度
    _handleComputedArea: function (e) {
      let that = this;
      const query = wx.createSelectorQuery().in(that);
      query.selectAll('.image-choose-container').boundingClientRect(function (rect) {
        if (rect.length != 0) {
          that.setData({
            areaHeight: rect[0].height
          })
        }
      }).exec()
    },
    // 计算每张图片的坐标
    _handleComputedPoints(e) {
      let that = this;
      const query = wx.createSelectorQuery().in(that);
      var nodesRef = query.selectAll(".image-item");
      nodesRef.fields({
        dataset: true,
        rect: true
      }, (result) => {
        console.log("坐标", result);
        that.setData({
          pointsArr: result
        })
      }).exec()
    },
    // 长按图片
    handleLongTap: function (e) {
      let that = this;
      let imageList = that.properties.imageList;
      // 如果长度 == 1, 阻止长按事件
      if (imageList.length <= 1) {
        return false;
      } else {
        // 计算每张图片的坐标
        that._handleComputedPoints();
        that.setData({
          currentImg: e.currentTarget.dataset.url,
          currentIndex: e.currentTarget.dataset.index,
          hidden: false,
          flag: true,
          x: e.currentTarget.offsetLeft,
          y: e.currentTarget.offsetTop
        })
      }
    },

    // 移动的过程中
    handleTouchMove: function (e) {
      // console.log("x",e.touches[0].pageX - 50);
      // console.log("y",e.touches[0].pageY - 50);
      let x = e.touches[0].pageX - 50;
      let y = e.touches[0].pageY - 50;
      // 首先先获得当前image-choose-container距离顶部的距离
      let that = this;
      const query = wx.createSelectorQuery().in(that);
      query.selectAll('.image-choose-container').boundingClientRect(function (rect) {
        let top = rect[0].top;
        y = y - that.properties.scrollTop - top;
        that.setData({
          // x: x - that.data.imageWitdh / 2 > 0 ? x - that.data.imageWitdh / 2:0,
          // y: y - that.data.imageWitdh / 2 > 0 ? y - that.data.imageWitdh / 2:0,
          x: x,
          y: y,
        })

      }).exec()
    },

    // 移动结束的时候
    handleTouchEnd: function (e) {
      let that = this;
      if (!that.data.flag) {
        // 非长按情况下
        return;
      }
      let x = e.changedTouches[0].pageX;
      let y = e.changedTouches[0].pageY - that.properties.scrollTop;
      const pointsArr = that.data.pointsArr;
      let data = that.properties.imageList;
      for (var j = 0; j < pointsArr.length; j++) {
        const item = pointsArr[j];
        if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
          const endIndex = item.dataset.index;
          const beginIndex = that.data.currentIndex;
          //临时保存移动的目标数据
          let temp = data[beginIndex];
          //将移动目标的下标值替换为被移动目标的下标值
          data[beginIndex] = data[endIndex];
          //将被移动目标的下标值替换为beginIndex
          data[endIndex] = temp;
        }
      }
      console.log("pointsArr", pointsArr);
      that.setData({
        imageList: data,
        hidden: true,
        flag: false,
        currentImg: ''
      })
      // 自定义名称事件，父组件中使用
      that.triggerEvent(that.properties.funName, that.properties.imageList)
    },
    promptToast(title) {
      setTimeout(() => {
        wx.showToast({
          icon: 'none',
          title: title,
          duration: 3000
        })
      }, 200);
    }
  }
})