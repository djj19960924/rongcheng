// miniprogram/pages/venue/venue.js

var pageIndex = 0;
var totalPage = 0;
var arr=[];
var typeId = 0;

var venue = {};

var app = getApp();
const { $Toast } = require('../../dist/base/index');

function chooseSort(requestParams){

  if (venue.sortType === 'distance') {
      requestParams.gym_distance = venue.sortId
    
  } else if (venue.sortType === 'humanqi') {
    requestParams.human_qi = venue.sortId
     
  } else if (venue.sortType === 'price') {
    requestParams.per_capita = venue.sortId
  }

}

function requestList(pageIndex, that, requestParams){
   that.typeId = typeId;
   requestParams.pn = pageIndex;
   requestParams.ps = 20;
   console.log(requestParams);
    wx.request({

      url: app.globalData.special_url + '/wechat/gym/list',
      data: requestParams,
      header:{
        "content-type": "application/json;charset=UTF-8"
      },
      method:'POST',
      success:function(res){
    
       
       var venuelist =  res.data.data.list;
       console.log(venuelist);
       for(var i = 0; i < venuelist.length; i++){
          arr.push(venuelist[i]);
       }

        venue.that.setData({
          totalPage:res.data.data.pageCounts,
          venueList:arr,
          loading: false
        })
        $Toast.hide();
       
        console.log(arr);
        // var venueList = res.data.data.venueList;
        // for(var i = 0; i < venueList.length; i++){
        //   arr.push(venueList[i]);
        // }
        // that.setData({
        //   totalPage:red.data.data.totalPage,
        //   venueList:arr

        // }) 
        
      }
    })

}


Page({
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
    },() => {
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
      if(index == 2){
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
      "gym_distance":1,
      "latitude": this.data.latitude,
      "longitude": this.data.longitude,
    }
    console.log(requestParams)
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
      filter:filter
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


  venueDetail:function(e){

      console.log(e);

      var data = e.currentTarget.dataset.item
      // var address = data.address;
      // var businessdate = data.businessdate ;
      // var businesstime = data.businesstime;
      // var gymname = data.gymname;
      // var installationsname  = data.installationsname;
      
      // var gymimage = data.gymimage;

      wx.setStorageSync('venueItem', data)



      wx.navigateTo({
        url: '/pages/venue/venueDetail/venuedetail',
      })

  },



  //滚动到底端
  more:function(){

    if (pageIndex === 0) {
      pageIndex = 1;
    }

    if (this.data.totalPage > pageIndex - 1) {
      this.setData({ loading: true })
      pageIndex = pageIndex + 1;
      var requestParams = {}
      //判断是按照什么排序，距离，人气还是价格等。
      chooseSort(requestParams);
      console.log(venue.typeId);
      if(venue.typeId != undefined){
        requestParams.gym_type_ids = venue.typeId 
      }
      console.log(requestParams);
      requestList(pageIndex, this, requestParams);
    }else{
     
      wx.showToast({
        title: '没有数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //点击 场馆类型按钮
  venuebytype: function (e) {
    console.log(e.currentTarget.dataset.name)
    wx.navigateTo({
      url: `allVenue/index?id=${e.currentTarget.id}&name=${e.currentTarget.dataset.name}`,
    })
  },


  /**
   * 页面的初始数据
   */
  data: {
    platform: getApp().globalData.platform,
    imgUrls: [
      'https://paoba.oss-cn-beijing.aliyuncs.com/WechatIMG242.jpeg',
      'https://paoba.oss-cn-beijing.aliyuncs.com/WechatIMG243.jpeg',
    ],
    ali:app.globalData.ali,
    typeList:[
      [
        {
          icon: 'images/b1.png',
          text: '游泳',
          id: 1,
        },
        {
          icon: 'images/b2.png',
          text: '篮球',
          id: 2,
        },
        {
          icon: 'images/b3.png',
          text: '乒乓球',
          id: 3,
        },
        {
          icon: 'images/b4.png',
          text: '健身',
          id: 4,
        },
        {
          icon: 'images/b5.png',
          text: '羽毛球',
          id: 5,
        },
      ],
      [
        {
          icon: 'images/b6.png',
          text: '足球',
          id: 6,
        },
        {
          icon: 'images/b7.png',
          text: '瑜伽',
          id: 7,
        },
        {
          icon: 'images/b8.png',
          text: '网球',
          id: 8,
        },
        {
          icon: 'images/b9.png',
          text: '卡丁车',
          id: 9,
        },
        {
          icon: 'images/b10.png',
          text: '其他',
          id: 10,
        },
      ],
    ],
    filter: [
      {
        name: '距离最近',
        method: 'venuebysort',
        isChoose:false,
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
        isOpen:false,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })

    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });

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

    var requestParams = {
     
    }
    requestList(0,this,requestParams);

  },

  //页面滚动执行方式
  onPageScroll(event) {
    if (event.scrollTop >= 242){
      this.setData({
        fixed:true
      })
    }
    else {
      this.setData({
        fixed: false
      })
    }
  },

  onShareAppMessage: function () {

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