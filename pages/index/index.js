const app = getApp()

import * as utilRoute from "../../utils/route"

Page({
  data: {
    isIphoneX: app.globalData.isIphoneX,
    background: app.globalData.background,
    navbarData: {
      type: 2,
      search: {
        placeholder: '请输入搜索内容',
        disabled: false,
        // disabled: true,
        // path: app.globalData.searchUrl
      }
    }
  },
  // 导航搜索
  search(e) {
    utilRoute.navigate('/pages/search/search?search=' + e.detail)
  },
  onShareAppMessage: function (e) {
    let params = this.getParams('pages/dd/ss?ll=1&pp=2')
    console.log(params)
    return {
      path: '/pages/search/index?' + 'id=' + 1,
      title: "给你分享了商品",
      desc: '彩色蛋糕',
      success: (ev) => {
        console.log(ev)
      }
    }
  },
  // 获取当前页面
  getPagePath() {
    let pages = getCurrentPages(); //获取加载的页面
    let currentPage = pages[pages.length - 1]; //获取当前页面的对象
    let url = currentPage.route; //当前页面url
    return url
  },
  // 获取路径中的参数
  getParams(urlq) {
    let theRequest = new Object()
    if (urlq.indexOf('?') != -1) {
      let str = urlq.substr(urlq.indexOf('?') + 1)
      let strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        //unescape() 函数可对通过 escape() 编码的字符串进行解码
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
    }
    return theRequest
  }
})