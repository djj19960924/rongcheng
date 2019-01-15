
// miniprogram/pages/special/special.js
var app = getApp();
const { $Toast } = require('../../dist/base/index');

var pageIndex = 0;
var totalPage = 0;
var arr = [];
function requestList(pageIndex, that) {
  wx.request({
    url: app.globalData.special_url + '/special/queryAllSpecialList',
    data:{
      page: pageIndex,
      size:'4'
    },

    success:function(res){
      var specialList = res.data.data.specialList;
      
     
      for(var i = 0 ; i < specialList.length; i++ ){
        arr.push(specialList[i]);
      }
 
    
      setTimeout(function () {
        that.setData({
          specialList: arr,
          totalPage: res.data.data.totalPage,
          loading: false,
        })
        $Toast.hide();
      },800)
    }
  })
}

Page({

  myspecial: function () {
    wx.navigateTo({
      url: '/pages/special/myspecial/mySpecial',

    })
  },

  specialDetail: function (e) {
    var user_id = e.currentTarget.id;

    wx.navigateTo({
      url: '/pages/special/specialdetail/specialDetail?user_id=' + user_id,

    })
  },

  requestSpecial:function(e){
   
    if (this.data.totalPage > pageIndex + 1 ) {
      this.setData({
        loading: true,
      })
      pageIndex = pageIndex + 1;
      requestList(pageIndex,this);
    }
    
  },

  specialGuide: function (e) {
    wx.navigateTo({

      url: '/pages/special/question/question?id=' + e.currentTarget.id + '&headimg=' + e.currentTarget.dataset.headimg,

    })
  },
  
  data: {
    platform: app.globalData.platform,
    ali:app.globalData.ali
  }, 
  
  onLoad: function (options) {

    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });

    requestList(pageIndex,this);

    // 获取滚动区域高度
    setTimeout(() => {
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
    },800)
  },

  onHide: function () {
    
  },
  onUnload: function () {
    arr = [];
    pageIndex = 0;
    totalPage = 0;
  },

  onShareAppMessage: function () {

  }
})