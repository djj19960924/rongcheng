Page({
  
  data: {
    imgUrls: [
      'https://paoba.oss-cn-beijing.aliyuncs.com/20181030130826rondom6079.jpg',
      'https://paoba.oss-cn-beijing.aliyuncs.com/20181030132043rondom7217.jpg',
      'https://paoba.oss-cn-beijing.aliyuncs.com/20181126133229rondom7965.jpg', 
    ],
  },
  
  onLoad: function (options) {
  
  },
  
  onShareAppMessage: function () {
  
  },
  intoMap:function(){
    wx.openLocation({
      longitude: 120.2600326538086	,
      latitude: 31.55296516418457,
    })
  },
  getLocationInfo: function () {
    var that = this;
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        var mContent = "经度: " + res.longitude + '\r\n' + " 纬度: " + res.latitude;
        var longitude = res.longitude;
        var latitude = res.latitude;
        wx.showModal({
          title: '提示',
          content: mContent,
          confirmText: "确定",
          showCancel: false,
          confirmColor: "#398DE3",
        })
      },
    })
  },
})