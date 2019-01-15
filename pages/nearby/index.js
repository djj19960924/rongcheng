// pages/nearby/index.js
var that = null;
Page({
  
  data: {
    markers: [],
  },
  
  onShow: function (options) {
    that = this;

    let markers = [];

    wx.getLocation({
      type: 'wgs84',
      success(res) {
        markers.push(
          {
            iconPath: '/images/nearby/marker1.png',
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 36,
            height: 36
          }
        )
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers:markers
        })
      }
    })

  },

  onShareAppMessage: function () {
  
  }
})