// miniprogram/pages/myCenter/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    type_array: ['建议', '投诉'],
    type_index: 0,
    images: [],
    content: '', //意见内容
    switch1: true,

    files: [],//图片数组
  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      'switch1': detail.value
    })

  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      type_index: e.detail.value
    })
  },



  // 意见反馈
  inputContent: function(e) {
    console.log(e.detail.value);
    this.setData({
      content: e.detail.value,
    })
  },


  // 选择图片
  // chooseImage: function(e) {
  //   console.log('--- choose image ')
  //   let that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function(res) {
  //       const tempFilePaths = res.tempFilePaths
  //       console.log(tempFilePaths);
  //       const images = that.data.images.concat(tempFilePaths)

  //       console.log(images);
  //       // 限制最多只能留下3张照片 还需要一个提示
  //       that.setData({
  //         images: images.length <= 3 ? images : images.slice(0, 3),
  //       })
  //     },
  //     fail: function(res) {
  //       console.log(res)
  //     }
  //   })
  // },
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
      }
    })
  },


// 长按删除
  removeImage: function(e) {
    const idx = e.target.dataset.idx
    console.log('--- idx ' + idx)
    let that = this;
    wx.showModal({
      title: '确认删除',
      content: '',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let newImages = [];
          for (let i = 0; i < that.data.images.length; i++) {
            if (i != idx) {
              newImages.push(that.data.images[i])
            }
          }
          console.log('--- remove')
          console.log(newImages)
          that.setData({
            images: newImages,
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },

  // 图片预览
  handleImagePreview: function(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },

  // 上传图片
  submitForm: function(e) {
 
    console.log('upload')
    const content = this.data.content

    console.log(content);

    if (content) {
      let arr = []

      console.log(this.data.images);

      const uploadTask = wx.uploadFile({
        url: 'http://192.168.2.88:8089/upload/single', //仅为示例，非真实的接口地址
        filePath: this.data.images[0],
        name: 'file',
        formData: {
          'user': 'test'
        },
        success: function (res) {
          var data = res.data
          //do something
        }
      })

      uploadTask.onProgressUpdate((res) => {
        console.log('上传进度', res.progress)
        console.log('已经上传的数据长度', res.totalBytesSent)
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      })

      //将选择的图片组成一个Promise数组，准备进行并行上传
      // for (let i = 0; i < this.data.images.length; i++) {
        // arr.push(wx.uploadFile({
        //   url: 'http://192.168.2.88:8089/upload/single',
        //   filePath: this.data.images[i],
        //   name: 'file',
        // }))
      // }

      // console.log('--- upload')
      // wx.showLoading({
      //   title: '正在上传...',
      //   mask: true
      // })

      // console.log(arr)
      // // 开始并行上传图片
      // Promise.all(arr).then(res => {
      //   // 上传成功，获取这些图片在服务器上的地址，组成一个数组
      //   // return res.map(item => JSON.parse(item.data).url)
      //    console.log(res)
      // }).catch(err => {
      //   console.log(">>>> upload images error:", err)
      // })
      // .then(urls => {
      //   console.log(urls)
      //   // 调用保存问题的后端接口
      //   // return createQuestion({
      //   //   title: title,
      //   //   content: content,
      //   //   images: urls
      //   // })
      // }).then(res => {
      //   console.log(res)
        
      //   // const pages = getCurrentPages();
      //   // const currPage = pages[pages.length - 1];
      //   // const prevPage = pages[pages.length - 2];

      //   // 将新创建的问题，添加到前一页（问题列表页）第一行
      //   // prevPage.data.questions.unshift(res)

      //   // wx.navigateBack()
      // }).catch(err => {
      //   console.log(">>>> create question error:", err)
      // })
      // .then(() => {
        // wx.hideLoading()
      // })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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