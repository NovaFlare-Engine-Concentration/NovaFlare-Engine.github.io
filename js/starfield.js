/**
 * NovaFlare Engine - 星星背景效果
 * 创建随机移动的星星，靠近的星星会有线条连接
 */

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  
  // 设置画布大小为窗口大小
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  // 初始化调整画布大小
  resizeCanvas();
  
  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas);
  
  // 星星类
  class Star {
    constructor() {
      this.reset();
    }
    
    // 重置星星位置和属性
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speed = Math.random() * 0.3 + 0.1;
      this.brightness = Math.random() * 0.5 + 0.5;
      this.color = Math.random() > 0.5 ? '#3498db' : '#ff69b4';
      this.direction = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.05 + 0.01;
      this.twinklePhase = Math.random() * Math.PI * 2;
    }
    
    // 更新星星位置
    update() {
      // 移动星星
      this.x += Math.cos(this.direction) * this.speed;
      this.y += Math.sin(this.direction) * this.speed;
      
      // 闪烁效果
      this.twinklePhase += this.twinkleSpeed;
      if (this.twinklePhase > Math.PI * 2) {
        this.twinklePhase = 0;
      }
      
      // 如果星星移出画布，重置它
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
      
      // 随机改变方向
      if (Math.random() < 0.005) {
        this.direction += (Math.random() - 0.5) * Math.PI / 4;
      }
    }
    
    // 绘制星星
    draw() {
      const currentBrightness = this.brightness * (0.5 + 0.5 * Math.sin(this.twinklePhase));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = currentBrightness;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  
  // 创建星星数组
  const starCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
  const stars = [];
  
  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }
  
  // 连接线的最大距离
  const maxDistance = 150;
  
  // 动画循环
  function animate() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新并绘制每个星星
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    
    // 绘制星星之间的连接线
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          // 根据距离计算线的透明度
          const opacity = (1 - distance / maxDistance) * 0.5;
          
          // 绘制连接线
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          
          // 根据星星颜色确定线的颜色
          if (stars[i].color === stars[j].color) {
            ctx.strokeStyle = stars[i].color;
          } else {
            // 如果星星颜色不同，使用渐变
            const gradient = ctx.createLinearGradient(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
            gradient.addColorStop(0, stars[i].color);
            gradient.addColorStop(1, stars[j].color);
            ctx.strokeStyle = gradient;
          }
          
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    
    // 请求下一帧动画
    requestAnimationFrame(animate);
  }
  
  // 开始动画
  animate();
});