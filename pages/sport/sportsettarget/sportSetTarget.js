// miniprogram/pages/sport/sportsettarget/sportSetTarget.js

var app = getApp();
var sportSetTarget = {};

//查询或者创建新运动目标
function queryOrNewsSportTarget(open_id,that) {
 
  wx.request({
    url: app.globalData.special_url + '/sport/queryOrNewsSportTarget',
    data: {
      open_id: open_id
    },
    success: function (res) {
      //获取到 最新的运动目标 根据身高体重等信息
     
      var sportTarget = res.data.data.sportTarget;

      var reduceJin = res.data.data.reduceJin;
    

      sportSetTarget.that.setData({
        bmi:sportTarget.bmi,
        dayTotalConsumeCal: sportTarget.dayTotalConsumeCal,
        stepNumber: sportTarget.stepNumber,
        dayDefaultCal: sportTarget.dayDefaultCal,
        dayWalkCal: sportTarget.dayWalkCal,
        reduceJin: reduceJin
      })

    }
  })
}
//设置步数
function setStepNumber(stepNumber , open_id){
  wx.request({
    url: app.globalData.special_url+'/sport/setSportTargetStepNumber',
    data:{
      open_id: open_id,
      stepNumber: stepNumber
    },
    header:{
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method:'POST',
    success:function(res){
      var sportTarget = res.data.data.sportTarget;
      var reduceJin = res.data.data.reduceJin;
    
      sportSetTarget.that.setData({
        dayTotalConsumeCal: sportTarget.dayTotalConsumeCal,
        dayWalkCal:sportTarget.dayWalkCal,
        stepNumber: stepNumber,
        reduceJin: reduceJin
      })

    }
  })

}
Page({

  setOver:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  


  //设置步数的 bind
  setStepNumber:function(event){
    var arr = this.data.btnList;
    arr.forEach(ele => {
      if (event.currentTarget.id == ele.a){
        ele.isChoose = true;
      }else ele.isChoose = false;
    })
    this.setData({
      btnList:arr
    })

    var open_id = app.globalData.userInfo.weChatOpenid;
    var stepNumber = event.currentTarget.id;
    setStepNumber(stepNumber,open_id,this);
  },

  /**.
   * 页面的初始数据
   */
  data: {
    btnList: [
      {
        a: '2000',
        b: '轻松',
        isChoose: false
      },
      {
        a: '5000',
        b: '标准',
        isChoose: true
      },
      {
        a: '8000',
        b: '困难',
        isChoose: false
      },
      {
        a: '10000',
        b: '极高',
        isChoose: false
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    sportSetTarget.that = this;
    var open_id = app.globalData.userInfo.weChatOpenid;




    queryOrNewsSportTarget(open_id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  }
})