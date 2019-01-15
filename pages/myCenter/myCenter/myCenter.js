// miniprogram/pages/myCenter/myCenter/myCenter.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    platform: app.globalData.platform
  },

  // 我的社团
  toMatch: function() {
    wx.navigateTo({
      url: '../../myCenter/myMatch/myMatch',
    })
    
  },

  // 我的赛事
  toCompetition: function() {
    wx.navigateTo({
      url: '../../myCenter/myCompetition/myCompetition',
    })
  },

  // 我的体测
  toTc: function() {
    wx.navigateTo({
      url: '../../myCenter/myTc/myTc',
    })
  },

  // 我的巡检
  toRms: function() {
    wx.navigateTo({
      url: '../../myCenter/myRms/myRms',
    })
  },

  // 去体测
  goCode:function(){
    wx.navigateTo({
      url: '/pages/tice/code/index',
    })
  },

  onGotUserInfo(e) {
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    this.setData({
      wechatUserInfo: e.detail.userInfo
    })
    let that = this;

    wx.request({
      url: app.globalData.base_url + '/user/login/register',
      method: 'POST',
      data: {
        code: e.detail.encryptedData,
        iv: e.detail.iv,
        weChatOpenid: app.globalData.userInfo.weChatOpenid,
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.meta.code == 200) {
          that.setData({
            userInfo: res.data.data.data
          },()=>{
            console.log(this.data.userInfo)
          })
        }

      },
      fail: function(res) {
        console.log(res)
      }
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
    this.setData({
       userInfo: app.globalData.userInfo
    })

    return;

    let that = this;
    wx.request({
      url: app.globalData.base_url + '/user/wx_user/infoById?open_id=' +
        app.globalData.userInfo.weChatOpenid,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        that.setData({
          userInfo: res.data.data.data
        })
      },
      fail: function(res) {
        console.log(res);
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})