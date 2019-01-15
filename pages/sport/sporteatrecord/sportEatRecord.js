// miniprogram/pages/sport/sportEatRecord/sportEatRecord.js
var app = getApp();
const { $Toast } = require('../../../dist/base/index');
var pageIndex = 0;
var totalPage = 0;
var bindEatType = 1;
var arr = [];
//查询 饮食类型通过Type
function requestEatByType(pageIndex,size,eatTypeId,that){

  wx.request({
    url: app.globalData.special_url + '/sport/queryEatsByType',
    data:{
      page:pageIndex,
      eatTypeId:eatTypeId,
      size:size
    },
    success:function(res){
      var sportEatTypes = res.data.data.sportEatTypes;
     // console.log(sportEatTypes);
      for(var i = 0; i < sportEatTypes.length; i++){
          arr.push(sportEatTypes[i]);
      }
      that.setData({
        totalPage:res.data.data.totalPage,
        sportEatTypes:arr,
        loading:false
      })
      $Toast.hide();
    
    }
  })
}

function saveSportEatRecord(cal,gram,foodId){
  var sportAdviceId = wx.getStorageSync('sportAdviceId');
  //console.log(sportAdviceId);

  wx.request({
    url: app.globalData.special_url + '/sport/saveSportEatRecord',
    data:{
      cal:cal,
      gram:gram,
      foodId:foodId,
      sportAdviceId: sportAdviceId
    },
    method:'POST',
    header:{
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      wx.navigateBack({
        delta: 1
      })
    }
  })


}
Page({

  chooseDetailEatRecord:function(e){

    console.log(e);
     // console.log("hello")
      
      var sportEatRecord = e.currentTarget.dataset;
      //console.log(sportEatRecord);

      //获取到数据后 弹出底层框 这里不会写底层弹框
      //console.log(sportEatRecord.foodratio);
      //根据foodRatio 系数 根据 尺子滑动的 克数 实时计算出 消耗的卡路里 转换为 int 型，四舍五入
      // cal = sportRatio *  分钟数

      //确定按钮
      //这里自定义的 计算出来的cal， 和选择的时间
      var cal = 200;
      var gram = 60;
      saveSportEatRecord(cal, gram, sportEatRecord.foodid);

  },



  //滚动条底端 查询
  requestMoreEatType:function(e){
    this.setData({
      loading:true,
    })
    if(this.data.totalPage > pageIndex){
        pageIndex = pageIndex + 1;
      requestEatByType(pageIndex, 10, bindEatType,this);
    } else {
      this.setData({
        loading: false,
      })
    }

  },

  //根据点击的 饮食类型查询
  queryEatType: function (e) {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    var xx = this.data.typeList;
    xx.forEach(ele => {
      if(ele.id == e.currentTarget.id){
        ele.isChoose = true;
      }
      else{
        ele.isChoose = false
      }
    })
    this.setData({
      typeList:xx
    })
    
    var eatTypeId = e.currentTarget.id;
    bindEatType = eatTypeId;
    pageIndex = 0;
    totalPage = 0;
    arr = [];

    
    //这里设置滚动条到初始值 
    
    //查询数据
    requestEatByType(pageIndex, 10, bindEatType, this);
  },
  /**
   * 页面的初始数据
   */
  data: {

   eatTypeId:1,
    typeList: [
      {
        id: 1,
        name: '谷薯芋,杂豆,主食',
        isChoose: true
      },
      {
        id: 2,
        name: '蛋类,肉类,及制品',
        isChoose: false
      },
      {
        id: 3,
        name: '奶类,及制品',
        isChoose: false
      },
   ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });

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

    var eatTypeId = this.data.eatTypeId;
    requestEatByType(0,10,1,this);


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