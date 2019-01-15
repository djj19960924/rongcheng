var amapFile = require('../../..//utils/amap-wx.js');
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var app = getApp();
Page({
  
  data: {
    weizhi: '正在定位...',
    files: [],//图片数组
    describe: "",//故障说明
    latitude: "",
    longitude: "",
    tempFilePathRecord: '',
    tempFilePathRecord2: '',
    phone: "",
    tempFilePath:''
  },
  onLoad: function (options) {
    var openid = app.globalData.userInfo.weChatOpenid;
    this.setData({
      openid: openid
    })
    let that = this;
    console.log("openid: ", that.data.openid)

    //获取当前位置
    var myAmapFun = new amapFile.AMapWX({ key: app.globalData.map_key });
    myAmapFun.getRegeo({
      success: function (data) {
        that.setData({
          weizhi: data[0].name + '(' + data[0].desc + ')',
          latitude: data[0].latitude,
          longitude: data[0].longitude
        })
        //成功回调
        // console.log("wz", that.data.weizhi)
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },

  // -------- vioce start --------
  start: function () {
    var that = this;
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      that.setData({
        tempFilePathRecord: '1'
      })
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  stop: function () {
    var that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
      that.setData({
        tempFilePathRecord: '2',
        tempFilePath: res.tempFilePath
      })
    })

  },
  play: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.play(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },
  // -------- voice end --------

  // -------- upload start --------
  chooseImage: function (e) {
    var that = this;
    if (this.data.files.length >= 10) {
      wx.showModal({
        title: '提示',
        content: '最多添加十张图片',
      })
      return
    }
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var files = that.data.files;
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          if (files.length < 10) {
            files = files.concat(res.tempFilePaths[i]);
          }
        }
        that.setData({
          files: files
        });
        console.log("files: ",that.data.files)
      }
    })
  },
  // -------- upload end --------

  //手机号
  listenPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },

  //故障说明
  listenDescribe(e){
    this.setData({
      describe: e.detail.value
    })
  },

  //提交
  bx_submit: function (e) {
    var that = this;
    var upLoadNumber = 0; //上传图片数组的下标数量
    var imgUrls = "";
    var recordFileUrl = "";
    var formId = "";
    console.log("wz", this.data.weizhi)
    var weizhi = this.data.weizhi;
    console.log("files", this.data.files)
    
    if (!this.data.phone) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        showCancel: false
      })
      return
    }
    if (this.data.describe == null || this.data.describe == "") {
      wx.showModal({
        title: '提示',
        content: '请输入设施故障描述',
        showCancel: false
      })
      return
    }
    if (this.data.files.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请上传故障图片',
        showCancel: false
      })
      return
    }
    wx.showLoading({
      title: '提交中...',
    })
    
    if (this.data.files.length > 0) {
      //1.上传图片 2.上传录音 3.提交订单
      uploadImg.call(this);
    } else if (this.data.files.length == 0 && this.data.tempFilePathRecord != "" && this.data.tempFilePathRecord != null) {
      //1.上传录音 2.提交订单
      uploadRecordFile.call(this);
    } else if (this.data.files.length == 0 && (this.data.tempFilePathRecord == "" || this.data.tempFilePathRecord != null)) {
      //1.提交订单
      submitOrder.call(this);
    }


    //上传图片
    function uploadImg() {
      console.log("filePath :", that.data.files)
      wx.uploadFile({
        url: app.globalData.url + 'uploadImages', //仅为示例，非真实的接口地址
        filePath: that.data.files[upLoadNumber],
        name: 'file',
        header: { "content-type": "multipart/form-data" },
        formData: {
          pathType: 'wximg',
        },
        success: function (res) {
          console.log('filePath: ',res);
          var mObject = JSON.parse(res.data);
          upLoadNumber++;
          if (imgUrls != "") {
            imgUrls = imgUrls + ";" + mObject.finalFileName;
          } else {
            imgUrls = mObject.finalFileName;
          }

          // imageIds.push(mObject.imageInfo.id);
          if (upLoadNumber == that.data.files.length) {
            console.log("图片上传完毕...");
            if (that.data.tempFilePathRecord != "" && that.data.tempFilePathRecord != null) {
              uploadRecordFile.call(that);
            } else {
              submitOrder.call(that);
            }
          } else {
            uploadImg.call(that);
          }
        },
        fail: function () {
          // fail
          // console.log('上传.....失败了')
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '提交失败!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
          })
        },
        complete: function () {
        }
      })
    }

    //上传录音文件
    function uploadRecordFile() {
      var that = this;
      console.log('录音', that.data.tempFilePath);
      wx.uploadFile({
        // url: app.globalData.ip + 'equipment/uploadFile', //仅为示例，非真实的接口地址
        url: app.globalData.url + 'uploadImages',
        filePath: that.data.tempFilePath,
        name: 'file',
        header: { "content-type": "multipart/form-data" },
        formData: {
          pathType: 'wxrecordfileurl',
        },
        success: function (res) {
          console.log("上传录音文件", res)
          var mObject = JSON.parse(res.data);
          recordFileUrl = mObject.finalFileName;
          //提交报修订单
          submitOrder.call(that);
        },
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '提交失败!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            }
          })
        }
      })
    }

    //提交报修订单
    function submitOrder() {
      var that = this;
      var install_time = that.data.date + "";
      console.log("openid11: ",that.data.openid)
      var param = {
        'position': that.data.weizhi, 'longitude': that.data.longitude,
        'latitude': that.data.latitude,
        'content': that.data.describe,
        'phone': that.data.phone,
        'voiceFile': recordFileUrl,
        'imgUrls': imgUrls,
        'formId': formId,
      }
      console.log(param);
      wx.request({
        url: app.globalData.url + "wx/equipment/addOrder",
        data: {
          param: param,
          openid: that.data.openid,
          organize_id: app.globalData.organize_id
        },
        success: function (res) {
          wx.hideLoading();
          console.log('djj',res.data);
          if (res.data.msg == 'success') {
            if (formId != "" && res.data.order == undefined) {
              //发送模板
              wxSendTemplate.call(that, formId);
            }
            // var content = "恭喜您报修成功，您将获得100积分的奖励，待后台24小时之内审核完毕后发放，感谢您的支持！"
            var content = "恭喜您报修成功，感谢您的支持！"
            wx.showModal({
              title: '提示',
              content: content,
              confirmText: "我的报修",
              confirmColor: "#398DE3",
              cancelText: "回到首页",
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../../myCenter/myRms/myRms',
                  })
                } else if (res.cancel) {
                  wx.switchTab({
                    url: '../../showIndex/showIndex',
                  })

                }
              }
            })
          }
          else {
            wx.showModal({
              title: '提示',
              content: '提交失败',
              showCancel: false
            })
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '提交失败!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            }
          })
        }
      })
    }
  }, 
})

//发送模板消息
function wxSendTemplate(formId) {
  var that = this;
  var values = '111';
  console.log(app.globalData.openid)
  console.log(formId)
  console.log(values)
  wx.request({
    url: getApp().globalData.url + "weixin/sendTemplate",
    data: {
      openid: this.data.openid,
      //prepay_id: formId,
      template_no: 1,//模板id
      values: values
    },
    success: function (res) {
      console.log('发送模板消息', res)
    }
  })
}

