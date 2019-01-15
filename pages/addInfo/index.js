const app = getApp();
const {
  $Message
} = require('../../dist/base/index');
Page({

  formSubmit:function(e){

    wx.showLoading({
      title: '加载中',
    })

    var birthday = e.detail.value.birthDay;
    var height = e.detail.value.height;
    var weight = e.detail.value.weight;
    var sex = e.detail.value.setData;
    var userName = e.detail.value.userName;
    var phone = e.detail.value.phone;
    var idcard = e.detail.value.idcard;
    var openid = app.globalData.userInfo.weChatOpenid;

 

    //验证是否输入了信息
    if((height === undefined || height =='' ) || (weight === undefined ||  weight == '' )
       || (userName === undefined ||userName == '' )|| (phone === undefined || phone == '' ) ){
        wx.showToast({
          title: '请将信息填写完整',
          icon:'none'
        })
        return;
    }



    wx.request({
      url: app.globalData.base_url + '/user/wx_user/update',
      method: 'POST',
      data: {
        phone:phone,
        identityId:idcard,
        sex:sex,
        nickName:userName,
        birthday:birthday,
        height:height,
        weight:weight,
        weChatOpenid: openid

      },
      header: {
        'Accept': 'application/json'
      },
      success:function(res){
    
        wx.hideLoading();
        wx.switchTab({
          url: '/pages/showIndex/showIndex',
        })
       

      }
    })



  },
  
  data:{
    sexarray:['男','女'],
    sexindex:0,
    birth:'2000-01-01'
  },

  onLoad: function (options) {
    
  },

  // change sex
  bindPickerChange(e) {
    this.setData({
      sexindex: e.detail.value
    })
  },
  // change birth
  bindDateChange(e) {
    this.setData({
      birth: e.detail.value
    })
  },
})