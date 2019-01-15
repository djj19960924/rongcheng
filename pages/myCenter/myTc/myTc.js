var util = require('../../../utils/utils.js')
const app = getApp()
Page({

  data: {
    demoArr: [1, 1, 1, 1, 1, 1, 11, , 1, 1, 1, 1, 1],
    pageIndex: 0,
  },

  onLoad: function(options) {
    let that = this;

    wx.request({
      url: app.globalData.tc_url + '/v2_user/report_list',
      method: 'POST',
      data: {
        usid: app.globalData.userInfo.weChatOpenid,
        pn: that.data.pageIndex,
        ps: 10,
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res)

        if (res.data.code == 200) {
          let result = res.data.data.list

          result.forEach(item => {
            item.date = util.getnyr(item.createTime)
            item.level_percent = ((item.level * 100) / 5).toFixed(0)
            item.score_percent = ((item.score * 100) / item.targetScore).toFixed(0)
          })

          that.setData({
            arr: result,
          })

        } else {
          that.setData({
            arr: []
          })
        }


      },
      fail: function(res) {
        console.log(res);
      }
    });



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
  },

  onShareAppMessage: function() {

  },

  goData: function(res) {
    console.log(res)


    wx.navigateTo({
      url: '/pages/tice/report/index?reportId=' + res.currentTarget.dataset.id,
    })
  },
})