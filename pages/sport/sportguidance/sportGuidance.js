// pages/sport/sportGuidance/sportGuidance.js
const { $Toast } = require('../../../dist/base/index'); 
const wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
var that;


function formatDate(now) {
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  return  month + "-" + date;
} 




function queryGuidance() {
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
      
    
      $Toast.hide();
      
      // charts ------------start
      var thisWeekStepNumber = res.data.data.ThisWeekStepNumbers;
      
      
      thisWeekStepNumber.forEach(ele =>{
      
        ele.stepNumberDate = formatDate(new Date(ele.stepNumberDate * 1000))
      })

      var categories = [];
      var data = [];
      thisWeekStepNumber.forEach(ele => {
        data.push(ele.stepNumber)
        categories.push(ele.stepNumberDate)
      })
 
      lineChart = new wxCharts({
        canvasId: 'lineCanvas',
        type: 'line',
        categories: categories,
        animation: true,
        // background: '#f5f5f5',
        series: [
          {
            name: '日期',
            data: data,
            format: function (val, name) {
              return val;
            }
          }
        ],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: '步数',
          format: function (val) {
            return val;
          },
          min: 0
        },
        width: 414,
        height: 200,
        dataLabel: false,
        dataPointShape: true,
        enableScroll: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      // charts ------------end
     
      that.setData({
        thisWeekTotalStepNumber: res.data.data.ThisWeekTotalStepNumber,
        totalKm: res.data.data.totalKm,
        hour: res.data.data.hour,
        minute: res.data.data.minute,
        totalConsumeCal: res.data.data.totalConsumeCal,
        //这是 项目推荐部分
        sportRecommend:res.data.data.sportRecommend
      });
    
   
      

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
      url: '/pages/sport/sportIndex',
    })

  },

  /**
   * 页面的初始数据
   */
  data: {
    platform: app.globalData.platform
  },

  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    that = this;
    queryGuidance();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})