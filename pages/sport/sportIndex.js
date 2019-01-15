var app = getApp();
const {
  $Toast
} = require('../../dist/base/index');

var open_id;
var sportIndex = {

};

//获得 科学建议页面的数据
function saveSportTarget(open_id, date_target) {
  if (typeof(date_target) === "undefined") {
    date_target = '';
  }

  wx.request({
    url: app.globalData.special_url + '/sport/saveSportTarget',
    data: {
      open_id: open_id,
      targetDate: date_target
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: 'post',
    success: function(res) {
      $Toast.hide();
      console.log(res.data.data);
      var disable = false;
      if (res.data.data.isExistTarget === '0') {
        wx.showToast({
          title: '没有当天的运动目标',
          icon: 'none',
          duration: 2000
        })
        return;
      } else if (res.data.data.isExistTarget === '1') {
        // 查看到了 以前的 sportTarget
        //将所有的 能点击的 button设置为 不能点击
        disable = true;
      }


      var sportAdvice = res.data.data.sportAdvice;


      wx.setStorageSync('sportAdviceId', sportAdvice.id);
      // wx.setStorageSync('open_id', 'ogCXM4g14h079omAvzzhVo203rMg');
      wx.setStorageSync('scienceAdvice', res.data.data.scienceAdvice);

      sportIndex.that.setData({
        toDayStepNumber: res.data.data.toDayStepNumber,
        remainStepNumber: res.data.data.remainStepNumber,
        dayAdviceAddCal: sportAdvice.dayAdviceAddCal,
        dayStillNeedAddCal: sportAdvice.dayStillNeedAddCal,
        dayTotalConsumeCal: sportAdvice.dayTotalConsumeCal,
        dayStillNeedConsumeCal: sportAdvice.dayStillNeedConsumeCal,
        sportRecords: sportAdvice.sportRecords,
        sportEatRecords: sportAdvice.sportEatRecords,
        disable: disable
      })

    },

  })
}

//上传微信步数
function uploadStepNumber(stepInfoList) {

  wx.request({
    url: app.globalData.special_url + '/sport/uploadStepNumber',
    data: {
      open_id: open_id,
      stepInfoList: stepInfoList
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function(res) {

      saveSportTarget(open_id);
    }
  })

}



function chooseStepInfoList(stepInfoList) {
  // var nowDate = new Date();
  // var day = nowDate.getDay(); // 0-6,0代表星期天

  // var count = 0;
  // if (day == 0) {
  //   count = 6 + 1;
  // } else {
  //   count = day;
  // }

  // var stepInfoList2 = []
  // for (var i = 0; i < count; i++) {
  //   stepInfoList2.push(stepInfoList[30 - i].step)
  // }
  // return stepInfoList2;

  //


}



//查询 是否存在运动目标
function queryIsExistSportTarget(open_id) {

  wx.request({
    url: app.globalData.special_url + '/sport/queryIsExistSportTarget',
    data: {
      open_id: open_id
    },
    success: function(res) {
      var isExistSportTarget = res.data.data.isExistSportTarget;
      if (isExistSportTarget == '0') {
        //当不存在运动目标的时候 查询 基本的 身高体重年龄 等信息是否已经设置
        queryIsSetBaseInfo(open_id)
      } else {


        //判断是否已经上传了今天的步数,上传了就不需要再传了 减少延迟

        //获取运动微信的运动步数 stepInfoList 从周1-周日的步数，上传到服务器
        //今天周1 就传周1步数 今天周2就传 周1 周2 的步数

        var stepInfoList = null;
        wx.getWeRunData({
          success: function(res) {
            var enc = res.encryptedData;
            var iv = res.iv;
            wx.request({
              url: app.globalData.base_url + '/user/login/step',
              data: {
                encryptedData: enc,
                iv: iv,
                openId: app.globalData.userInfo.weChatOpenid,
              },
              method: 'POST',
              header: {
                "Content-Type": "application/json"
              },
              success: function(res) {
                console.log(res);
                // stepInfoList  = res.data.data.data;
                stepInfoList = JSON.parse(res.data.data.data).stepInfoList;
                // //筛选 当天和前6天的运动步数
                stepInfoList = stepInfoList.splice(24, 7);
                //上传筛选后的 stepInfoList
                uploadStepNumber(JSON.stringify(stepInfoList));

              }
            })

          }
        });



      }


    }

  })

  const gettime = (date) => {
    var d = new Date(date);
    return d.getTime()
  }
}
// 查询是否设置了基础信息 身高体重等
function queryIsSetBaseInfo(open_id) {
  wx.request({
    url: app.globalData.special_url + '/sport/queryIsSetBaseInfo',
    data: {
      open_id: open_id
    },
    success: function(res) {
      var isSet = res.data.data.isSet;
      if (isSet == '1') {
        //跳转到 设置sportTarget 页面
        wx.navigateTo({
          url: '/pages/sport/sportsettarget/sportSetTarget',
        })
      } else {
        //调用设置身高体重性别的页面
        wx.navigateTo({
          url: 'pages/myCenter/myUserInfo/myUserInfo',
        })
      }
    }
  })

}


Page({

  setSportTarget: function() {
    wx.navigateTo({
      url: '/pages/sport/sportsettarget/sportSetTarget'
    })
  },
  //选择 日历控件
  chooseDateTarget: function() {

    //模拟选择完日期后
    // var dateTarget = '2018-12-12';
    // saveSportTarget(open_id,dateTarget);
    wx.showToast({
      icon: 'none',
      title: '敬请期待'
    })

  },
  //科学建议 查看详情
  scienceAdvice: function() {

    wx.navigateTo({
      url: '/pages/sport/sport_science_advice/sportScienceAdvice',
    })

  },
  //健康指导
  queryGuidance: function() {

    wx.navigateTo({
      url: '/pages/sport/sportguidance/sportGuidance',
    })


  },
  //添加饮食记录
  addSportEatRecord: function() {

    wx.navigateTo({
      url: '/pages/sport/sporteatrecord/sportEatRecord',
    })

  },

  //添加运动记录
  addSportRecord: function() {

    wx.navigateTo({
      url: '/pages/sport/sportrecord/sportRecord',
    })

  },
  /**
   * 页面的初始数据
   */
  data: {
    platform: app.globalData.platform
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    sportIndex.that = this;
    //正式用这个
    open_id = app.globalData.userInfo.weChatOpenid;

    // var open_id = "ogCXM4g14h079omAvzzhVo203rMg";
    wx.setStorageSync('open_id', open_id);
    queryIsExistSportTarget(open_id);


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function() {

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