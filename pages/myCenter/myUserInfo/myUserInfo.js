// miniprogram/pages/myCenter/myUserInfo/myUserInfo.js
const app = getApp();
const {
  $Message
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    platform: getApp().globalData.platform,
    userInfo: {},
    sex_array: ['男', '女'],
    sex_index: 0,
    date: '2018-09-01',
    height_array: [],
    height_index: 0,

    sexArr: [{
        name: '男',
        color: '#088EE5'
      },
      {
        name: '女',
        color: '#E31212',
        // icon: 'search'
      },
    ],

    changeUpdate: {},
  },


  // 性别改变
  bindPickerChange(e) {
    
    this.setData({
      sex_index: e.detail.value
    })
  },

  // 出生年月改变
  bindDateChange(e) {
    
    this.setData({
      date: e.detail.value
    })
  },


  // 身高修改
  bindMultiPickerChange(e) {
    
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange(e) {
    
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }

    console.log(data.multiIndex)
    this.setData(data)
  },


  // 更新调用
  updateUserInfo: function() {

    let date_time = new Date(this.data.date);
    console.log('--- time ')
    console.log(date_time.getTime());

    this.data.changeUpdate['weChatOpenid'] = app.globalData.userInfo.weChatOpenid;

   
    let that = this;
   
    wx.request({
      url: app.globalData.base_url + '/user/wx_user/update',
      method: 'POST',
      data: that.data.changeUpdate,
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res)
        const userData = res.data.data.data;
        const updateDate = new Date(userData.birthday);
        that.setData({
          userInfo: userData,
          sex_index: userData.sex,
          date: updateDate.getFullYear() + '-' + (updateDate.getMonth() + 1) + "-" + updateDate.getDate(),
        })
      
      },
      fail: function(res) {
        console.log(res);
      }
    });

  },


  // 保存按钮
  saveUserInfo: function() {

    this.updateUserInfo();
  },


  onLoad: function(options) {
    let that = this;
    wx.request({
      url: app.globalData.base_url + '/user/wx_user/infoById?open_id=' +
        app.globalData.userInfo.weChatOpenid,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
      
        const userLoad = res.data.data.data;
        const birthDate = new Date(userLoad.birthday);

        that.setData({
          userInfo: userLoad,
          sex_index: userLoad.sex,
          date: birthDate.getFullYear() + '-' + (birthDate.getMonth() + 1) +
            "-" + birthDate.getDate(),
        })
       
        let birth = new Date(that.data.userInfo.birthday)
       
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  // 
  willChange: function(e) {
    let obj = {};
    let key = 'visible' + e.currentTarget.dataset.num;
    obj[key] = true;
    obj['key'] = e.currentTarget.dataset.num;
    obj['isFocus' + e.currentTarget.dataset.num] = true;
    this.setData(obj)
  },
  // 点击取消关闭对话框
  handleClose: function() {
    let obj = {};
    let key = this.data.key;
    obj['visible' + key] = false;
    this.setData(obj)
  },
  // 输入监听
  watchValue: function(e) {
    this.setData({
      currentValue: e.detail.value
    })
  },
  // 点击确定
  handleOk: function(e) {
    this.handleClose() // close
    // 修改性别
    if (e.detail) {
      let sex;
      e.detail.index == 0 && console.log('男')
      e.detail.index == 1 && console.log('女')
      e.detail.index == 0 ? sex = 1 : sex = 0;
      let data = {
        'sex': sex
      }
      this.setData({
        changeUpdate: data,
      })
      this.updateUserInfo();
      return;
    }

    // 修改其他
    let key = this.data.key;
    let value = this.data.currentValue;
    if (!value) {
      $Message({
        content: '您还没有输入任何值',
        type: 'error'
      });
      return;
    }
    if (key == 1) {
      console.log('修改用户名------值为', value)
      let data = {
        'nickName': value
      }
      this.setData({
        changeUpdate: data
      })
    }
    if (key == 3) {
      console.log('修改身份证------值为', value)
      let data = {
        'identityId': value
      };
      this.setData({
        changeUpdate: data
      })
    }
    if (key == 4) {
      console.log('修改身高------值为', value)
      let data = {
        'height': value
      }
      this.setData({
        changeUpdate: data
      })
    }
    if (key == 5) {
      console.log('修改体重------值为', value)
      let data = {
        'weight': value
      }
      this.setData({
        changeUpdate: data
      })
    }
    if (key == 6) {
      console.log('修改手机号------值为', value)
      let data = {
        'phone': value
      }
      this.setData({
        changeUpdate: data
      })
    }

    this.updateUserInfo();
  }
})