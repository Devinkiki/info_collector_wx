Component({
  data: {
    ctx: null,
    points: [],
    canvasWidth: 0,
    canvasHeight: 0
  },

  lifetimes: {
    attached() {
      const query = wx.createSelectorQuery().in(this);
      query.select('#signatureCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          
          const dpr = wx.getSystemInfoSync().pixelRatio;
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);
          
          this.setData({ 
            ctx,
            canvasWidth: res[0].width,
            canvasHeight: res[0].height
          });
        });
    }
  },

  methods: {
    onTouchStart(e) {
      const point = {
        x: e.touches[0].x,
        y: e.touches[0].y
      };
      this.data.points = [point];
      this.drawLine();
    },

    onTouchMove(e) {
      const point = {
        x: e.touches[0].x,
        y: e.touches[0].y
      };
      this.data.points.push(point);
      this.drawLine();
    },

    onTouchEnd() {
      const canvas = this.data.ctx.canvas;
      const dataUrl = canvas.toDataURL();
      this.triggerEvent('signed', dataUrl);
    },

    drawLine() {
      const ctx = this.data.ctx;
      const points = this.data.points;
      
      if (points.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    },

    clear() {
      const ctx = this.data.ctx;
      ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
      this.data.points = [];
    }
  }
}); 