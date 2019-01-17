// pages/message/message.js

var app = getApp();

var message = {};
var pageIndex = 0;
var totalPage = 0;
var open_id = app.globalData.openId;
const { $Toast } = require('../../dist/base/index');

function requestMessageList(pageIndex,size){

     
//         var open_id = app.globalData.userInfo.open_id;
//  console.log(open_id);
//   console.log(app.globalData.userInfo);
 

  wx.request({
    url: app.globalData.special_url + '/message/queryNotReadHistoryMessages',
    data:{
      page:pageIndex,
      size:size,
      open_id: open_id
    },
    success:function(res){
      console.log(res);
      var messages = res.data.data.messageDtos;
      var platFormLastMsg = res.data.data.platFormLastMsg;
      var platFormLastSendTime = res.data.data.platFormLastSendTime;
      var platFormNotReadCount = res.data.data.platFormNotReadCount;
      totalPage = res.data.data.totalPage;

      if(pageIndex === 0){
        var plateFormObj = {
          specialName: '荣成服务平台',
          specialHeadImage: '荣成服务头像',
          lastMessage: platFormLastMsg,
          lastSendTime: platFormLastSendTime,
          notReadCount: platFormNotReadCount
        }
        messages.unshift(plateFormObj);
      }
      message.that.setData({
        messages:messages
      })
      $Toast.hide();
    }

  })

}

Page({

  chatDetail:function(e){
    console.log(e);
    var specialId = e.currentTarget.id;
    var specialImage = e.currentTarget.dataset.specialHeadImage;
    

    wx.navigateTo({
      url: '/pages/special/question/question?id=' + specialId + "&headimg=" + specialImage,
    })

  },

  /**
   * 页面的初始数据
   */
  data: {
  
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
    
    message.that  = this
    open_id =  app.globalData.userInfo.weChatOpenid;
    console.log(open_id);
    requestMessageList(0,10);

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
    message = []
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    message = []
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