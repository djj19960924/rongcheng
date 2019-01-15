// miniprogram/pages/special/specialguide/specialGuide.js
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
    //读取open_id
    var open_id = "ogCXM4jvfgStfiV9ptZ56rffGd-g"
    var user_id = options.user_id;
    wx.request({
      url: 'http://localhost:8077/special/specialGuide/',
      data:{
        page:'0',
        size:'5',
        user_id:user_id,
        open_id:open_id
      },
      success:function(res){
        console.log(res)

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

  }
})