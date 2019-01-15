var wxCharts = require('../../../utils/wxcharts.js');
var util = require('../../../utils/utils.js')
var app = getApp();
var areaChart = null;
Page({

  data: {
    data: [{
        date: '12月05日',
        time: [{
            key: '10:12',
            value: '56'
          },
          {
            key: '10:12',
            value: '56'
          },
          {
            key: '10:12',
            value: '56'
          },
        ]
      },
      {
        date: '12月06日',
        time: [{
            key: '10:12',
            value: '56'
          },
          {
            key: '10:12',
            value: '56'
          },
          {
            key: '10:12',
            value: '56'
          },
          {
            key: '10:12',
            value: '56'
          },
        ]
      },
    ],
    nameMap: {
      1: '肺活量',
      2: '握力',
      3: '稳定性',
      4: '俯卧撑',
      5: '反应时',
      6: 'BMI',
      7: '台阶测试',
      8: '体重',
      9: '仰卧起坐',
      10: '纵跳高度',
      11: '坐位体前屈',
    },
  },

  groupBy: function(array, f) {
    let groups = {};
    array.forEach(function(o) {
      let group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function(group) {
      return groups[group];
    });
  },

  onLoad: function(options) {
    // console.log(app.globalData.userInfo.weChatOpenid);

    let that = this
    var projectNo = options.projectNo;
    //单位
    var danwei = options.danwei;

    this.setData({
      name: this.data.nameMap[projectNo],
      danWei: danwei,
    })

    wx.request({
      url: app.globalData.tc_url + '/v2_user/tc_list',
      method: 'POST',
      data: {
        userId: app.globalData.userInfo.weChatOpenid,
        tcType: projectNo
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res);
        var arr = res.data.data.list;

        let data_list = []
        let time_list = []
        arr.forEach(item => {
          item.date = util.getnyr(item.createTime)
          data_list.push(Number(item.score)) 
          time_list.push(item.date)
        })
        that.setData({
           arr: arr,
        })
      
        let sorted = that.groupBy(arr, function(item) {
          return [item.date];
        });

        console.log(sorted)
        let groups = []

        sorted.forEach(item => {
          let temp = {} 
          temp.date = item[0].date
          temp.list = item
          groups.push(temp)
        
        })

        that.setData({
          groups: groups
        })

        // console.log(groups)
        console.log(data_list)
        areaChart = new wxCharts({
          canvasId: 'areaCanvas',
          type: 'area',
          // categories: ['12-11', '12-11', '12-11', '12-11', '12-11', '12-11', '12-12'],
          categories: time_list,
          animation: true,
          series: [{
            name: '日期',
            // data: [56, 54, 58, 45, 55, 51, 12],
            data: data_list,
            format: function (val) {
              return val;
            }
          }],
          yAxis: {
            // title: '',
            format: function (val) {
              return val;
            },
            min: 0,
            fontColor: '#9F9F9F',
            gridColor: '#9F9F9F',
            titleFontColor: '#9F9F9F'
          },
          xAxis: {
            fontColor: '#9F9F9F',
            gridColor: '#9F9F9F'
          },
          extra: {
            legendTextColor: '#9F9F9F'
          },
          width: windowWidth,
          height: 200
        });

      }
    })

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
  },

  onShareAppMessage: function() {

  },

  touchHandler: function(e) {
    console.log(areaChart.getCurrentDataIndex(e));
    areaChart.showToolTip(e);
  },

})