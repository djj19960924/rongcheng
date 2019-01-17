var app = getApp();
let chart = null;
const utils = require('../../../utils/utils.js')
var that;

function formatDate(now) {
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  return  month + "-" + date;
};

function requestList() {

  wx.request({
    url: app.globalData.tc_url + '/v2_user/test_projects',
    data: {
      openId: app.globalData.userInfo.weChatOpenid
    },
    success: function (res) {
      var mustTest = res.data.data.mustTest;
      var notMustTest = res.data.data.noMustTest;
      mustTest.forEach(item => {
        item.iconName = that.data.iconMap[item.tcType];
      })
      notMustTest.forEach(item => {
        item.iconName = that.data.iconMap[item.tcType];
      })

      that.setData({
        ticeArr: that.data.ticeArr.concat(mustTest.concat(notMustTest))
      })
    }
  })
}

Page({

  sportRecommendDetail:function(e){

    console.log(e.currentTarget.dataset.sportrecommend);
    wx.setStorageSync('sportrecommend', e.currentTarget.dataset.sportrecommend);
      wx.navigateTo({
        url: '/pages/sport/sportguidance_detail/sportGuidance_Detail?sportRecommend='+e.currentTarget.dataset.sportrecommend,
      
        
      })
  
  },

  queryStep:function(){

    wx.switchTab({
      url: '/pages/tab3/index',
    })

  },

  data: {
    platform: app.globalData.platform,
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
    ticeArr: [
      {
        name: '身高',
        danWei: 'cm',
        score: '120',
        iconName: 'sg',
        tcType: 6
      },
      {
        name: '体重',
        danWei: 'kg',
        score: '10',
        iconName: 'tz',
        tcType: 6
      },
    ]
  },

  onLoad: function (options) {
    that = this;
    requestList();

    wx.showLoading({
      title: '加载中',
    })

    that.setData({
      opts: {
        onInit: initChart
      }
    })

    function initChart(canvas, width, height, F2) {
      new Promise((resolve, reject) => {
        var sportAdviceId = wx.getStorageSync('sportAdviceId');
        var open_id = wx.getStorageSync('open_id');
        wx.request({
          url: app.globalData.special_url + '/sport/queryGuidance',
          data: {
            sportAdviceId: sportAdviceId,
            open_id: open_id
          },
          method: 'GET',

          success: function (res) {
            that.setData({
              thisWeekTotalStepNumber: res.data.data.ThisWeekTotalStepNumber,
              totalKm: res.data.data.totalKm,
              hour: res.data.data.hour,
              minute: res.data.data.minute,
              totalConsumeCal: res.data.data.totalConsumeCal,
              //这是 项目推荐部分
              sportRecommend: res.data.data.sportRecommend
            });
            let ThisWeekStepNumbers = res.data.data.ThisWeekStepNumbers;
            ThisWeekStepNumbers.forEach(ele => {
              ele.date = utils.getnyr(ele.stepNumberDate*1000)
            })
            resolve(ThisWeekStepNumbers)
          }

        })
      }).then((res) => {
        chart = new F2.Chart({
          el: canvas,
          width,
          height,
          animate: true
        });
        let originDates = []
        res.forEach(ele => {
          originDates.push(ele.date)
        })
        
        chart.source(res, {
          date: {
            // tickCount: data.length < 5 ? data.length : 4,
            type: 'timeCat',
            values: originDates,
            mask: 'MM-DD'
          },
          stepNumber:{
            tickCount:7
          }
        });

        chart.axis('date', {
          grid: null,
          line: {
            stroke: '#6C6D6F'
          },
        });
        chart.axis('stepNumber', {
          grid: null,
          line:{
            stroke:'#6C6D6F'
          },
        });
        
        chart.tooltip({
          showCrosshairs: true,
          showItemMarker: false,
          background: {
            radius: 2,
            fill: '#1CA8EB',
            padding: [4, 0, 4, 14]
          },
          nameStyle: {
            fill: '#fff'
          },
          onShow(ev) {
            // console.log(ev)
            let items = ev.items;
            items[0].name = '步数';
            items[1].name = '';
            items[1].value = ' ';
          }
        });

        chart.area().position('date*stepNumber').color('l(100) 0:#00A0EC 1:#f7f7f7').shape('smooth');
        chart.line().position('date*stepNumber').color('l(100) 0:#00A0EC 1:#B7D8E8').shape('smooth');

        chart.interaction('pan');
        chart.render();
        wx.hideLoading();
        return chart;
      })
    }

  },

  onShareAppMessage: function () {

  },

  //
  chooseWeek: function () {
    wx.showToast({
      icon: 'none',
      title: '敬请期待'
    })
  },
  goTiceDetail: function (e) {
    var projectNo = e.currentTarget.dataset.projectno;
    var danwei = e.currentTarget.dataset.danwei;
    wx.navigateTo({
      url: '/pages/tice/itemData/index?projectNo=' + projectNo + '&danwei=' + danwei,
    })
  },
  goTiceIndex: function () {
    wx.navigateTo({
      url: '/pages/tice/index',
    })
  }
})