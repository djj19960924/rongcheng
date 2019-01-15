// miniprogram/pages/match/matchDetail/matchDetail.js
const app = getApp();
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ali:app.globalData.ali,

    match_detail: {},
    competition_list: [],

    userList: [
      'http://img3.imgtn.bdimg.com/it/u=1524183147,3402685798&fm=26&gp=0.jpg',
      'http://img0.imgtn.bdimg.com/it/u=2985698396,128942152&fm=26&gp=0.jpg',
      'http://pic35.photophoto.cn/20150607/1155117449543010_b.jpg',
      'http://tx.haiqq.com/uploads/allimg/150322/0223205417-5.jpg',
      'http://img2.imgtn.bdimg.com/it/u=2908974860,2111816938&fm=11&gp=0.jpg'
    ]
  },


  // 加入社团
  joinMatch: function() {

    let that = this;
    console.log(app.globalData.userInfo)
    if (null == app.globalData.userInfo ||
      undefined == app.globalData.userInfo) {
      wx.showToast({
        title: '您还未登陆',
        icon: 'none',
        duration: 2000
      })

    } else {

      wx.request({
        url: app.globalData.club_url + '/match/event/join/?open_id=' + app.globalData.userInfo.weChatOpenid + '&match_id=' +
          that.data.match_detail.matchEventId,
        data: {},
        header: {
          'Accept': 'application/json'
        },
        method: 'post',
        success(res) {
          console.log(res);
          if (res.statusCode == 200) {
            wx.showToast({
              title: '申请成功',
              icon: 'none'
            })
          } else if (res.statusCode == 305) {
            wx.showToast({
              title: '已加入，不能重复加入',
              icon: 'none'
            })
          }
        },
        fail: function() {
          wx.showToast({
            title: '申请失败',
            icon: 'none'
          })
        }
      });
    }
  },

  // 转到社团所有成员
  toAllUser: function() {

    console.log(this.data.match_detail)

    let that = this;
    wx.navigateTo({
      url: '../../match/allUser/allUser?matchId=' +
        that.data.match_detail.matchEventId,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });

    console.log(options)
    let matchEventId = options.matchEventId;

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

    //  请求社团 详情
    wx.request({
      url: app.globalData.club_url + '/match/event/get_match',
      data: {
        'match_id': matchEventId,
        'openId': app.globalData.userInfo.weChatOpenid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res.data);

        that.setData({
          match_detail: res.data.data.data,
        })

        console.log(that.data.match_detail);
      }
    });


    // 社团的所有赛事
    wx.request({
      url: app.globalData.club_url + '/match/competition/all_competition_by_match_id',
      data: {
        'match_event_id': matchEventId,
        'page': 0,
        'size': 10,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'get',
      success(res) {
        console.log('--- 社团所有赛事')
        console.log(res.data);
        const competition_result = res.data.data.data;

        console.log(competition_result);
        let competition_list = [];
        for (let i = 0; i < competition_result.length; i++) {
          let startTime = new Date(competition_result[i].startTime);
          console.log(new Date(startTime));
          let endTime = new Date(competition_result[i].endTime);

          let competition_item = {};
          competition_item.competitionName = competition_result[i].competitionName
          competition_item.startTime = startTime.getFullYear() + '.' +
            startTime.getMonth() + '.' + startTime.getDate();
          competition_item.endTime = endTime.getFullYear() + '.' +
            endTime.getMonth() + '.' + endTime.getDate();
          competition_item.competitionName = competition_result[i].competitionName;
          competition_item.status = competition_result[i].status;

          competition_item.timeDiff = that.timeFn(competition_result[i].startTime);

          competition_item.line_tabs = [{
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

  onShareAppMessage: function() {

  }
})