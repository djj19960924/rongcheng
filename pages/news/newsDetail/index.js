// pages/news/newsDetaile/index.js
var WxParse = require('../../../wxParse/wxParse.js'); 
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.item))
    let item = JSON.parse(options.item)
    WxParse.wxParse('article', 'html', item.content, this, 20);
    var newsStr = JSON.parse(options.item);
    //点击量+1;
    wx.request({
      url: app.globalData.special_url + '/wechat/news/update/click ',
      data:{
        news_id: newsStr.id
      },
      method:'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    })
    this.setData({
      item: item
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