//app.js
App({
  onLaunch: function () {
    var that = this;
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      app_id: 'wx9ae355ccd14b4d80',
      //base_url: 'http://192.168.2.38:8099',
      base_url: 'https://sso.whtiyu.cn',
      // club_url: 'http://192.168.2.198:8089',
      club_url: 'https://sso.whtiyu.cn',
      tc_url: 'https://www.whtiyu.cn/tc',
      // tc_url: 'http://192.168.2.45:11010/tc',
      // websocket_url: 'ws://192.168010/tc/websocket/',
      websocket_url: 'wss://www.whtiyu.cn/tc/websocket/',
      special_url: 'https://static.whtiyu.cn',
      //  special_url:'http://192.168.2.165:8078',
      webSocket:'ws://192.168.2.165:8078/websocket/',
      ali:'https://paoba.oss-cn-beijing.aliyuncs.com/paoba/',
      userInfo: {
      },
      openId: 'ogCXM4g14h079omAvzzhVo203rMg',
      map_key: '850cbda2ea15e9990baecfab7cf19d21',

      organize_id: 63,//机构  id
      citySign: 2,//使用范围标识 0 省 1 市 2区 县
      url: 'http://192.168.2.48:11190/rms/',
    }

    // get sys
    wx.getSystemInfo({
      success: function (res) {
        // devtools ios android
        that.globalData.platform = res.platform
      }
    })
  }
})
