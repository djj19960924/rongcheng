// miniprogram/pages/special/specialdetail/specialDetail.js

var specialDetail = {};

var app = getApp();
// const { $Toast } = require('../../dist/base/index');

Page({


  specialGuide:function(e){
    
    wx.navigateTo({
      url: '/pages/special/question/question?id=' + specialDetail.id+'&headimg='+specialDetail.headimg,
    })
   
    //var user_id = e.currentTarget.id;
    //console.log(user_id);
    //wx.navigateTo({
      //url: '/pages/special/specialguide/specialGuide?user_id='+user_id,
    //})
  },

  /**
   * 页面的初始数据
   */
  data: {
    platform: app.globalData.platform,
    ali:app.globalData.ali
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_id = options.user_id;
    var that = this;
    wx.request({
      url: app.globalData.special_url + '/special/querySpecialDetail',
      data:{
        user_id:user_id
      },
      success:function(res){
        specialDetail.id = res.data.data.special.id;
        specialDetail.headimg = res.data.data.special.headimg;
       
        var special = res.data.data.special;
        that.setData({
          headimg:special.headimg,
          name:special.name,
          professional_titles:special.professional_titles,
          workunit:special.workunit,
          service_count:special.service_count,
          good_info:special.good_info,
          introduction:special.introduction,
          user_id:special.user_id
        })
      }
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

  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
})