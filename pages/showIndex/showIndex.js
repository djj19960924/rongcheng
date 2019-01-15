// miniprogram/pages/showIndex/showIndex.js
const app = getApp();

var arr = [];
Page({
  sport: function() {
    wx.switchTab({
      url: '/pages/sport/sportIndex',
    })

  },
  questions: function() {
    wx.navigateTo({
      url: '/pages/special/question/question',
    })
  },

  //场馆跳转
  venue: function() {
    wx.navigateTo({
      url: '/pages/venue/venue',
    })
  },
  //专家列表跳转
  specialList: function() {
    wx.navigateTo({
      url: '/pages/special/special',

    })
  },
  // 意见反馈
  toAdvice: function () {
    wx.navigateTo({
      url: '/pages/myCenter/feedback/feedback',
    })
  },
  // 新闻
  toNews: function () {
    wx.navigateTo({
      url: '/pages/news/newsList/index',
    })
  },
  // 报修
  toEquipment: function () {
    wx.navigateTo({
      url: '/pages/equipment/index',
    })
  },
  // 体测
  toTice: function () {
    wx.navigateTo({

      url: '/pages/tice/index',

    })

  },

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    competition_list: [],
    imgUrls: [
      '/images/index/banner.png',
      '/images/index/banner.png',
      '/images/index/banner.png',
    ],
    ads: [
      '/images/index/adv.png',
      '/images/index/adv.png',
    ],
    aliImageAddr: app.globalData.ali
  },


  // 社团跳转 
  clickMe: function() {
    wx.navigateTo({
      url: '../match/match/match',
    })
  },

  // 个人中心
  myCenter: function() {
    wx.navigateTo({
      url: '../myCenter/myCenter/myCenter',
    })
  },


  getUuid: function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function() {
    console.log('======== index onload ========')
    var start = new Date().getTime()
    // wx.showLoading({
    //   title: '初始化...',
    // })
    let that = this
    if (that.data.canIUse) {
      /**
       * 登陆
       */
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log('======= start do login')
          console.log(new Date().getTime() - start)
          console.log(res)

          if (res.errMsg == "login:ok") {
            wx.request({
              url: app.globalData.base_url + '/user/login/login',
              method: 'POST',
              data: {
                'weChatOpenid': app.globalData.app_id, // app id
                'code': res.code,
                sex: 0,
                nickName: 'nick',
                headImg: 'img'
              },
              header: {
                'Accept': 'application/json'
              },
              success: function(res) {
                console.log(res)
                if (res.data.meta.code == 200) {
                  app.globalData.userInfo = res.data.data.data;
                  console.log("djj:",app.globalData.userInfo);
                  wx.showToast({
                    title: '登陆成功',
                    icon: 'none'
                  })

                } else {
                  // 登陆失败
                  console.log('login error ')
                  console.log(res.data)
                  /**
                   * 登陆失败
                   */
                  wx.hideLoading()
                  wx.showModal({
                    title: '微信登陆失败，重新登陆！',
                    content: '',
                    success: function(res) {
                     
                    }
                  })
                }

                console.log('======= login over =======')
                console.log(new Date().getTime() - start)
              },
              fail: function() {
                wx.hideLoading()
                wx.showModal({
                  title: '服务器请求失败，是否重试',
                  content: '',
                  success: function(res) {
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '../showIndex/showIndex',
                      })
                    } else if (res.cancel) {
                      wx.navigateBack({
                        delta: -1
                      })
                    }
                  }
                })
              }
            })
          } else { // 微信登陆失败
            wx.hideLoading()
            wx.showModal({
              title: '微信登陆失败，重新登陆！',
              content: '',
              success: function(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../showIndex/showIndex',
                  })
                } else if (res.cancel) {
                  wx.navigateBack({
                    delta: -1
                  })
                }
              }
            })
          }
        },
        fail: res => {
          console.log(res)
          /**
           * 登陆失败　
           */
          wx.hideLoading()
          
        },
        complete: res => {
          console.log(res)
        }
      })
    } else {
      wx.hideLoading()
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.showModal({
        title: '请更新微信版本!',
        content: '',
        success: function(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: -1
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: -1
            })
          }
        }
      })
    }

    //  请求社团 列表
    wx.request({
      url: app.globalData.club_url + '/match/competition/get_all',
      data: {
        'page': '0',
        'size': '10'
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
        })

        console.log(that.data.competition_list);
      }
    }),

      console.log("调用新闻资讯")
      wx.request({
        url: app.globalData.special_url + '/wechat/news/list',
        data: {
          pn: 0,
          ps: 2
        },
        method: 'POST',
        header: {
          "content-type": "application/json;charset=UTF-8"
        },
        success: function (res) {
          var list = res.data.data.list
          var newsimage;
          for (var i = 0; i < list.length; i++) {
            arr.push(list[i]);
            newsimage = list[0].imgList[0];
          }
          that.setData({
            arr: arr,
            newsimage: newsimage
          })
        }
      })
  },

  // 时间差计算函数
  timeFn: function (d1) {
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
    arr = [];
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    arr = [];
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
    wx.navigateTo({
      url: '../match/competitionDetail/competitionDetail?competitionId=' + e.currentTarget.dataset.id,
    })
  },
  more:function(){
    wx.navigateTo({
      url: '../match/match/match',
    })
  }


})