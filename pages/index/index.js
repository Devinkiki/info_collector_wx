Page({
  data: {
    name: '',
    phone: '',
    message: '',
    imageUrl: '',
    signature: '',
    submissions: []
  },

  onLoad() {
    this.getSubmissions();
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imageUrl: res.tempFilePaths[0]
        });
      }
    });
  },

  // 预览图片
  previewImage() {
    wx.previewImage({
      urls: [this.data.imageUrl]
    });
  },

  // 获取签名数据
  onSigned(e) {
    this.setData({
      signature: e.detail
    });
  },

  // 提交表单
  submitForm() {
    if (!this.validateForm()) return;

    const formData = {
      name: this.data.name,
      phone: this.data.phone,
      message: this.data.message,
      imageUrl: this.data.imageUrl,
      signature: this.data.signature,
      timestamp: new Date().toLocaleString()
    };

    // 上传到服务器
    wx.showLoading({ title: '提交中...' });
    
    wx.uploadFile({
      url: 'your-server-url/api/submit',
      filePath: this.data.imageUrl,
      name: 'image',
      formData: {
        ...formData,
        signature: this.data.signature
      },
      success: (res) => {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        });
        this.resetForm();
        this.getSubmissions();
      },
      fail: (error) => {
        wx.hideLoading();
        wx.showToast({
          title: '提交失败',
          icon: 'error'
        });
        console.error('提交失败：', error);
      }
    });
  },

  // 表单验证
  validateForm() {
    if (!this.data.name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return false;
    }
    if (!this.data.phone) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return false;
    }
    if (!this.data.signature) {
      wx.showToast({ title: '请签名', icon: 'none' });
      return false;
    }
    return true;
  },

  // 重置表单
  resetForm() {
    this.setData({
      name: '',
      phone: '',
      message: '',
      imageUrl: '',
      signature: ''
    });
    this.selectComponent('#signature').clear();
  },

  // 获取提交记录
  getSubmissions() {
    wx.request({
      url: 'your-server-url/api/submissions',
      success: (res) => {
        this.setData({
          submissions: res.data
        });
      }
    });
  }
}); 