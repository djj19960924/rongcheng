// pages/tice/code/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeImgUrl: null, //二维码图片地址
    tcData: null, //websocket推送的体测结果
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null,
    hasRegister: null,

    testResult: {
      name: "--",
      score: "--"
    },
    isAgian: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '连接设备中',
    })
    wx.login({
      success: function(res) {
        var code = res.code;
        //授权获取用户信息
        wx.getUserInfo({
          lang: 'zh_CN',
          success: function(res) {
            console.log(res)
            // 访问后台接口获取openid跟userInfo
            var iv = res.iv;
            var encryptedData = res.encryptedData;

            wx.request({
              url: app.globalData.tc_url + "/v2_xcx/login",
              method: 'POST',
              data: {
                code: code,
                iv: iv,
                encryptedData: encryptedData,
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function(res) {
                console.log(res)
                app.globalData.newUserId = res.data.data.id;

                that.setData({
                  hasRegister: true,
                })
                that.getcode()
              },
              fail: function(res) {
                console.log('获取失败:', res);
              }
            });
          },
          fail: function(res) {
            console.log("getUserInfo不同意授权！");
            that.openSetting();
          }
        })
      },
      fail: function(res) {
        console.log("登录失败！");
      },
    })
    
  },

  //获取二维码并连接socket
  getcode: function () {
    var that = this;
    that.setData({
      isAgian: false
    })
    //获取二维码
    wx.showLoading({
      title: '二维码生成中',
    })
    wx.request({
      url: app.globalData.tc_url + '/v2_xcx/zxing',
      data: {
        openid: app.globalData.userInfo.weChatOpenid
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.result == true) {
          console.log('=== zxing ')
          console.log(res)
          that.setData({
            codeImgUrl: app.globalData.tc_url + "/v2_xcx/rest/" + res.data.data.split('/')[3]
          })

          console.log(that.data.codeImgUrl)

          //连接socket
          wx.connectSocket({
            url: app.globalData.websocket_url + app.globalData.newUserId,
          })
          //连接成功
          wx.onSocketOpen(function () {
            console.log('websocket连接成功！');
          })
          //连接失败
          wx.onSocketError(function () {
            console.log('websocket连接失败！');
          })
          //监听socket推送
          wx.onSocketMessage(function (data) {
            console.log("收到推送信息", data)
            if (data.data.substring(0, 4) != "连接成功") {
              console.log('11111111')
              var d = JSON.parse(data.data)
              if (d.score) {
                that.setData({
                  testResult: {
                    name: d.projectName,
                    score: d.score
                  }
                })
                console.log('222222222')
                var danwei = ''
                if (d.projectName == "肺活量") danwei = "ml"
                if (d.projectName == "握力") danwei = "kg"
                if (d.projectName == "纵跳高度" || d.projectName == "坐位体前屈") danwei = "cm"
                if (d.projectName == "单脚站立") danwei = "秒"
                if (d.projectName == "反应时间") danwei = "秒"
                if (d.projectName == "台阶测试") danwei = ""
                if (d.projectName == "仰卧起坐" || d.projectName == "俯卧撑") danwei = "个"
                if (d.projectName == "身高体重") danwei = "（cm/kg）"
                if (d.tz) {

                  console.log('333333333333')
                  var content = '测试项目: ' + d.projectName + '\r\n' + '成绩: ' + d.score + (d.tz && ('/' + d.tz)) + danwei
                } else {
                  console.log('44444444444')
                  console.log(danwei)
                  var content = '测试项目: ' + d.projectName + '\r\n' + '成绩: ' + d.score + danwei
                }
                console.log('55555555555')
                wx.showModal({
                  title: '测试成绩',
                  content: content,
                  showCancel: false,
                  success: function () {
                    that.setData({
                      isAgian: true
                    })
                    wx.closeSocket()
                  }
                })
              }
            }
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})