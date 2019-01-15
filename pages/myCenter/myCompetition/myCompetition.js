// miniprogram/pages/myCenter/myCompetition/myCompetition.js
const app = getApp();
const utils = require('../../../utils/utils.js')

let arr = [];
 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    competition_list: [],
    pageIndex: 0,
    img_url: app.globalData.ali,
  },


  loadMore: function(e) {
    console.log('load more ')
    this.setData({
      loading: true,
    })

    let that = this;
   
    console.log("pageIndex == ", that.data.pageIndex);
    //  请求社团 列表
    wx.request({
      url: app.globalData.club_url + '/match/registration/get_all_competition?open_id=' + app.globalData.userInfo.weChatOpenid + '&page=' + that.data.pageIndex + '&size=10',
      data: {
        'page': '0',
        'size': '10',
        'open_id': app.globalData.userInfo.weChatOpenid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res.data);
        const competition_list = res.data.data.data;

        if (Array.isArray(competition_list) &&
          competition_list.length != 0) {

          competition_list.forEach(ele => {
            ele.startTime = utils.getnyr(ele.startTime)
            ele.endTime = utils.getnyr(ele.endTime)
            ele.line_tabs = []
            ele.line_tabs.push({
              name: ele.status < 4 ? '活动尚未开始' : ele.status == 4 ? '活动进行中' : '活动已结束',
              color: '#fff',
              border: ele.status < 4 ? '#31C948' : ele.status == 4 ? '#0192D6' : '#ADADAD',
              background: ele.status < 4 ? '#31C948' : ele.status == 4 ? '#0192D6' : '#ADADAD',
            }, {
              name: '费用 : 免费',
              color: '#0192D6',
              border: "#0192D6",
              background: '#fff'
            })
            
            that.arr.push(ele)
          })

          that.setData({
            competition_list: that.arr,
            loading: false,
            pageIndex: that.data.pageIndex + 1,
          })

        } else {
          wx.showToast({
            title: '没有更多了',
            icon: 'none'
          })
          that.setData({
            loading: false,
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {



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

    //  请求赛事 列表
    wx.request({
      url: app.globalData.club_url + '/match/registration/get_all_competition?open_id=' + app.globalData.userInfo.weChatOpenid + '&page=' + that.data.pageIndex + '&size=10',
      data: {
        'page': '0',
        'size': '10',
        'open_id': app.globalData.userInfo.weChatOpenid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res.data);
        const competition_list = res.data.data.data;
 
        competition_list.forEach(ele => {
          ele.startTime = utils.getnyr(ele.startTime)
          ele.endTime = utils.getnyr(ele.endTime)
          ele.line_tabs = [];
          ele.line_tabs.push({
            name: ele.status < 4 ? '活动尚未开始' : ele.status == 4 ? '活动进行中' : '活动已结束',
            color: '#fff',
            border: ele.status < 4 ? '#31C948' : ele.status == 4 ? '#0192D6' : '#ADADAD',
            background: ele.status < 4 ? '#31C948' : ele.status == 4 ? '#0192D6' : '#ADADAD',
          }, {
            name: '费用 : 免费',
            color: '#0192D6',
            border: "#0192D6",
            background: '#fff'
          })
        })
        
        that.arr = competition_list;
 
        that.setData({
          competition_list: that.arr,
          pageIndex: that.data.pageIndex + 1,
        })

        console.log(that.data.competition_list);
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

  }, 
  toDetail: function (e) {

    console.log(e)
    wx.navigateTo({
      url: '../../match/competitionDetail/competitionDetail?competitionId=' + e.currentTarget.id,
    })
  },
})