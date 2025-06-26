/**
 * NovaFlare Engine - Particle System
 * Creates an interactive particle background effect
 */

class ParticleSystem {
  constructor(options) {
    this.options = {
      selector: '#particles',
      particleCount: 100,
      connectDistance: 120,
      moveSpeed: 0.5,
      lineColor: 'rgba(52, 152, 219, 0.2)',
      particleColor: 'rgba(255, 105, 180, 0.6)',
      particleSize: 2,
      responsive: true,
      ...options
    };
    
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;
    this.resizeTimeout = null;
    
    this.init();
  }
  
  init() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Add canvas to DOM
    const container = document.querySelector(this.options.selector);
    if (!container) {
      console.error(`Element with selector ${this.options.selector} not found`);
      return;
    }
    
    container.appendChild(this.canvas);
    
    // Set canvas styles
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '0';
    
    // Set canvas size
    this.resize();
    
    // Create particles
    this.createParticles();
    
    // Start animation
    this.animate();
    
    // Add event listeners
    if (this.options.responsive) {
      window.addEventListener('resize', () => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => this.resize(), 200);
      });
    }
    
    // Add mouse interaction
    this.mouse = {
      x: null,
      y: null,
      radius: 100
    };
    
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    
    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
  
  resize() {
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    
    // Set canvas size with device pixel ratio for sharp rendering
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    
    // Recreate particles when resizing
    if (this.particles.length > 0) {
      this.particles = [];
      this.createParticles();
    }
  }
  
  createParticles() {
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1 + this.options.particleSize,
        speedX: (Math.random() - 0.5) * this.options.moveSpeed,
        speedY: (Math.random() - 0.5) * this.options.moveSpeed,
        opacity: Math.random() * 0.5 + 0.5
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Move particles
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Bounce off edges
      if (p.x < 0 || p.x > this.width) p.speedX *= -1;
      if (p.y < 0 || p.y > this.height) p.speedY *= -1;
      
      // Mouse interaction
      if (this.mouse.x && this.mouse.y) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          p.x -= Math.cos(angle) * force * 2;
          p.y -= Math.sin(angle) * force * 2;
        }
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.options.particleColor;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
      
      // Connect particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.options.connectDistance) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = this.options.lineColor;
          this.ctx.globalAlpha = (this.options.connectDistance - distance) / this.options.connectDistance * 0.8;
          this.ctx.stroke();
          this.ctx.globalAlpha = 1;
        }
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create particle container for hero section
  const hero = document.querySelector('.hero');
  const particleContainer = document.createElement('div');
  particleContainer.id = 'particles';
  particleContainer.style.position = 'absolute';
  particleContainer.style.top = '0';
  particleContainer.style.left = '0';
  particleContainer.style.width = '100%';
  particleContainer.style.height = '100%';
  particleContainer.style.overflow = 'hidden';
  hero.insertBefore(particleContainer, hero.firstChild);
  
  // Initialize particle system
  new ParticleSystem({
    selector: '#particles',
    particleCount: window.innerWidth < 768 ? 50 : 100,
    connectDistance: 150,
    moveSpeed: 0.3,
    lineColor: 'rgba(52, 152, 219, 0.15)',
    particleColor: 'rgba(255, 105, 180, 0.5)'
  });
});