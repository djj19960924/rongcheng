// miniprogram/pages/special/question/question.js
const { $Toast } = require('../../../dist/base/index');
var app = getApp();
var SocketTask;
// var sends = [];
var recevie = [];
var question = {};
// var pageIndex = 0;
// var totalPage = 0;
var loading = false;

function queryHistoryMessage(pageIndex,size){
  wx.request({
    url: app.globalData.special_url + '/message/queryHistoryMessage',
    data:{
      //专家id , 不使用user_id user_id 过长
      specialId :question.specialId,
      open_id :app.globalData.userInfo.weChatOpenid,
      page :pageIndex,
      size:size
    },
    success:function(res){
      question.that.data.totalPage = res.data.data.totalPage;
      var arr = question.that.data.sends;
      var messages = res.data.data.messages;
      if(messages < 12){
        question.that.setData({
          hideloading: true
        })
      }

      // 插入新加载数据
      for (var i = 0; i < messages.length; i++) {
        arr.unshift(messages[i]);
      }
      question.that.setData({
        specialHeadimg: question.specialHeadimg,
        msglist: arr,
      })

      // 计算第 pageIndex 时聊天框的总高度
      let query = wx.createSelectorQuery()
      let chatsHeight = question.that.data.chatsHeight
      query.selectAll(`.chatItem`).boundingClientRect(rect => {
        let heightAll = 0;
        rect.map((currentValue, index, arr) => {
          heightAll = heightAll + currentValue.height + 16
        })
        chatsHeight[Number(pageIndex)] = heightAll
        question.that.setData({
          chatsHeight: chatsHeight,
        })
        console.log(chatsHeight)

        // 计算聊天框滚动的位置 scrolltop
        if (pageIndex == 0) {
          question.that.setData({
            scrolltop: chatsHeight[0],
          })
          loading = false;
        } else {
          question.that.setData({
            scrolltop: chatsHeight[pageIndex] - chatsHeight[pageIndex - 1],
            // scrolltop:50,
          })
          loading = false;
        }
        $Toast.hide();

      }).exec();
    }
  })
}

// 获取缓存列表
// function getHideList(pageIndex){
//   wx.request({
//     url: app.globalData.special_url + '/message/queryHistoryMessage',
//     data: {
//       //专家id , 不使用user_id user_id 过长
//       specialId: question.specialId,
//       open_id: app.globalData.userInfo.open_id,
//       page: pageIndex,
//       size: '12'
//     },
//     success: function (res) {
//       var arr = [];
//       var messages = res.data.data.messages;
//       for (var i = 0; i < messages.length; i++) {
//         arr.unshift(messages[i]);
//       }

//       question.that.setData({
//         hideList: arr,
//       })
//     }
//   })
// }



function sendMessage(msg){
  console.log(msg);
  var realmsg = question.specialId + ":" + msg;
  SocketTask.send({
    data: realmsg,
    success: function (res) {
      if (res.errMsg == 'sendSocketMessage:ok') {
        var msgobj = {
          //这里要带上 具体发给哪个专家的消息
          msg: msg,
          sender: 1
        }
        question.that.data.sends.push(msgobj);
        question.that.setData({
          msglist: question.that.data.sends
        })
        // 计算发送信息后聊天框的高度
        let query = wx.createSelectorQuery()
        wx.getSystemInfo({
          success: res => {
            query.selectAll(`.chatItem`).boundingClientRect(rect => {
              let heightAll = 0;
              rect.map((currentValue, index, arr) => {
                heightAll = heightAll + currentValue.height + 16
              })
              
              // 滚动到底部
              question.that.setData({
                scrolltop:heightAll
              })

            }).exec();
          }
        })

      }
    }
  })
}

Page({

  requestHistoryMessage:function(e){
    var that = this;
    if(loading){// 如果正在loading ， 不操作
      return;
    }

    if (e.detail.scrollTop < 50) {
      console.log('到顶了')
      // wx.showToast({
      //   title: '到顶了' + that.data.pageIndex,
      //   icon: 'none',
      //   duration: 2000
      // })
      loading = true

      if (that.data.pageIndex < that.data.totalPage) {
        console.log(that.data.pageIndex);
        that.setData({
          pageIndex: that.data.pageIndex + 1
        }, () => {
          queryHistoryMessage(that.data.pageIndex,12);
        })
      } else {
        console.log('没有更多数据了')
      }
    }

  },

  send: function (e) {
   
    sendMessage(this.data.sendContent);
    this.setData({
      sendValue:''
    })
  },

  getKeyHeight: function (e){
    this.setData({
      keyHeight:e.detail.height
    })
    // 滚到底部
    let query = wx.createSelectorQuery()
    query.selectAll(`.chatItem`).boundingClientRect(rect => {
      let heightAll = 0;
      rect.map((currentValue, index, arr) => {
        heightAll = heightAll + currentValue.height + 16
      })
      question.that.setData({
        scrolltop: heightAll,
      })

    }).exec();
  },
  resetKeyHeight:function(e){
    this.setData({
      keyHeight:0
    })
  },
  getSendContent:function(e){
    this.setData({
      sendContent:e.detail.value
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    sends:[],
    pageIndex:0,
    totalPage:0,
    chatsHeight:[],
    keyHeight:0,
    platform: app.globalData.platform
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });

    // 获取滚动区域高度
    let query = wx.createSelectorQuery()
    wx.getSystemInfo({
      success: res => {
        query.selectAll('.box_top').boundingClientRect(rect => {
          let heightAll = 0;
          console.log(rect)
          rect.map((currentValue, index, arr) => {
            heightAll = heightAll + currentValue.height
          })
          this.setData({
            scrollheight: res.windowHeight - heightAll,
          })
        }).exec();
      }
    })
    
   
    question.that = this;
    //查询 历史聊天记录 wx.request  ..
    question.specialId = options.id;
    question.specialHeadimg = options.headimg;
    queryHistoryMessage(this.data.pageIndex,12);

   
    //获取该用户的open_id
    //var open_id = 'ogCXM4jvfgStfiV9ptZ56rffGd-g';
    var open_id = app.globalData.userInfo.weChatOpenid;
    //连接socket 
     SocketTask = wx.connectSocket({

      //url: app.globalData.webSocket +"wxUser/" + open_id + '/'+ question.specialId+'/1',
      url: app.globalData.webSocket + "wxUser/" + open_id + '/1',

      header: {
        'content-type': 'application/json',
        'Sec-WebSocket-Protocol':'chat'
      },
      method: "GET",
    })
  
    SocketTask.onMessage(function (res) {

      var msg = res.data;
      var msgobj = {
        msg: msg,
        sender: 2
      }
      question.that.data.sends.push(msgobj);
      question.that.setData({
        msglist: question.that.data.sends
      })

      // 计算发送信息后聊天框的高度
      let query = wx.createSelectorQuery()
      wx.getSystemInfo({
        success: res => {
          query.selectAll(`.chatItem`).boundingClientRect(rect => {
            let heightAll = 0;
            rect.map((currentValue, index, arr) => {
              heightAll = heightAll + currentValue.height + 16
            })

            // 滚动到底部
            question.that.setData({
              scrolltop: heightAll
            })

          }).exec();
        }
      })
    })
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    SocketTask.close(function (res) {
      console.log(res);

    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})