// pages/news/newsList/index.js

var app = getApp();
//sunlian的 pageIndex需要从1 开始
var pageIndex = 1;
var totalPage = 0;
var size = 0;
var arr = [];
var news = {};
function requestList(pageIndex , size){


    wx.request({
      url: app.globalData.special_url + '/wechat/news/list',
      data:{
        pn:pageIndex,
        ps:size
      },
      method:'POST',
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      success:function(res){
        
         totalPage = res.data.data.pageCounts;
         var list = res.data.data.list
        

        for(var i = 0; i < list.length; i++){
          arr.push(list[i]);
        }
     
       
        news.that.setData({
          arr : arr,
          
        })
        wx.hideLoading();

      }



    })

}


Page({

  more:function(){
    
    pageIndex = pageIndex + 1;
    if (totalPage >= pageIndex){
          requestList(pageIndex ,size );
      }else{
      wx.showToast({
        icon: 'none',
        title: '没有更多数据了',
      })
       
      }

  },
  /**
   * 页面的初始数据
   */
  data: {
    aliImageAddr:app.globalData.ali
  },
  
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    news.that= this;
    size = 10;
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

    requestList(0,size);

  },

  goDetail:function(e){
    wx.navigateTo({
      url: '../newsDetail/index?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  
  onShareAppMessage: function () {
  
  },
  onHide: function () {
    pageIndex = 1;
    totalPage = 0;
    size = 0;
    arr = [];
    news = {};
  },
  onUnload : function () {
    pageIndex = 1;
    totalPage = 0;
    size = 0;
    arr = [];
    news = {};
  }
})