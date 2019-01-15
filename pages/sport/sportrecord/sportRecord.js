// miniprogram/pages/sport/sportRecord/sportRecord.js

var app = getApp();
var pageIndex = 0;
var totalPage = 0;
var arr = [];
function querySportTypeList(pageIndex,size,that){

  wx.request({
    url: app.globalData.special_url + '/sport/querySportTypeList',
    data:{
      page:pageIndex,
      size:size,
    },
    success:function(res){

      var sportTypes = res.data.data.sportTypes;
   
      for(var i = 0; i < sportTypes.length; i++){
        arr.push(sportTypes[i]);
      }

      that.setData({
        totalPage:res.data.data.totalPage,
        sportTypes:arr,
        
      })

       
    }

  })

}

//选择完 运动记录后 确定按钮调用的 保存运动记录数
function saveSportRecord(cal, minutes,sportTypeId){

  var sportAdviceId = wx.getStorageSync('sportAdviceId');
  console.log(sportAdviceId);
  wx.request({
    url: app.globalData.special_url + '/sport/saveSportRecord',
    data:{
      cal:cal,
      minutes:minutes,
      sportAdviceId:sportAdviceId,
      sportTypeId: sportTypeId
    },
    method:'POST',
    header:{
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success:function(res){
      wx.navigateBack({
        delta: 1
      })

    }
    
  })

}


Page({

 
  chooseDetailRecord:function(e){
    
    var sportRecord = e.currentTarget.dataset;
    console.log(sportRecord);

    

    //获取到数据后 弹出底层框 这里不会写底层弹框

    //根据sportRatio 系数 根据 尺子滑动的 分钟数 实时计算出 消耗的卡路里 转换为 int 型，四舍五入
    // cal = sportRatio *  分钟数
    

    //确定按钮
    var cal = 200;
    var minutes = 60;
    saveSportRecord(cal, minutes, sportRecord.sporttypeid);
    
  },


  //滚动到底端触发
  requestSportType:function(){
    
    if (this.data.totalPage > pageIndex) {
      pageIndex = pageIndex + 1;
      querySportTypeList(pageIndex, 100 , this);
    }

  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    querySportTypeList(pageIndex, 100, this);

    // 获取滚动区域高度
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

  }
})