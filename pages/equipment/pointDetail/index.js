var app = getApp();
Page({
  
  data: {
    id: null,
    imgUrl: getApp().globalData.ali,
    sb_allInfo:null,
    equipmentDetail: null
  },
  
  onLoad: function (options) {
    this.setData({ id: options.id })
    getEquipmentDetailById.call(this, options.id);
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

//获取小区详情
function getEquipmentDetailById(id) {
  var that = this; console
  wx.request({
    url: getApp().globalData.url + "wx/getVillageId_",
    data: {
      village_id: id
    },
    success: function (res) {

      var resdata = res.data.data;
      console.log("resdata:",resdata);
      //小区信息
      var img = resdata.img_urls;
      var imgUrls = img.split(',');
      that.setData({
        imgUrls: imgUrls
      })
      var equipmentDetail = {
        name: resdata.name,
        position: resdata.aname + resdata.sname + resdata.cname + resdata.name,
        longitude: resdata.longitude != null ? resdata.longitude : "",
        latitude: resdata.latitude != null ? resdata.latitude : ""
      }
      that.setData({
        equipmentDetail: equipmentDetail
      })
      //设备信息
      var list = res.data.list;
      wx.request({
        url: getApp().globalData.url + "wx/equipmentBase",
        data: {
          village_id: id
        },
        success: function (res) {
          var resdata = res.data.data;
          console.log("设备: ",resdata);

          that.setData({
            sb_allInfo: resdata
          })

        },
        fail() {
          wx.hideLoading();
        }
      })
    }
  })
}