// pages/tice/index.js
var util = require('../../utils/utils.js')

var app = getApp();
var tcIndex = {};
var open_id = 'ogCXM4jvfgStfiV9ptZ56rffGd-g';

function requestList() {

  wx.request({
    url: app.globalData.tc_url + '/v2_user/test_projects',
    data: {
      openId: app.globalData.userInfo.weChatOpenid
    },
    success: function(res) {

      console.log(res)

      //已测 项目
      var yetNoTestCount = 0;
      var yetTestCount = 0;

      var mustTest = res.data.data.mustTest;
      var notMustTest = res.data.data.noMustTest;
      mustTest.forEach(item => {
        item.iconName = tcIndex.that.data.iconMap[item.tcType];
        item.date = util.getnyr(item.createTime)
        if (item.score) {
          yetTestCount++
        }
      })
      notMustTest.forEach(item => {
        item.iconName = tcIndex.that.data.iconMap[item.tcType];
        item.date = util.getnyr(item.createTime)
        if (item.score) {
          yetNoTestCount++
        }
      })
      var canMakeReport = false

      //标准体测项 数目
      var mustTestCount = mustTest.length;
      var noMustTestCount = notMustTest.length;

      if (yetTestCount == mustTestCount) {
        canMakeReport = true;
      }

      console.log(res);
      tcIndex.that.setData({
        mustTestCount: mustTestCount,
        noMustTestCount: noMustTestCount,
        canMakeReport: canMakeReport,
        yetTestCount: yetTestCount,
        yetNoTestCount: yetNoTestCount,
        mustTest: mustTest,
        notMustTest: notMustTest
      })

      wx.hideLoading()
      console.log(tcIndex.that.data.mustTest)
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconMap: {
      1: 'fhl',
      2: 'wl',
      3: 'djzl',
      4: 'fwc',
      5: 'fysj',
      6: 'sg',
      7: 'tjcs',
      8: 'tz',
      9: 'ywqz',
      10: 'ztgd',
      11: 'zwtqq',
    }
  },

  onLoad: function(options) {
    tcIndex.that = this;

    this.setData({
      userInfo: app.globalData.userInfo,
    })

    console.log('123456')
    console.log(this.data.userInfo)

    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: function(res) {
        var code = res.code;
        //授权获取用户信息
        wx.getUserInfo({
          lang: 'zh_CN',
          success: function(res) {
            console.log(res)
            // 访问后台接口获取openid跟userInfo
            var iv = res.iv;
            var encryptedData = res.encryptedData;

            wx.request({
              url: app.globalData.tc_url + "/v2_xcx/login",
              method: 'POST',
              data: {
                code: code,
                iv: iv,
                encryptedData: encryptedData,
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function(res) {
                console.log(res)
                // app.globalData.newUserId = res.data.data.id;

                requestList();

              },
              fail: function(res) {
                console.log('获取失败:', res);
              }
            });
          },
          fail: function(res) {
            console.log("getUserInfo不同意授权！");
            that.openSetting();
          }
        })
      },
      fail: function(res) {
        console.log("登录失败！");
      },
    })
  },

  onShareAppMessage: function() {

  },

  gocode: function() {
    wx.navigateTo({
      url: 'code/index',
    })
  },
  goDataDetail: function(res) {
    console.log(res);
    if (!res.currentTarget.dataset.score){
      wx.showToast({
        title:'请先测试该项目',
        icon:'none'
      })
      return;
    }

    var projectNo = res.currentTarget.dataset.projectno;
    var danwei = res.currentTarget.dataset.danwei;
    wx.navigateTo({
      url: 'itemData/index?projectNo=' + projectNo + '&danwei=' + danwei,
    })
  },
  goTiceData: function(res) {

    console.log(res)

    var canMakeReport = res.currentTarget.dataset.canmakereport;

    if (!canMakeReport) {
      wx.showToast({
        icon: 'none',
        title: '请先将标准项测完呦',
        duration: 2000
      })
      return;
    }
    wx.navigateTo({
      url: 'ticeData/index',
    })
  },
  sao: function() {
    wx.scanCode({　
      success: (res) => {　
        console.log(res)　
      }　
    })
  },

  test: function() {
    console.log('>>>>> test ')
    wx.showModal({
      content: '即将模拟数据',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '生成中',
          })
          wx.request({
            url: app.globalData.tc_url + "/test?openId=" +
              app.globalData.userInfo.weChatOpenid,
            method: 'GET',
            data: {},
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              console.log(res)
              wx.showLoading({
                title: '更新中',
              })
              requestList()
            },
            fail: function(res) {
              console.log('获取失败:', res);
            }
          });
        }
      }
    })
  }
})