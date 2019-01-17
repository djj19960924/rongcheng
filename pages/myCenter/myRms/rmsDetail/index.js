// pages/myCenter/myRms/rmsDetail/index.js
var app = getApp();
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',
    order: null,
    imgUrlIp: app.globalData.ali,
  },

  //预览
  previewImg: function (e) {
    let images = this.data.order.images;
    for (let i = 0; i < images.length; i++) {
      if (images[i].indexOf('http') > -1) {
        break;
      }
      images[i] = this.data.imgUrlIp + images[i]
    }
    wx.previewImage({
      current: e.currentTarget.dataset.imgurl,
      urls: images
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderid = options.id;
    getRepairListDetailById.call(this);
  },

  //播放声音
  play: function (e) {
    console.log('播放音频: ',e);
    innerAudioContext.autoplay = true;

    innerAudioContext.src = e.currentTarget.dataset.voiceurl,
      innerAudioContext.play(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

function getRepairListDetailById() {
  var that = this;
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: app.globalData.url + "wx/repairDetail",
    data: {
      id: this.data.orderid,
    },
    success: function (res) {
      var resdata = res.data.data;
      wx.hideLoading();
      that.setData({
        order: resdata,
      })
      console.log("order:", that.data.order)
    },
    fail: function () {
      wx.hideLoading();
    }
  })
}