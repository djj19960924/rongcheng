var util = require('../../../utils/utils.js')
var app = getApp();
var ticeDataIndex = {};
Page({

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
    },
    baseData: [],
    ticeData: [{
        name: '肺活量', // 项目名称
        value: '3453', // 测量结果
        danwei: 'ml', // 单位
        icon: 'fhl', // 图片 (根据项目名称拼音首字母命名的)
        date: '2018-12-12', // 测量日期
        grade: '3', // 分数 0-2偏低  3标准  4-5优秀
        isopen: 1, // 是否展开
      },
      {
        name: '俯卧撑',
        value: '56',
        danwei: '个',
        icon: 'fwc',
        date: '2018-12-12',
        grade: '4',
      },
      {
        name: '台阶测试',
        value: '45',
        danwei: '',
        icon: 'tjcs',
        date: '2018-12-12',
        grade: '2',
      },
      {
        name: '握力',
        value: '55',
        danwei: 'cm',
        icon: 'wl',
        date: '2018-12-12',
        grade: '5',
      },
      {
        name: '仰卧起坐',
        value: '45',
        danwei: '个',
        icon: 'ywqz',
        date: '2018-12-12',
        grade: '5',
      },
      {
        name: '纵跳',
        value: '45',
        danwei: 'cm',
        icon: 'zt',
        date: '2018-12-12',
        grade: '1',
      },
      {
        name: '稳定性',
        value: '345',
        danwei: 's',
        icon: 'wdx',
        date: '2018-12-12',
        grade: '3',
      },
      {
        name: '反应时',
        value: '0.4',
        danwei: 's',
        icon: 'fys',
        date: '2018-12-12',
        grade: '1',
        isopen: 1, // 是否展开
      },
      {
        name: '坐位体前屈',
        value: '34',
        danwei: 'cm',
        icon: 'zwtqq',
        date: '2018-12-12',
        grade: '4',
      },
    ]
  },

  onLoad: function(options) {

    console.log(options);

    let bmi = (app.globalData.userInfo.weight /
      ((app.globalData.userInfo.height / 100) *
        (app.globalData.userInfo.height / 100))).toFixed(1)
    this.setData({
      userInfo: app.globalData.userInfo,
      bmi: bmi,
    })
    console.log(bmi)

    ticeDataIndex.that = this;
    wx.request({
      url: app.globalData.tc_url + '/v2_user/tc_temp_data',
      data: {
        openId: app.globalData.userInfo.weChatOpenid,
      },
      success: function(res) {
        console.log(res)
        let okData = res.data.data.okData

        let okCount = 0;
        let riskCount = 0;
        okData.forEach(item => {
          item.icon = ticeDataIndex.that.data.iconMap[item.tcType]
          item.date = util.getnyr(item.createTime)
          if (item.grade > 2) {
            okCount++;
          } else {
            riskCount++;
          }
        })

        ticeDataIndex.that.setData({
          ticeData: okData,
          okCount: okCount,
          riskCount: riskCount,
        })
      }
    })
  },

  onShareAppMessage: function() {

  },

  // 展开收起
  openorclose: function(e) {
    let arr = this.data.ticeData;
    // arr.forEach(ele => {
    //   if (ele.name == e.currentTarget.dataset.name){
    //     ele.isopen = !ele.isopen
    //   }
    // })
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name == e.currentTarget.dataset.name) {
        arr[i].isopen = !arr[i].isopen;
        break;
      }
    }
    this.setData({
      ticeData: arr
    })
  },

  
           goReport: function() {
            wx.showModal({
              content: '报告每天仅能生成一次，且不可更改',
              success: function(res) {
                if (res.cancel) {} else {
                  console.log('=== report ')

                  wx.request({
                    url: app.globalData.tc_url + '/v2_user/report?openId=' +
                      app.globalData.userInfo.weChatOpenid,
                    method: 'POST',
                    data: {
                      openId: app.globalData.userInfo.weChatOpenid,
                    },
                    success: function(res) {
                      console.log(res)
                      wx.setStorage({
                        key: 'report',
                        data: res,
                      })
                      wx.navigateTo({
                        url: '../report/index',
                      })
                    }
                  })
                }
              },
              fail: function() {
                console.log('=== fail ')
              }
            })

  }
})