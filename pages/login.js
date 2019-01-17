const app = getApp();
const {
  $Toast
} = require('../dist/base/index');
function isSetInfo(userInfo){

  
  var birthday = userInfo.birthday;
  var height = userInfo.height;
  var weight = userInfo.weight;
  var phone = userInfo.phone;
  var nickName = userInfo.nickName;
  var sex = userInfo.sex;
  if ((height === null || height === '') || (birthday === null || birthday === '') ||
      (weight === null || weight ==='') || (phone === null || phone === '') ||
      (nickName === null || nickName ==='') || (sex === null || sex === '')) 
    {
        return false;
    }else{
      return true;
    }
}
Page({

  
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loading: true,
    animationData:{},
    animationData1:{},
    animationData2: {}
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // const animation = wx.createAnimation({
    //   duration: 600,
    //   timingFunction: 'linear',
    // })
    // this.animation = animation
    // var count = 0;
    // setInterval(function () {
    //   console.log(1)
    //   animation.rotate(180).step()
    //   this.setData({
    //     animationData: animation.export()
    //   })
    //   if(count%2==0){
    //     animation.scale(2).rotate(180).step()
    //     this.setData({
    //       animationData1: animation.export()
    //     })
    //     animation.scale(0.5).rotate(180).step()
    //     this.setData({
    //       animationData2: animation.export()
    //     })
    //   }else{
    //     animation.scale(2).rotate(180).step()
    //     this.setData({
    //       animationData2: animation.export()
    //     })
    //     animation.scale(0.5).rotate(180).step()
    //     this.setData({
    //       animationData1: animation.export()
    //     })
    //   }
    //   count+=501

    // }.bind(this), 501)
    // return;
    let that = this;

    var start = new Date().getTime()

    if (that.data.canIUse) {

      /**
       * 登陆
       */
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
         
          if (res.errMsg == "login:ok") {
            wx.request({
              url: app.globalData.base_url + '/user/login/login',
              method: 'POST',
              data: {
                'weChatOpenid': app.globalData.app_id, // app id
                'code': res.code,
              },
              header: {
                'Accept': 'application/json'
              },
              success: function(res) {
                

                if (res.data.meta.code == 200) {
                  app.globalData.userInfo.weChatOpenid = res.data.data.data.weChatOpenid

                  var userInfo = res.data.data.data;
                  if (!isSetInfo(userInfo)) { //判断基础数据是否全部设置完毕
                    that.setData({
                      loading: false
                    })
                  }else{

                    // 检查用户是否授权
                    wx.getUserInfo({
                      lang: 'zh_CN',
                      success: function (res) {
                        wx.switchTab({
                          url: 'showIndex/showIndex',
                        })
                      },
                      fail: function (res) {
                        console.log("用户未授权");
                        that.setData({
                          loading: false
                        })
                      }
                    })
                  }
                } else {
                  // 登陆失败
                  console.log('login error ')
                  console.log(res.data)
                  wx.showModal({
                    title: '微信登陆失败，重新登陆！',
                    content: '',
                    success: function(res) {

                    }
                  })
                }
              },
              fail: function() {
                wx.showModal({
                  title: '服务器请求失败，是否重试',
                  content: '',
                  success: function(res) {

                  }
                })
              }
            })
          } else { // 微信登陆失败
            wx.hideLoading()
            wx.showModal({
              title: '微信登陆失败，重新登陆！',
              content: '',
              success: function(res) {

              }
            })
          }
        },
        fail: res => {
          console.log(res)
        },
        complete: res => {
          console.log(res)
        }
      })
    } else {
      wx.hideLoading()
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.showModal({
        title: '请更新微信版本!',
        content: '',
        success: function(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: -1
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: -1
            })
          }
        }
      })
    }
  },

  onShareAppMessage: function() {

  },

  onGotUserInfo(e) {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    console.log(e)
    this.setData({
      wechatUserInfo: e.detail.userInfo
    })
    let that = this;

    wx.request({
      url: app.globalData.base_url + '/user/login/register',
      method: 'POST',
      data: {
        code: e.detail.encryptedData,
        iv: e.detail.iv,
        weChatOpenid: app.globalData.userInfo.weChatOpenid,
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res)
        $Toast.hide();
        if (res.data.meta.success) {
          wx.redirectTo({
            url: 'addInfo/index',
          })
        
        } else {
          wx.showToast({
            title: res.data.meta.msg,
            icon: 'none'
          })
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })

  },

})
