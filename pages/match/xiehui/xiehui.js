// miniprogram/pages/match/xiehui/xiehui.js
const app = getApp();
const {
  $Toast
} = require('../../../dist/base/index');

Page({

  /**
   * 页面的初始数据 
   */
  data: {

    match_list: [],
    ali:app.globalData.ali
  },



  toDetail: function(e) {

    console.log(e)


    wx.navigateTo({
      url: '../../match/matchDetail/matchDetail?matchEventId=' +
        e.currentTarget.dataset.id,
    })


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

    let that = this;
    
    // 计算滚动区域高度
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

    //  请求社团 列表
    wx.request({
      url: app.globalData.club_url + '/match/event/get_all',
      data: {
        'page': '0',
        'size': '10',
        'eventName': '',
        'matchType': '2', // 社团
        'contactInfo': '',
        'adminName': ''
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res.data);
        let match_result = res.data.data.data;

        match_result.forEach((ele) => {
          ele.createTime = ele.createTime.substring(0, 10)
        })

        that.setData({
          match_list: match_result,
        })
        $Toast.hide();

        console.log(that.data.match_list);
      }
    })
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