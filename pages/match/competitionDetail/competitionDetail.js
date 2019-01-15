// miniprogram/pages/match/competitionDetail/competitionDetail.js
const app = getApp();
const { $Toast } = require('../../../dist/base/index');
const utils = require('../../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: '',
    competition_id: '',
    competition_detail: null,
  },


  // 报名赛事
  joinCompetition: function() {
    wx.navigateTo({
      url: '../../match/joinCompetition/joinCompetition?competitionId='
      + this.data.competition_id,
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
    console.log(options);

    let that = this;
    
    let competitionId = options.competitionId;


    //  请求赛事 详情
    wx.request({
      url: app.globalData.club_url + '/match/competition/detail',
      data: {
        'competition_id': competitionId,
        'open_id': app.globalData.userInfo.weChatOpenid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res.data);
        res.data.data.data.startTime = utils.getnyr(res.data.data.data.startTime)
        res.data.data.data.endTime = utils.getnyr(res.data.data.data.endTime)

        that.setData({
          competition_detail: res.data.data.data,
          competition_id: res.data.data.data.competitionId,
        })
        $Toast.hide();

        console.log(that.data.competition_detail);
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