// miniprogram/pages/special/myspecial/mySpecial.js
// miniprogram/pages/special/special.js

const { $Toast } = require('../../../dist/base/index');
var app = getApp();

var pageIndex = 0;
var totalPage = 0;
var arr = [];
var app = getApp();
var openId = app.globalData.userInfo.open_id;
function requestList(pageIndex, that) {


  wx.request({
    url: app.globalData.special_url + '/special/queryAllMySpecialList',
    data: {
      page: pageIndex,
      size: '10',
      openId: app.globalData.userInfo.weChatOpenid
    },

    success: function (res) {
      var specialList = res.data.data.specialList;
      for (var i = 0; i < specialList.length; i++) {
        arr.push(specialList[i]);
      }
      that.setData({
        totalPage: res.data.data.totalPage,
        specialList: arr,
        loading: false,
        
      })
      console.log(arr)

      $Toast.hide();
    }
  })
}
Page({

  specialDetail:function(e){
  
      var user_id = e.currentTarget.id;
      wx.navigateTo({
        url: '/pages/special/specialdetail/specialDetail?user_id=' + user_id,

      })
    
  },
  specialGuide: function (e) {
    wx.navigateTo({
      url: '/pages/special/question/question?id=' + e.currentTarget.id + '&headimg=' + e.currentTarget.dataset.headimg,
    })
  },
  requestSpecial:function(e){
    if (this.data.totalPage > pageIndex) {
      this.setData({
        loading: true,
      })
      pageIndex = pageIndex + 1;
      requestList(pageIndex, this);
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    specialList:[],
    platform: app.globalData.platform
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0, 
    });
    requestList(0,this);
    // 获取滚动区域高度
    setTimeout(() => {
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
    },500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    arr = [];
    pageIndex = 0;
    totalPage = 0;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    arr = [];
    pageIndex = 0;
    totalPage = 0;
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