var wxCharts = require('../../../utils/wxcharts.js');
var radarChart = null;
var app = getApp();
Page({

  data: {
    food: '多吃蔬菜水果和薯类。推荐我国成年人吃蔬菜300g-500g，水果200g-400g。并注意增加薯类的摄入。每天吃奶类，大豆或其制品。建议每人每天饮奶300ml，摄入30g-50g大豆或相当量的豆制品。常吃适量的鱼、禽、蛋和瘦肉。每日摄入鱼禽肉类50-75g，鱼虾类50-100g，蛋类25-50g。减少烹饪油用量，吃清淡少盐膳食。推荐每日油25-30g，盐不多于6g。食不过量，天天运动，保持健康体重。三餐分配要合理，零食要适当。每天足量饮水，合理选择饮料。如饮酒应限量。吃新鲜卫生的食物。',
    foodo: '多吃蔬菜水果和薯类。推荐我国成年人吃蔬菜300g-500g，水果200g-400g。并注意增加薯类的摄入。每天吃奶类，大豆或其制品。建议每人每天饮奶300ml，摄入30g-50g大豆或相当量的豆制品。常吃适量的鱼、禽、蛋和...',
    showAll: false,
    list: [{
        name: '肺活量',
        grade: 3,
        advice: '啊的空间是否和大卡司和啊大家是否会卡号的夫卡是来了刷卡大家回房间给',
        danwei: 'ml',
        score: '5345',
        isopen: 1
      },
      {
        name: '握力',
        grade: 2,
        advice: '啊的空间是否和大卡司和啊大家是否会卡号的夫卡是来了刷卡大家回房间给',
        danwei: 'kg',
        score: '56',
        isopen: 1
      },
      {
        name: '反应时',
        grade: 5,
        advice: '啊的空间是否和大卡司和啊大家是否会卡号的夫卡是来了刷卡大家回房间给',
        danwei: 's',
        score: '0.5',
      },
      {
        name: '稳定性',
        grade: 1,
        advice: '啊的空间是否和大卡司和啊大家是否会卡号的夫卡是来了刷卡大家回房间给',
        danwei: 's',
        score: '54',
      },
      {
        name: '俯卧撑',
        grade: 3,
        advice: '啊的空间是否和大卡司和啊大家是否会卡号的夫卡是来了刷卡大家回房间给',
        danwei: '个',
        score: '44',
      },
      {
        name: '坐位体前屈',
        grade: 4,
        advice: '啊的空间是否和大卡司和啊大家是否会卡号的夫卡是来了刷卡大家回房间给',
        danwei: 'cm',
        score: '23',
      },
      {
        name: '纵跳',
        grade: 2,
        advice: '啊的空间是否和大卡司和啊大家是否会卡号的夫卡是来了刷卡大家回房间给',
        danwei: 'cm',
        score: '56',
      },
    ],
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(app.globalData.userInfo)

    console.log(options)
    if (options.reportId == null)  {
      wx.getStorage({
        key: 'report',
        success: function(res) {
          console.log(res.data.data.data)
          const report = res.data.data.data;
          that.setData({
            report: report
          })

          // 肺活量
          let allPro = [
            JSON.parse(report.bmi),
            JSON.parse(report.fhl),
            JSON.parse(report.fwc),
            JSON.parse(report.fys),
            JSON.parse(report.tjcs),
            JSON.parse(report.wdx),
            JSON.parse(report.wl),
            JSON.parse(report.ywqz),
            JSON.parse(report.ztgd),
            JSON.parse(report.zwtqq),
          ]

          // 雷达图
          var grades = []
          var names = []
          let mustPro = []
          allPro.forEach(ele => {
            if (ele.isMust) {
              mustPro.push(ele)
              grades.push(ele.grade)
              names.push(ele.projectName)
            }
          })
          that.setData({
            mustPro: mustPro
          })

          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
          } catch (e) {
            console.error('获取屏幕宽度失败!');
          }
          radarChart = new wxCharts({
            canvasId: 'radarCanvas',
            type: 'radar',
            categories: names, // 项目名称 Array
            series: [{
              name: '综合体质评价',
              data: grades, // 分数 Array
            }],
            width: windowWidth - 24,
            height: 300,
            extra: {
              radar: {
                max: 5
              }
            }
          });
        },
      })
    } else {
      wx.request({
        url: app.globalData.tc_url + '/v2_user/report_detail',
        data: {
          reportId: options.reportId,
        },
        success: function(res) {
          console.log(res.data.data)
          const report = res.data.data;
          that.setData({
            report: report
          })

          // 肺活量
          let allPro = [
            JSON.parse(report.bmi),
            JSON.parse(report.fhl),
            JSON.parse(report.fwc),
            JSON.parse(report.fys),
            JSON.parse(report.tjcs),
            JSON.parse(report.wdx),
            JSON.parse(report.wl),
            JSON.parse(report.ywqz),
            JSON.parse(report.ztgd),
            JSON.parse(report.zwtqq),
          ]

          // 雷达图
          var grades = []
          var names = []
          let mustPro = []
          allPro.forEach(ele => {
            if (ele.isMust) {
              mustPro.push(ele)
              grades.push(ele.grade)
              names.push(ele.projectName)
            }
          })
          that.setData({
            mustPro: mustPro
          })

          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
          } catch (e) {
            console.error('获取屏幕宽度失败!');
          }
          radarChart = new wxCharts({
            canvasId: 'radarCanvas',
            type: 'radar',
            categories: names, // 项目名称 Array
            series: [{
              name: '综合体质评价',
              data: grades, // 分数 Array
            }],
            width: windowWidth - 24,
            height: 300,
            extra: {
              radar: {
                max: 5
              }
            }
          });
        }
      })
    }
  },

  onShareAppMessage: function() {

  },
  
  openorclose:function(e){
    console.log(e.currentTarget.dataset)
    var arr = this.data.mustPro;
    for(var i=0;i<arr.length;i++){
      if (arr[i].projectName == e.currentTarget.dataset.name){
        arr[i].isopen = !arr[i].isopen
        break;
      }
    }
    this.setData({
      mustPro:arr
    })
  },
  toshowAll: function() {
    this.setData({
      showAll: !this.data.showAll
    })
  }
})