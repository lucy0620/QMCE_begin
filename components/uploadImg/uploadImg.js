const app = getApp();
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
    /**
     * 图片上传地址
     */
    url: {
      type: String,
      value: `${app.globalData.url}/wechat/${app.globalData.appid}/uploadAndCheckFileThirdParty`
    },
    /**
     * 授权凭证
     */
    authorization: {
      type: String,
      value: `${app.globalData['authorization']?app.globalData.authorization:''}`
    },
    /**
     * 默认图片
     */
    imageList: {
      type: Array,
      value: []
    },
    /**
     * 图片最大数量
     */
    count: {
      type: Number,
      value: 6
    }
  },
  lifetimes: {
    attached: function() {
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
    // 删除图片
    deleteImage(e) {
      let that = this;
      // 获取删除图片的下标
      let deleteIndex = e.target.dataset['deleteIndex'];
      let imageList = that.data.imageList;
      // 删除指定对象里面的图片
      imageList.splice(deleteIndex, 1);
      this.setData({
        imageList: imageList
      })
      console.log("图片数组 = ", imageList);
      that.triggerEvent('getList', imageList)
    },
  browse(){
    let that = this
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            // 拍照
            that.chooseWxImage('camera');
          } else if (res.tapIndex == 1) {
            // 本地
            that.chooseWxImage('album');
          }
        }
      }
    })
  },
    /*打开相册、相机 */
  chooseWxImage: function (type, index) {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        // 选择图片后的完成确认操作
        let tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '上传中',
          mask: true
        })
        wx.uploadFile({
          url: that.data.url,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'Authorization': that.data.authorization
          },
          success(res) {
            wx.hideLoading();
            let img = JSON.parse(res.data)
            // 根据传入的下标,新增图片
            let imageList = that.data.imageList
            imageList.push(img.data);
            that.setData({
              imageList: imageList
            });
            console.log("图片数组 = ", imageList);
            that.triggerEvent('getList', imageList)
            // wx.previewImage({
            //   current: img.data, // 当前显示图片的http链接
            //   urls: [img.data] // 需要预览的图片http链接列表
            // })
          },
          fail: function (error) {
            wx.hideLoading();
            wx.showToast({
              title: '图片上传失败',
              icon: 'error'
            })
          }
        })
      }
    })
  }
  }
})
