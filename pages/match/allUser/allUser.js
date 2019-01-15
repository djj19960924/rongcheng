const app = getApp();
Page({

  data: {
    users: [],
    pageIndex: 0,
    arr: [],
    matchId: '',
  },

  loadMore: function(e) {
    console.log('load more ')
    this.setData({
      loading: true,
    })

    let that = this;
    console.log("pageIndex == ", that.data.pageIndex);


    wx.request({
      url: app.globalData.club_url + '/match/event/get_all_user',
      data: {
        page: that.data.pageIndex,
        size: '10',
        match_id: that.data.matchId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res.data);
        const user_list = res.data.data.data;
        if (Array.isArray(user_list) &&
          user_list.length != 0) {

          user_list.forEach(ele => {
            that.data.arr.push(ele)
          })
          that.setData({
            users: that.data.arr,
            loading: false,
            pageIndex: that.data.pageIndex + 1,
          })
        } else {
          wx.showToast({
            title: '没有更多了',
            icon: 'none'
          })
          that.setData({
            loading: false,
          })
        }

      }
    });

  },

  onLoad: function(options) {

    let that = this;
    let matchId = options.matchId;
    that.setData({
      matchId: matchId,
    })

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

    //  社团所有用户
    wx.request({
      url: app.globalData.club_url + '/match/event/get_all_user?match_id=' +
        matchId + "&page=0&size=10",
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res.data);

        that.setData({
          users: res.data.data.data,
          arr: res.data.data.data,
          pageIndex: that.data.pageIndex + 1,
        })

      }
    });

  },
})