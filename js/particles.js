/**
 * NovaFlare Engine - Particle System
 * 
 * 创建一个星空背景效果，包含闪烁的星星和可选的连线效果
 */

class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        // 默认配置
        this.options = {
            particleCount: 100,
            particleColor: '#ffffff',
            particleSize: 1.5,
            moveSpeed: 0.2,
            connectDistance: 100,
            showConnections: false,
            mouseInteraction: true,
            mouseRadius: 100,
            twinkleSpeed: 0.03,  // 闪烁速度
            ...options
        };
        
        this.particles = [];
        this.mousePosition = { x: null, y: null };
        this.animationFrame = null;
        
        // 设置画布尺寸
        this.resizeCanvas();
        
        // 事件监听
        window.addEventListener('resize', () => this.resizeCanvas());
        
        if (this.options.mouseInteraction) {
            this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.container.addEventListener('mouseleave', () => {
                this.mousePosition.x = null;
                this.mousePosition.y = null;
            });
        }
        
        // 自动初始化
        this.init();
    }
    
    init() {
        // 清除现有粒子
        this.particles = [];
        
        // 创建新粒子
        this.createParticles();
        
        // 开始动画
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * this.options.particleSize + 0.1,
                speedX: (Math.random() - 0.5) * this.options.moveSpeed,
                speedY: (Math.random() - 0.5) * this.options.moveSpeed,
                opacity: Math.random(),
                twinkleDirection: Math.random() > 0.5 ? 1 : -1  // 闪烁方向
            });
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // 计算与鼠标的距离
            let mouseDistance = Infinity;
            if (this.options.mouseInteraction && this.mousePosition.x !== null) {
                const dx = p.x - this.mousePosition.x;
                const dy = p.y - this.mousePosition.y;
                mouseDistance = Math.sqrt(dx * dx + dy * dy);
            }
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            
            // 根据鼠标距离调整不透明度
            let opacity = p.opacity;
            if (mouseDistance < this.options.mouseRadius) {
                opacity = Math.min(1, p.opacity + (1 - mouseDistance / this.options.mouseRadius) * 0.5);
            }
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fill();
            
            // 绘制连接线
            if (this.options.showConnections) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.options.connectDistance) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        const lineOpacity = (1 - distance / this.options.connectDistance) * 0.2;
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
                        this.ctx.stroke();
                    }
                }
            }
        }
    }
    
    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // 更新位置
            p.x += p.speedX;
            p.y += p.speedY;
            
            // 边界检查
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
            
            // 更新闪烁效果
            p.opacity += this.options.twinkleSpeed * p.twinkleDirection;
            
            // 反转闪烁方向
            if (p.opacity >= 1 || p.opacity <= 0.1) {
                p.twinkleDirection *= -1;
            }
            
            // 确保不透明度在有效范围内
            p.opacity = Math.max(0.1, Math.min(1, p.opacity));
        }
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        window.removeEventListener('resize', this.resizeCanvas);
        
        if (this.options.mouseInteraction) {
            this.container.removeEventListener('mousemove', this.handleMouseMove);
            this.container.removeEventListener('mouseleave', () => {
                this.mousePosition.x = null;
                this.mousePosition.y = null;
            });
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// 创建两个粒子系统 - 一个用于较大的星星，一个用于较小的星星
document.addEventListener('DOMContentLoaded', function() {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        // 大星星系统
        new ParticleSystem(particlesContainer, {
            particleCount: 50,
            particleSize: 2,
            moveSpeed: 0.1,
            twinkleSpeed: 0.01,
            showConnections: true,
            connectDistance: 150
        });
        
        // 小星星系统
        new ParticleSystem(particlesContainer, {
            particleCount: 100,
            particleSize: 1,
            moveSpeed: 0.05,
            twinkleSpeed: 0.005
        });
    }
});