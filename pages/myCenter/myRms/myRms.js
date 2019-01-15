// miniprogram/pages/myCenter/myTc/myTc.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mOrderList: [],//我的订单列表
    pageNo:0,
    isbottom:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 计算滚动区域高度
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
    getRepairListByUserId.call(this);
  },

  toDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'rmsDetail/index?id=' + id,
    })

  },
  //上拉加载
  getOrderLower(){
    var that = this;
    if(!that.data.isbottom){
      var pageNo = this.data.pageNo + 1
      this.setData({
        pageNo:pageNo
      })
      //根据openid获取保修列表
      getRepairListByUserId.call(this)
    }
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

//根据openid获取报修列表
function getRepairListByUserId(id, pageNo) {
  var that = this;
  wx.showLoading({
    title: '加载中...',
  })
  //获取用户信息
  wx.request({
    url: getApp().globalData.url + 'wx/user/getByOpenid',
    data: {
      openid: app.globalData.userInfo.weChatOpenid
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res)
      // var userId = res.data.data.id; //获取用户id
      // console.log('登陆成功，获取用户信息成功，打印globalData.userInfo', app.globalData.userInfo)
      wx.request({
        url: app.globalData.url + "wx/repairList",
        data: {
          userId: res.data.data.id,
          pageNo: that.data.pageNo,
          pageSize: 10
        },
        success: function (res) {
          var resdata = res.data.data;
          wx.hideLoading();
          if ((resdata.content.length > 0) || that.data.pageNo == 0) {
            var mEquipmentRepairList = resdata.content;
            var mOrderList = [];
            if (parseInt(that.data.pageNo) == 0) {
              mOrderList = mEquipmentRepairList;
            } else if (parseInt(that.data.pageNo) >= 1) {
              console.log();
              mOrderList = that.data.mOrderList.concat(mEquipmentRepairList);
            }
            that.setData({
              mOrderList: mOrderList
            })
          }
          else if (resdata.content == null || resdata.content.length == 0) {
            if (parseInt(that.data.pageNo) > 1) {
              var pageNo = that.data.pageNo - 1;
              that.setData({
                pageNo: pageNo,
                isbottom: true
              })
              setTimeout(function () {
                wx.showToast({
                  title: '全部加载完成',
                  icon: 'none',
                  duration: 1000
                })
              }, 200)
            }
          }
        },
        fail: function () {
          wx.hideLoading();
          if (parseInt(that.data.pageNo) > 1) {
            var pageNo = that.data.pageNo - 1;
            that.setData({
              pageNo: pageNo
            })
          }
        }
      })
    }
  })
  
}

