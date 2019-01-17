// miniprogram/pages/match/match/match.js

const { $Toast } = require('../../../dist/base/index');
const utils = require('../../../utils/utils.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: app.globalData.ali,
    search_key: '',
    now_week_num: 0,
    next_week_num: 0,
    competition_list: [],
    competitionType: 1,// 1:赛事 2:活动
  },

  // 搜索框 
  inputSearch: function(e) {
    console.log(e);
    this.setData({
      search_key: e.detail.value,
    })
  },
  // 搜索点击
  tapSearch: function() {
    console.log('click seach')

    wx.showLoading({
      title: '搜索中...',
    })
    let that = this;

    // 赛事活动搜索
    wx.request({
      url: app.globalData.club_url + '/match/competition/get_all',
      data: {
        'page': '0',
        'size': '10',
        'key': that.data.search_key,
        'competitionType': that.data.competitionType // please 查一手 赛事 or 活动 
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res.data);
        const competition_result = res.data.data.data;
        console.log(competition_result);
        let competition_list = [];
        for (let i = 0; i < competition_result.length; i++) {
          let startTime = new Date(competition_result[i].startTime);
          console.log(new Date(startTime));
          let endTime = new Date(competition_result[i].endTime);

          let competition_item = {};
          competition_item.startTime = utils.getnyr(startTime);
          competition_item.endTime = utils.getnyr(endTime);
          competition_item.competitionName = competition_result[i].competitionName;
          competition_item.status = competition_result[i].status;

          competition_item.timeDiff = utils.timeFn(competition_result[i].startTime);
          competition_item.competitionId = competition_result[i].competitionId;

          competition_item.competitionImg = competition_result[i].competitionImg;

          competition_list.push(competition_item);
        }

        that.setData({
          competition_list: competition_list,
        })

        console.log(that.data.competition_list);
        wx.hideLoading()
      },
      fail: function(res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '搜索失败',
        })
      }
    })
  },

  // 协会跳转
  toXiehui: function() {
    wx.navigateTo({
      url: '../../match/xiehui/xiehui',
    })
  },

  // 俱乐部跳转
  toClub: function() {
    wx.navigateTo({
      url: '../../match/club/club',
    })
  },
  //  团体会
  toTuantihui: function() {
    wx.navigateTo({
      url: '../../match/tuantihui/tuantihui',
    })
  },
  // 我的社团
  toMyMatch:function(){
    wx.navigateTo({
      url: '/pages/myCenter/myMatch/myMatch',
    })
  },

  //  更多
  allMatch: function() {
    if (this.data.competitionType == 1) {
      wx.navigateTo({
        url: '../../match/allMatch/allMatch',
      })
    } else {
      wx.navigateTo({
        url: '../../match/allHd/index',
      })
    }
  },

  // 赛事详情
  toDetail: function(e) {

    console.log(e)
    wx.navigateTo({
      url: '../../match/competitionDetail/competitionDetail?competitionId=' + e.currentTarget.dataset.id,
    })
  },

  // 赛事列表
  getsaishi:function(){
    let that = this;
    if (this.competitionType == 1)
      return;
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    this.setData({
      competitionType:1
    },() => {
      that.getList()
    })
  },
  // 活动列表
  gethuodong: function () {
    let that = this;
    if (this.competitionType == 2)
      return;
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    this.setData({
      competitionType: 2
    }, () => {
      that.getList()
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this;

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

    //  请求社团 列表
    this.getList();
  },

  getList: function(){
    let that = this;
    //  请求社团 列表
    wx.request({
      url: app.globalData.club_url + '/match/competition/get_all',
      data: {
        'page': '0',
        'size': '10', 
        'competitionType': that.data.competitionType // please 查一手 赛事 or 活动 
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res.data);
        const competition_result = res.data.data.data;
        console.log(competition_result);
        let competition_list = [];
        for (let i = 0; i < competition_result.length; i++) {
          let startTime = new Date(competition_result[i].startTime);
          console.log(new Date(startTime));
          let endTime = new Date(competition_result[i].endTime);

          let competition_item = {};
          competition_item.startTime = utils.getnyr(startTime);
          competition_item.endTime = utils.getnyr(endTime);
          competition_item.competitionName = competition_result[i].competitionName;
          competition_item.status = competition_result[i].status;

          competition_item.timeDiff = utils.timeFn(competition_result[i].startTime);
          competition_item.competitionId = competition_result[i].competitionId;

          competition_item.competitionImg = competition_result[i].competitionImg;

          competition_item.line_tabs = [
            {
              name: competition_item.status < 4 ? '活动尚未开始' : competition_item.status == 4 ? '活动进行中' : '活动已结束',
              color: '#fff',
              border: competition_item.status < 4 ? '#31C948' : competition_item.status == 4 ? '#0192D6' : '#ADADAD',
              background: competition_item.status < 4 ? '#31C948' : competition_item.status == 4 ? '#0192D6' : '#ADADAD',
            },
            {
              name: '费用 : 免费',
              color: '#0192D6',
              border: "#0192D6",
              background: '#fff'
            }
          ]

          competition_list.push(competition_item);
        }

        that.setData({
          competition_list: competition_list,
        })
        $Toast.hide();

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

  }
})