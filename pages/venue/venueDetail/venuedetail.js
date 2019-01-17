// pages/venue/venueDetail/venuedetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: [
      {
        name: '无线',
        icon: '../images/service1.png'
      },
      {
        name: '休息区',
        icon: '../images/service2.png'
      },
      {
        name: '停车',
        icon: '../images/service3.png'
      },
      {
        name: '储物间',
        icon: '../images/service4.png'
      },
      {
        name: '公交',
        icon: '../images/service5.png'
      },
      {
        name: '卖品',
        icon: '../images/service6.png'
      },
      {
        name: '器材',
        icon: '../images/service7.png'
      },
      {
        name: '地板',
        icon: '../images/service8.png'
      },
      {
        name: '塑胶地',
        icon: '../images/service9.png'
      },
      {
        name: '更衣室',
        icon: '../images/service10.png'
      },
      {
        name: '洗手间',
        icon: '../images/service11.png'
      },
      {
        name: '灯光',
        icon: '../images/service12.png'
      },
      {
        name: '教练',
        icon: '../images/service13.png'
      },
      {
        name: '空调',
        icon: '../images/service14.png'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var venue = wx.getStorageSync('venueItem');
    wx.request({
      url: app.globalData.special_url + '/wechat/gym/update/click',
      data:{
        gym_id:venue.id
      },
      method:'POST',
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
   
    this.setData({
      venue: venue
    })

    var service = [];
    var installations_name = venue.installations_name.split(',')
    this.data.service.forEach( ele => {
      installations_name.forEach( item => {
        if(item == ele.name){
          service.push(ele)
        }
      })
    })
    this.setData({
      serviceList : service
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
    wx.clearStorageSync('venueItem')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.clearStorageSync('venueItem')
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

  },
  
  go: function () {
    if (!this.data.venue.longitude || !this.data.venue.latitude){
      wx.showToast({
        title: '无位置信息',
        icon:'none'
      })
      return;
    }
    wx.openLocation({
      longitude: this.data.venue.longitude * 1,
      latitude: this.data.venue.latitude * 1,
      name: this.data.venue.gym_name,
      address: this.data.venue.address
    })
  },
  call:function(){
    if (!this.data.venue.connect_user_tel){
      wx.showToast({
        title: '无联系方式',
        icon:'none'
      })
      return;
    }
    wx.makePhoneCall({
      phoneNumber: this.data.venue.connect_user_tel,
    })
  },
})