// miniprogram/pages/venue/venue.js

var pageIndex = 0;
var totalPage = 0;
var arr = [];
var venue = {};

var app = getApp();
const { $Toast } = require('../../../dist/base/index');

function chooseSort(requestParams) {

  if (venue.sortType === 'distance') {
    requestParams.gym_distance = venue.sortId

  } else if (venue.sortType === 'humanqi') {
    requestParams.human_qi = venue.sortId

  } else if (venue.sortType === 'price') {
    requestParams.per_capita = venue.sortId
  }

}

function requestList(pageIndex, that, requestParams) {
  requestParams.pn = pageIndex;
  requestParams.ps = 20; 
  requestParams.gym_type_ids = that.options.id; 
  wx.request({
    url: app.globalData.special_url + '/wechat/gym/list',
    data: requestParams,
    header: {
      "content-type": "application/json;charset=UTF-8"
    },
    method: 'POST',
    success: function (res) {
      var venuelist = res.data.data.list;
      for (var i = 0; i < venuelist.length; i++) {
        arr.push(venuelist[i]);
      }
      venue.that.setData({
        totalPage: res.data.data.pageCounts,
        venueList: arr,
        loading: false
      })
      $Toast.hide();
    }
  })

}

Page({

  data: {
    ali:app.globalData.ali,
    platform: getApp().globalData.platform,
    filter: [
      {
        name: '距离最近',
        method: 'venuebysort',
        isChoose: false,
      },
      {
        name: '人气最高',
        method: 'venuebyhumanqi',
        isChoose: false,
      },
      {
        name: '人均价格',
        method: 'openSub',
        isChoose: false,
        isOpen: false,
        sub: [
          {
            type: 1,
            name: '价格最低',
            method: 'priceSort',
          },
          {
            type: 2,
            name: '价格最高',
            method: 'priceSort',
          },
        ]
      },
    ]
  },

  onLoad: function (options) {

    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });

    this.setData({
      options: options
    }, () => {
      requestList(0, this, {});
    })

    venue.that = this;

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

  },

  // 展开
  openSub: function () {
    var filter = this.data.filter;
    filter.forEach((ele, index) => {
      if (index == 2) {
        ele.isOpen = !ele.isOpen
      }
    })
    this.setData({
      filter: filter
    })
  },
  // 价格
  priceSort: function (e) {
    console.log(e.currentTarget.dataset.subitem)
    const subitem = e.currentTarget.dataset.subitem
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    var filter = this.data.filter;
    filter.forEach((ele, index) => {
      if (index == 2) {
        ele.isOpen = false
        ele.isChoose = true
        ele.name = subitem.name
      } else ele.isChoose = false;
    })
    this.setData({
      filter: filter
    }, () => {
      console.log(this.data.filter)
    })

    pageIndex = 0;
    // var sortId = e.currentTarget.id;
    // venue.sortType = 'price';
    // venue.sortId = sortId
    var requestParams = {
      "per_capita": subitem.type,
    }
    arr = [];
    requestList(pageIndex, this, requestParams);

  },
  // 距离
  venuebysort: function (e) {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    var filter = this.data.filter;
    filter.forEach((ele, index) => {
      if (index == 0) {
        ele.isChoose = true
      } else ele.isChoose = false;
      if (index == 2) {
        filter[2].name = '人均价格'
      }
    })
    this.setData({
      filter: filter
    })

    pageIndex = 0;
    //排序类型
    var sortId = e.currentTarget.id;

    venue.sortType = 'distance';
    venue.sortId = sortId
    //
    var requestParams = {
      //"human_qi": 2, // 1:人气升序 2:人气降序
      "gym_distance": 1,
      "latitude": 31.587938,
      "longitude": 120.306358,
    }
    arr = [];
    requestList(pageIndex, this, requestParams);
  },
  // 人气
  venuebyhumanqi: function (e) {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    var filter = this.data.filter;
    filter.forEach((ele, index) => {
      if (index == 1) {
        ele.isChoose = true
      } else ele.isChoose = false;
      if (index == 2) {
        filter[2].name = '人均价格'
      }
    })
    this.setData({
      filter: filter
    })

    var sortId = e.currentTarget.id;
    console.log(sortId);
    venue.sortType = 'humanqi';
    venue.sortId = sortId
    pageIndex = 0;
    //
    var requestParams = {
      //"human_qi": 2, // 1:人气升序 2:人气降序
      "human_qi": 2,
    }
    arr = [];
    requestList(pageIndex, this, requestParams);
  },

  // 滚动到底端
  more: function () {

    if (pageIndex === 0) {
      pageIndex = 1;
    }

    if (this.data.totalPage > pageIndex - 1) {
      this.setData({ loading: true })
      pageIndex = pageIndex + 1;
      var requestParams = {}
      //判断是按照什么排序，距离，人气还是价格等。
      console.log(requestParams);
      requestList(pageIndex, this, requestParams);
    } else {

      wx.showToast({
        title: '没有数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 详情
  venueDetail: function (e) {
    var data = e.currentTarget.dataset.item
    wx.setStorageSync('venueItem', data)
    wx.navigateTo({
      url: '/pages/venue/venueDetail/venuedetail',
    })
  },

  onReachBottom: function () {
    this.more()
  },

  onHide: function () {
    arr = []
  },
  
  onUnload: function () {
    arr = []
  },
})