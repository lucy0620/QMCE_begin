// 滚动到底方法
function toViewBottomFun() {
  wx.createSelectorQuery().select('#chatBox').boundingClientRect(function (rect) {
    wx.pageScrollTo({
      scrollTop: rect.height,
      duration: 100 // 滑动速度
    })
  }).exec();
}