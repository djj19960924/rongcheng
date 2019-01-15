// miniprogram/pages/match/allMatch/allMatch.js

const app = getApp();
const {
  $Toast
} = require('../../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    competition_list: [],
    pageIndex: 0,
    arr: [],
    ali:app.globalData.ali
  },

  toDetail: function(e) {

    console.log(e)
    wx.navigateTo({
      url: '../../match/competitionDetail/competitionDetail?competitionId=' + e.currentTarget.dataset.id,
    })
  },


  loadMore: function(e) {
    console.log('load more ')
    this.setData({
      loading: true,
    })

    let that = this;
    console.log("pageIndex == ", that.data.pageIndex);


    //  请求赛事 列表
    wx.request({
      url: app.globalData.club_url + '/match/competition/get_all',
      data: {
        'page': that.data.pageIndex,
        'size': '10',
        'key': '',
        'competitionType': 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res.data);
        const competition_result = res.data.data.data;
        console.log(competition_result);
        if (Array.isArray(competition_result) &&
          competition_result.length != 0) {

          let competition_list = [];
          for (let i = 0; i < competition_result.length; i++) {
            let startTime = new Date(competition_result[i].startTime);
            console.log(new Date(startTime));
            let endTime = new Date(competition_result[i].endTime);

            let competition_item = {};
            competition_item.startTime = startTime.getFullYear() + '.' +
              startTime.getMonth() + '.' + startTime.getDate();
            competition_item.endTime = endTime.getFullYear() + '.' +
              endTime.getMonth() + '.' + endTime.getDate();
            competition_item.competitionName = competition_result[i].competitionName;
            competition_item.status = competition_result[i].status;

            competition_item.timeDiff = that.timeFn(competition_result[i].startTime);
            competition_item.competitionId = competition_result[i].competitionId;
            competition_item.competitionImg = competition_result[i].competitionImg;
            competition_list.push(competition_item);
            that.data.arr.push(competition_item);
          }


          that.setData({
            competition_list: that.data.arr,
            loading: false,
            // pageIndex: that.data.pageIndex + 1,
          },() => {
            console.log(this.data.competition_list)
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
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this;

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

    //  请求赛事 列表
    wx.request({
      url: app.globalData.club_url + '/match/competition/get_all',
      data: {
        'page': that.data.pageIndex,
        'size': '10',
        'key': '',
        'competitionType': 1
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
          competition_item.startTime = startTime.getFullYear() + '.' +
            startTime.getMonth() + '.' + startTime.getDate();
          competition_item.endTime = endTime.getFullYear() + '.' +
            endTime.getMonth() + '.' + endTime.getDate();
          competition_item.competitionName = competition_result[i].competitionName;
          competition_item.status = competition_result[i].status;

          competition_item.timeDiff = that.timeFn(competition_result[i].startTime);
          competition_item.competitionId = competition_result[i].competitionId;
          competition_item.competitionImg = competition_result[i].competitionImg;
          competition_list.push(competition_item);
        }

        that.setData({
          competition_list: competition_list,
          arr: competition_list,
          // pageIndex: that.data.pageIndex + 1,
        })
        $Toast.hide();


        console.log(that.data.competition_list);
      }
    });

  },

  // 时间差计算函数
  timeFn: function(d1) {
    //di作为一个变量传进来
    var dateBegin = new Date(d1);
    var dateEnd = new Date(); //获取当前时间
    var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)
    // console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
    // console.log(dateDiff + "时间差的毫秒数", dayDiff + "计算出相差天数", leave1 + "计算天数后剩余的毫秒数"
    //   , hours + "计算出小时数", minutes + "计算相差分钟数", seconds + "计算相差秒数");

    return dateDiff + '天' + hours + '小时' + minutes + '分';
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