const { $Toast } = require('../../dist/base/index');
var amapFile = require('../../utils/amap-wx.js');
var app = getApp();

Page({
  data: {
    dataList: [
      {
        name: '田舍里',
        km: '10',
        time: '12',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181010105350rondom5544.jpg'
      },
      {
        name: '花卉新村',
        km: '3',
        time: '5',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181010112302rondom883.jpg'
      },
      {
        name: '新西街',
        km: '13',
        time: '18',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181010131557rondom8864.jpg'
      },
      {
        name: '小李庄',
        km: '18',
        time: '22',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181010164737rondom1500.jpg'
      },
      {
        name: '花园村',
        km: '10',
        time: '8',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181030130826rondom6079.jpg'
      },
      {
        name: '郭家小院',
        km: '20',
        time: '30',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181030132043rondom7217.jpg'
      },
      {
        name: '红德里',
        km: '9',
        time: '8',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181030135611rondom8968.jpg'
      },
      {
        name: '梅梁公园',
        km: '11',
        time: '24',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181031094124rondom8815.jpg'
      },
      {
        name: '峰影苑',
        km: '12',
        time: '20',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181126133229rondom7965.jpg'
      },
      {
        name: '梅梁新村',
        km: '11',
        time: '8',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181203105509rondom9057.jpg'
      },
      {
        name: '栖云社区',
        km: '10',
        time: '12',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181010131557rondom8864.jpg'
      },
      {
        name: '北边小游园',
        km: '13',
        time: '12',
        img: 'https://paoba.oss-cn-beijing.aliyuncs.com/20181010105350rondom5544.jpg'
      }
    ],
    objectMultiArray: [],
    streetList: [],
    communityList: [],
  },
  
  onLoad: function (options) {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    // 获取滚动区域高度
    let query = wx.createSelectorQuery()
    wx.getSystemInfo({
      success: res => {
        query.selectAll('.box_top').boundingClientRect(rect => {
          let heightAll = 0;
          rect.map((currentValue, index, arr) => {
            heightAll = heightAll + currentValue.height
          })
          this.setData({
            scrollheight: res.windowHeight - heightAll
          })
        }).exec();
      }
    })
    getAllArea.call(this);
    $Toast.hide();
  },
  
  onShareAppMessage: function () {
  
  },
  goDetail:function(){
    wx.navigateTo({
      url: 'pointDetail/index',
    })
  },
  goRepair:function(){
    wx.navigateTo({
      url: 'repair/index',
    })
  },
  daohang:function(e){
    let longitude = e.currentTarget.dataset.longitude
    let latitude = e.currentTarget.dataset.latitude
    let name = e.currentTarget.dataset.name
    wx.openLocation({
      longitude: longitude * 1,
      latitude: latitude * 1,
      name: name,
    })
  },

})


function getAllArea() {
  console.log("city:",app.globalData.citySign)
  wx.showLoading({
    title: '加载中...',
  })
  var that = this;
  wx.request({
    url: getApp().globalData.url + "wx/xmList",
    data: {
      citySign: getApp().globalData.citySign,
      organize_id: getApp().globalData.organize_id,
    },
    success: function (res) {
      console.log("区域列表: ", res)
      var retdata = res.data.data;
      // console.log(retdata);
      var areaList = retdata.area;
      var streetList = retdata.street;
      var communityList = retdata.community;
      var streetList_1 = [];
      var communityList_1 = [];

      that.setData({
        objectMultiArray: [areaList, streetList, communityList],
        streetList: streetList,
        communityList: communityList,
      })

      //如果没有选到第三级社区
      if (!that.data.objectMultiArray[2][0]) {
        wx.hideLoading();
        that.setData({
          villageList: []
        })
        return;
      }

      //获取第一个小区列表
      // wx.request({
      //   url: getApp().globalData.url + "wx/address/village",
      //   data: {
      //     communityId: that.data.objectMultiArray[2][0].id,
      //     organizeId: getApp().globalData.organize_id
      //   },
      //   success: function (res) {
      //     var retdata = res.data;
      //     //console.log(retdata);
      //     var myAmapFun = new amapFile.AMapWX({ key: app.globalData.map_key });
      //     wx.getLocation({
      //       type: "gcj02",
      //       success: function (aa) {

      //         var villageList = [];
      //         if (retdata.code == 0 && retdata.data.length > 0) {

      //           recurve(retdata.data.length - 1, res, villageList, aa)
      //         }
      //         else {
      //           wx.hideLoading();
      //           that.setData({
      //             villageList: []
      //           })
      //         }
      //         //递归计算路径距离时间
      //         function recurve(b, res, villageList, aa) {

      //           if (b == 0) {
      //             if (res.data.data[b].img_urls != null && res.data.data[b].img_urls.length > 0) {

      //               var arr = res.data.data[b].img_urls.split(',');
      //               res.data.data[b].img_urls = arr[0];
      //             }
      //             if (res.data.data[b].longitude) {//有位置信息
      //               myAmapFun.getDrivingRoute({
      //                 origin: aa.longitude + ',' + aa.latitude,
      //                 destination: res.data.data[b].longitude + ',' + res.data.data[b].latitude,
      //                 success: function (response) {
      //                   if (response.paths[0].distance >= 100) {
      //                     res.data.data[b].distance = response.paths[0].distance / 1000 + "km";
      //                   }
      //                   else {
      //                     res.data.data[b].distance = " <100m";
      //                   }
      //                   res.data.data[b].duration = (response.paths[0].duration / 60).toFixed(0);
      //                   villageList.unshift(res.data.data[b])
      //                   that.setData({
      //                     villageList: villageList
      //                   })
      //                   wx.hideLoading();
      //                   return;
      //                 }
      //               })
      //             }
      //             else {//没有位置信息
      //               res.data.data[b].distance = " -- km";
      //               res.data.data[b].duration = " -- ";
      //               villageList.unshift(res.data.data[b])
      //               that.setData({
      //                 villageList: villageList
      //               })
      //               wx.hideLoading();
      //               return;
      //             }
      //           }
      //           else {
      //             if (res.data.data[b].img_urls != null && res.data.data[b].img_urls.length > 0) {

      //               var arr = res.data.data[b].img_urls.split(',');
      //               res.data.data[b].img_urls = arr[0];
      //             }
      //             if (res.data.data[b].longitude) {//有位置信息
      //               myAmapFun.getDrivingRoute({
      //                 origin: aa.longitude + ',' + aa.latitude,
      //                 destination: res.data.data[b].longitude + ',' + res.data.data[b].latitude,
      //                 success: function (response) {
      //                   if (response.paths[0].distance >= 100) {
      //                     res.data.data[b].distance = response.paths[0].distance / 1000 + "km";
      //                   }
      //                   else {
      //                     res.data.data[b].distance = " <100m";
      //                   }
      //                   res.data.data[b].duration = (response.paths[0].duration / 60).toFixed(0);
      //                   villageList.unshift(res.data.data[b])
      //                   console.log("递归++")
      //                   recurve(b - 1, res, villageList, aa)
      //                 }
      //               })
      //             }
      //             else {//没有位置信息
      //               res.data.data[b].distance = " -- km";
      //               res.data.data[b].duration = " -- ";
      //               villageList.unshift(res.data.data[b])
      //               console.log("递归++")
      //               recurve(b - 1, res, villageList, aa)
      //             }
      //           }
      //         }
      //       },
      //     })
      //   }
      // })
    }
  })
}

