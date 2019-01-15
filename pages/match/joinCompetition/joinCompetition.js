const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    phone: null,
    cardId: null,
    workSpace: null,
    competitionId: null,
    sexArr: [{
      name: '男',
      color: '#088EE5'
    },
    {
      name: '女',
      color: '#E31212',
    },
    ],
    sexValue:0
  },

  onLoad: function (options) {
    console.log(options)

    this.setData({
      competitionId: options.competitionId,
    })
  },


  inputName: function(e) {
    this.setData({
      name: e.detail.detail.value
    })
  },

  inputPhone: function(e) {
    this.setData({
      phone: e.detail.detail.value
    })
  },

  inputCardId: function(e) {
    this.setData({
      cardId: e.detail.detail.value
    })
  },

  inputWorkSpace: function(e) {
    this.setData({
      workSpace: e.detail.detail.value,
    })
  },
  // sex
  chooseSex: function () {
    this.setData({
      visible: true
    })
  },
  handleOk: function (e) {
    this.setData({
      visible: false,
      sexValue: e.detail.index
    })
  },


  // 报名提交
  requestJoin: function() {
    let that = this;

    if (null == this.data.phone || null == this.data.name) {
      wx.showToast({
        title: '请完善数据',
        icon: 'none',
        duration: 2000
      })
    } 
    else {
      console.log('--- join competition')
      let that = this;

      if (null == app.globalData.userInfo) {
        wx.showToast({
          title: '您还未登陆',
          icon: 'none',
          duration: 2000
        })
      } else {
        this.setData({ loading: true })
        wx.request({
          url: app.globalData.club_url + '/match/competition/join_competition',
          data: {
            'openId': app.globalData.userInfo.weChatOpenid,
            'competitionId': that.data.competitionId,
            'name': that.data.name,
            'sex': that.data.sexValue,
            'phone': that.data.phone,
            'cardId': that.data.cardId,
            'workPosition': that.data.workSpace,
          },
          header: {
            'Accept': 'application/json'
          },
          method: 'post',
          success(res) {
            console.log(res.data);
            if (res.statusCode == 200) {
              wx.showToast({
                title: '报名成功',
                icon: 'success',
              })
            } else if (res.statusCode == 305) {
              wx.showToast({
                title: '请勿重复报名',
                icon: 'success',
              })
            } else {
              wx.showToast({
                title: '报名失败',
                icon: 'success',
              })
            }
          
            that.setData({ loading: false })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            },1000)
          },
          fail: function() {
            wx.showToast({
              title: '报名失败',
              icon: 'none',
            })
            that.setData({ loading: false })
          }
        });
      }
    }

  },
})