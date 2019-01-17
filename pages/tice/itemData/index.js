var util = require('../../../utils/utils.js')
var app = getApp(); 

let chart = null;

Page({

  data: {
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
    opts: null,
    arr:[]
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

  onLoad: function (options) {
    let that = this

    wx.showLoading({
      title: '加载中',
    })

    var projectNo = options.projectNo;
    //单位
    var danwei = options.projectNo != 6 ? options.danwei : '';

    this.setData({
      name: this.data.nameMap[projectNo],
      danWei: danwei,
      opts: {
        onInit: initChart
      },
    })

    function initChart(canvas, width, height, F2) {
      new Promise((resolve, reject) => {
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
          success: function (res) {
            console.log(res);
            var arr = res.data.data.list;

            let data_list = []
            let time_list = []
            let totalScore = 0
            arr.forEach(item => {
              item.date = util.getnyr(item.createTime)
              item.time = util.getsfm(item.createTime,"HH-MM")
              data_list.push(Number(item.score))
              time_list.push(item.date)
              totalScore += Number(item.score)
            })

            that.setData({
              avgScore: arr.length ? (totalScore / arr.length).toFixed(1) : 0,
            })

            let sorted = that.groupBy(arr, function (item) {
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
            console.log(groups)

            that.setData({
              groups: groups
            })
            resolve(sorted)
          }
        })
      }).then((res) => {
        let data = [] 
        res.forEach(ele => {
          data.push(ele[0])
        })
        chart = new F2.Chart({
          el: canvas,
          width,
          height,
          animate: true
        });
        let originDates = []
        data.forEach(ele => {
          originDates.push(ele.date)
        })
        chart.source(data.slice(0,7).reverse(), {
          date: {
            // tickCount: data.length < 5 ? data.length : 4,
            type: 'timeCat',
            values: originDates,
            mask: 'MM-DD'
          }
        });
        chart.tooltip({
          showCrosshairs: true,
          showItemMarker: false,
          background: {
            radius: 2,
            fill: '#1890FF',
            padding: [3, 5]
          },
          nameStyle: {
            fill: '#fff'
          },
          onShow(ev) {
            const items = ev.items;
            items[0].name = items[0].title;
          }
        });

        chart.line().position('date*score');
        chart.point()
          .position('date*score')
          .style({
            lineWidth: 1,
            stroke: '#fff'
          });

        chart.interaction('pan');
        chart.render();
        wx.hideLoading();
        return chart;
      })
    }
  },
})