// miniprogram/pages/myCenter/changePhone/changePhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noPhone: true,
    pageStatus: true, // 页面进行的状态 true 刚进入  false 输入手机号 
    phone: null,
    code: null,
    send_code: false, // 是否已经发送验证码
  },


  inputPhone: function(e) {
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value,
    })
  },

  inputCode: function(e) {
    console.log(e.detail.value)
    this.setData({
      code: e.detail.value,
    })
  },

  // 点击修改手机号 显示输入输入框
  changePhone: function() {
    this.setData({
      pageStatus: false,
    })
  },

  // 获取验证码
  getCode: function() {
    const reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
    var re = new RegExp(reg);

    console.log(re.test(this.data.phone))
    if (this.isNull(this.data.phone) ||
      !re.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.setData({
        send_code: true,
      })
      wx.showToast({
        title: '验证码已发送',
        icon: 'none',
        duration: 1000
      })
    }
  },


  // 完成 
  changeOk: function() {
    if (this.isNull(this.data.phone) ||
      this.isNull(this.data.code)) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 1000
      })
    } else {

      wx.showToast({
        title: '修改成功',
        icon: 'none',
        duration: 1000
      })

    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  // 判空
  isNull: function(str) {
    if (null == str) return true;
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
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