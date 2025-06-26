/**
 * NovaFlare Engine - Dynamic Particle System
 * 
 * A high-performance particle system that creates dynamic star field effects
 * with movement patterns, energy fields, and interactive behaviors.
 * 
 * Features:
 * - Dynamic particle movement with orbital and flow patterns
 * - Energy field interactions between particles
 * - Adaptive performance optimization
 * - Interactive force fields
 */

class NovaParticleEngine {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        // Engine configuration
        this.options = {
            particleCount: 100,
            particleColor: '#ffffff',
            particleSize: 1.5,
            baseSpeed: 0.2,
            orbitSpeed: 0.01,
            flowFieldIntensity: 0.5,
            energyFieldRadius: 150,
            energyFieldStrength: 0.3,
            connectDistance: 100,
            showConnections: false,
            mouseInteraction: true,
            mouseRadius: 100,
            twinkleSpeed: 0.03,
            adaptivePerformance: true,
            ...options
        };
        
        // Engine state
        this.particles = [];
        this.mousePosition = { x: null, y: null };
        this.animationFrame = null;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.flowField = this.createFlowField();
        this.performanceStats = {
            fps: 60,
            particleCount: this.options.particleCount,
            lastOptimization: Date.now()
        };
        
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
        // Clear existing particles
        this.particles = [];
        
        // Reset performance stats
        this.performanceStats = {
            fps: 60,
            particleCount: this.options.particleCount,
            lastOptimization: Date.now()
        };
        
        // Create flow field
        this.flowField = this.createFlowField();
        
        // Create particles
        this.createParticles();
        
        // Start animation loop
        this.lastTime = performance.now();
        this.deltaTime = 0;
        this.animate();
        
        console.log(`NovaFlare Engine initialized with ${this.particles.length} particles`);
    }
    
    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createFlowField() {
        const resolution = 20; // Flow field resolution
        const cols = Math.ceil(this.canvas.width / resolution);
        const rows = Math.ceil(this.canvas.height / resolution);
        const field = new Array(cols);
        
        for (let x = 0; x < cols; x++) {
            field[x] = new Array(rows);
            for (let y = 0; y < rows; y++) {
                // Create a vector field using Perlin noise or other algorithms
                // Here we use a simple sine wave pattern for demonstration
                const angle = Math.sin(x * 0.1) * Math.cos(y * 0.1) * Math.PI * 2;
                field[x][y] = {
                    x: Math.cos(angle) * this.options.flowFieldIntensity,
                    y: Math.sin(angle) * this.options.flowFieldIntensity
                };
            }
        }
        
        return {
            field,
            resolution,
            cols,
            rows
        };
    }
    
    createParticles() {
        for (let i = 0; i < this.options.particleCount; i++) {
            // Create particles with more complex properties
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * this.options.particleSize + 0.1,
                baseSize: Math.random() * this.options.particleSize + 0.1,
                speedX: (Math.random() - 0.5) * this.options.baseSpeed,
                speedY: (Math.random() - 0.5) * this.options.baseSpeed,
                opacity: Math.random(),
                twinkleDirection: Math.random() > 0.5 ? 1 : -1,
                // Orbital properties
                orbitAngle: Math.random() * Math.PI * 2,
                orbitRadius: Math.random() * 5 + 1,
                orbitSpeed: (Math.random() * 0.02 + 0.01) * this.options.orbitSpeed,
                // Energy properties
                energy: Math.random() * 0.5 + 0.5,
                energyDirection: Math.random() > 0.5 ? 1 : -1,
                // Color variations
                hue: Math.random() > 0.8 ? Math.random() * 60 : 0, // Occasional color variation
                // Lifespan for special particles
                lifespan: Math.random() > 0.95 ? 100 + Math.random() * 200 : -1
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
        // Clear canvas with slight fade effect for trails
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Optional: Visualize energy fields
        if (this.options.showEnergyFields) {
            this.drawEnergyFields(this.calculateEnergyCenters());
        }
        
        // Draw connections first (behind particles)
        if (this.options.showConnections) {
            this.drawConnections();
        }
        
        // Draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Calculate mouse influence
            let mouseDistance = Infinity;
            if (this.options.mouseInteraction && this.mousePosition.x !== null) {
                const dx = p.x - this.mousePosition.x;
                const dy = p.y - this.mousePosition.y;
                mouseDistance = Math.sqrt(dx * dx + dy * dy);
            }
            
            // Adjust opacity based on mouse distance
            let opacity = p.opacity;
            if (mouseDistance < this.options.mouseRadius) {
                opacity = Math.min(1, p.opacity + (1 - mouseDistance / this.options.mouseRadius) * 0.5);
            }
            
            // Draw particle glow effect
            const glow = p.size * (1 + p.energy * 0.5);
            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, glow * 2
            );
            
            // Determine color based on particle properties
            let color;
            if (p.lifespan > 0) {
                // Special particles with custom colors
                color = `hsla(${p.hue}, 100%, 70%, ${opacity})`;
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`);
                
                // Draw trail for special particles
                this.drawParticleTrail(p);
            } else {
                // Regular particles
                color = p.hue > 0 
                    ? `hsla(${p.hue}, 80%, 80%, ${opacity})` 
                    : `rgba(255, 255, 255, ${opacity})`;
                
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            }
            
            // Draw particle core
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            
            // Draw particle glow
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
    }
    
    drawConnections() {
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.connectDistance) {
                    // Calculate connection strength based on distance and particle energies
                    const strength = (1 - distance / this.options.connectDistance) * 
                                     Math.min(p1.energy, p2.energy) * 0.5;
                    
                    // Create gradient for connection line
                    const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    
                    // Use particle colors for connection gradient
                    const color1 = p1.hue > 0 
                        ? `hsla(${p1.hue}, 80%, 70%, ${strength})` 
                        : `rgba(255, 255, 255, ${strength})`;
                    
                    const color2 = p2.hue > 0 
                        ? `hsla(${p2.hue}, 80%, 70%, ${strength})` 
                        : `rgba(255, 255, 255, ${strength})`;
                    
                    gradient.addColorStop(0, color1);
                    gradient.addColorStop(1, color2);
                    
                    // Draw connection line
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = strength * 2;
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    drawParticleTrail(particle) {
        // Draw trail behind special particles
        if (particle.lifespan > 0 && particle.prevX && particle.prevY) {
            const speed = Math.sqrt(
                particle.speedX * particle.speedX + 
                particle.speedY * particle.speedY
            );
            
            const trailLength = Math.min(10, speed * 10);
            
            // Calculate trail points
            const angle = Math.atan2(particle.speedY, particle.speedX);
            const trailX = particle.x - Math.cos(angle) * trailLength;
            const trailY = particle.y - Math.sin(angle) * trailLength;
            
            // Create gradient for trail
            const gradient = this.ctx.createLinearGradient(
                particle.x, particle.y, 
                trailX, trailY
            );
            
            gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`);
            gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 70%, 0)`);
            
            // Draw trail
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(trailX, trailY);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = particle.size * 1.5;
            this.ctx.stroke();
        }
        
        // Store current position for next frame
        particle.prevX = particle.x;
        particle.prevY = particle.y;
    }
    
    drawEnergyFields(energyCenters) {
        // Visualize energy fields
        for (const center of energyCenters) {
            const gradient = this.ctx.createRadialGradient(
                center.x, center.y, 0,
                center.x, center.y, center.radius
            );
            
            gradient.addColorStop(0, 'rgba(100, 100, 255, 0.05)');
            gradient.addColorStop(0.5, 'rgba(100, 100, 255, 0.02)');
            gradient.addColorStop(1, 'rgba(100, 100, 255, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(center.x, center.y, center.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
    }
    
    updateParticles() {
        // Calculate energy centers for field effects
        const energyCenters = this.calculateEnergyCenters();
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Apply flow field influence
            this.applyFlowField(p);
            
            // Apply orbital movement
            this.applyOrbitalMovement(p);
            
            // Apply energy field effects
            this.applyEnergyFields(p, energyCenters);
            
            // Apply mouse interaction if enabled
            if (this.options.mouseInteraction && this.mousePosition.x !== null) {
                this.applyMouseForce(p);
            }
            
            // Update position with combined forces
            p.x += p.speedX * this.deltaTime;
            p.y += p.speedY * this.deltaTime;
            
            // Boundary handling with wrap-around effect
            if (p.x < -50) p.x = this.canvas.width + 50;
            if (p.x > this.canvas.width + 50) p.x = -50;
            if (p.y < -50) p.y = this.canvas.height + 50;
            if (p.y > this.canvas.height + 50) p.y = -50;
            
            // Update twinkle effect
            p.opacity += this.options.twinkleSpeed * p.twinkleDirection * this.deltaTime * 60;
            
            // Reverse twinkle direction at boundaries
            if (p.opacity >= 1 || p.opacity <= 0.1) {
                p.twinkleDirection *= -1;
            }
            
            // Ensure opacity stays in valid range
            p.opacity = Math.max(0.1, Math.min(1, p.opacity));
            
            // Update energy levels
            p.energy += 0.01 * p.energyDirection * this.deltaTime * 60;
            if (p.energy >= 1 || p.energy <= 0.5) {
                p.energyDirection *= -1;
            }
            
            // Update size based on energy
            p.size = p.baseSize * (0.8 + p.energy * 0.4);
            
            // Handle special particles with lifespan
            if (p.lifespan > 0) {
                p.lifespan -= this.deltaTime * 60;
                if (p.lifespan <= 0) {
                    // Replace with a new particle
                    this.particles[i] = this.createSingleParticle();
                }
            }
        }
        
        // Occasionally spawn special particles
        if (Math.random() < 0.01 * this.deltaTime * 60) {
            this.spawnSpecialParticle();
        }
    }
    
    calculateEnergyCenters() {
        // Create dynamic energy centers that influence particle behavior
        const centers = [];
        const time = Date.now() * 0.001;
        
        // Add fixed energy centers
        centers.push({
            x: this.canvas.width * 0.5 + Math.sin(time * 0.3) * this.canvas.width * 0.3,
            y: this.canvas.height * 0.5 + Math.cos(time * 0.2) * this.canvas.height * 0.3,
            radius: this.options.energyFieldRadius,
            strength: this.options.energyFieldStrength
        });
        
        // Add secondary energy center
        centers.push({
            x: this.canvas.width * 0.7 + Math.cos(time * 0.4) * this.canvas.width * 0.2,
            y: this.canvas.height * 0.3 + Math.sin(time * 0.5) * this.canvas.height * 0.2,
            radius: this.options.energyFieldRadius * 0.7,
            strength: this.options.energyFieldStrength * 0.8
        });
        
        return centers;
    }
    
    applyFlowField(particle) {
        // Get flow field vector at particle position
        const col = Math.floor(particle.x / this.flowField.resolution);
        const row = Math.floor(particle.y / this.flowField.resolution);
        
        // Check if particle is within flow field bounds
        if (col >= 0 && col < this.flowField.cols && row >= 0 && row < this.flowField.rows) {
            const flowVector = this.flowField.field[col][row];
            
            // Apply flow field force
            particle.speedX += flowVector.x * this.deltaTime * 60 * 0.01;
            particle.speedY += flowVector.y * this.deltaTime * 60 * 0.01;
            
            // Limit speed
            const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (speed > this.options.baseSpeed * 2) {
                particle.speedX = (particle.speedX / speed) * this.options.baseSpeed * 2;
                particle.speedY = (particle.speedY / speed) * this.options.baseSpeed * 2;
            }
        }
    }
    
    applyOrbitalMovement(particle) {
        // Update orbital angle
        particle.orbitAngle += particle.orbitSpeed * this.deltaTime * 60;
        
        // Apply orbital force
        const orbitalForceX = Math.cos(particle.orbitAngle) * particle.orbitRadius * 0.001;
        const orbitalForceY = Math.sin(particle.orbitAngle) * particle.orbitRadius * 0.001;
        
        particle.speedX += orbitalForceX;
        particle.speedY += orbitalForceY;
    }
    
    applyEnergyFields(particle, energyCenters) {
        for (const center of energyCenters) {
            // Calculate distance to energy center
            const dx = particle.x - center.x;
            const dy = particle.y - center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply force if within influence radius
            if (distance < center.radius) {
                const force = (1 - distance / center.radius) * center.strength;
                
                // Particles are attracted or repelled based on their energy level
                const direction = particle.energy > 0.75 ? -1 : 1;
                
                // Apply force vector
                particle.speedX += (dx / distance) * force * direction * this.deltaTime * 60 * 0.01;
                particle.speedY += (dy / distance) * force * direction * this.deltaTime * 60 * 0.01;
            }
        }
    }
    
    applyMouseForce(particle) {
        // Calculate distance to mouse
        const dx = particle.x - this.mousePosition.x;
        const dy = particle.y - this.mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Apply force if within mouse radius
        if (distance < this.options.mouseRadius) {
            const force = (1 - distance / this.options.mouseRadius) * 0.05;
            
            // Apply force vector - particles are attracted to mouse
            particle.speedX += (dx / distance) * force * -1 * this.deltaTime * 60;
            particle.speedY += (dy / distance) * force * -1 * this.deltaTime * 60;
        }
    }
    
    createSingleParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * this.options.particleSize + 0.1,
            baseSize: Math.random() * this.options.particleSize + 0.1,
            speedX: (Math.random() - 0.5) * this.options.baseSpeed,
            speedY: (Math.random() - 0.5) * this.options.baseSpeed,
            opacity: Math.random(),
            twinkleDirection: Math.random() > 0.5 ? 1 : -1,
            orbitAngle: Math.random() * Math.PI * 2,
            orbitRadius: Math.random() * 5 + 1,
            orbitSpeed: (Math.random() * 0.02 + 0.01) * this.options.orbitSpeed,
            energy: Math.random() * 0.5 + 0.5,
            energyDirection: Math.random() > 0.5 ? 1 : -1,
            hue: Math.random() > 0.8 ? Math.random() * 60 : 0,
            lifespan: Math.random() > 0.95 ? 100 + Math.random() * 200 : -1
        };
    }
    
    spawnSpecialParticle() {
        // Create a special particle like a shooting star
        if (this.particles.length > 10) {
            const index = Math.floor(Math.random() * this.particles.length);
            const p = this.particles[index];
            
            // Transform into a shooting star
            p.speedX = (Math.random() - 0.5) * this.options.baseSpeed * 10;
            p.speedY = (Math.random() - 0.5) * this.options.baseSpeed * 10;
            p.size = p.baseSize * 2;
            p.opacity = 1;
            p.lifespan = 60 + Math.random() * 60;
            p.hue = Math.random() * 60;
        }
    }
    
    animate(timestamp = 0) {
        // Calculate delta time for smooth animation regardless of frame rate
        this.deltaTime = (timestamp - this.lastTime) / 1000;
        if (this.deltaTime > 0.1) this.deltaTime = 0.1; // Cap delta time
        this.lastTime = timestamp;
        
        // Update performance stats
        this.updatePerformanceStats();
        
        // Update and draw particles
        this.updateParticles();
        this.drawParticles();
        
        // Debug info if enabled
        if (this.options.showDebugInfo) {
            this.drawDebugInfo();
        }
        
        // Request next frame
        this.animationFrame = requestAnimationFrame((ts) => this.animate(ts));
    }
    
    updatePerformanceStats() {
        // Calculate FPS
        const now = Date.now();
        const elapsed = now - this.performanceStats.lastOptimization;
        
        if (elapsed > 1000) { // Update every second
            // Calculate FPS
            this.performanceStats.fps = Math.round(1 / this.deltaTime);
            
            // Apply adaptive performance if enabled
            if (this.options.adaptivePerformance && elapsed > 3000) {
                this.optimizePerformance();
                this.performanceStats.lastOptimization = now;
            }
        }
    }
    
    optimizePerformance() {
        // Adjust particle count based on performance
        if (this.performanceStats.fps < 30 && this.particles.length > 50) {
            // Reduce particle count if FPS is low
            const reduction = Math.floor(this.particles.length * 0.1);
            this.particles.splice(this.particles.length - reduction, reduction);
            this.performanceStats.particleCount = this.particles.length;
            console.log(`Performance optimization: Reduced particles to ${this.particles.length}`);
        } else if (this.performanceStats.fps > 55 && this.particles.length < this.options.particleCount) {
            // Increase particle count if FPS is high
            const addition = Math.min(10, this.options.particleCount - this.particles.length);
            for (let i = 0; i < addition; i++) {
                this.particles.push(this.createSingleParticle());
            }
            this.performanceStats.particleCount = this.particles.length;
            console.log(`Performance optimization: Increased particles to ${this.particles.length}`);
        }
    }
    
    drawDebugInfo() {
        // Display performance information
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(10, 10, 200, 80);
        
        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`FPS: ${this.performanceStats.fps}`, 20, 30);
        this.ctx.fillText(`Particles: ${this.particles.length}`, 20, 50);
        this.ctx.fillText(`Resolution: ${this.canvas.width}x${this.canvas.height}`, 20, 70);
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        window.removeEventListener('resize', () => this.resizeCanvas());
        
        if (this.options.mouseInteraction) {
            this.container.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.container.removeEventListener('mouseleave', () => {
                this.mousePosition.x = null;
                this.mousePosition.y = null;
            });
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        console.log('NovaFlare Engine destroyed');
    }
    
    // API methods for external control
    
    setOption(key, value) {
        if (this.options.hasOwnProperty(key)) {
            this.options[key] = value;
            
            // Handle special cases
            if (key === 'particleCount') {
                this.adjustParticleCount(value);
            }
            
            return true;
        }
        return false;
    }
    
    adjustParticleCount(count) {
        const currentCount = this.particles.length;
        
        if (count > currentCount) {
            // Add particles
            for (let i = 0; i < count - currentCount; i++) {
                this.particles.push(this.createSingleParticle());
            }
        } else if (count < currentCount) {
            // Remove particles
            this.particles.splice(count, currentCount - count);
        }
        
        this.performanceStats.particleCount = this.particles.length;
    }
    
    pause() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
            return true;
        }
        return false;
    }
    
    resume() {
        if (!this.animationFrame) {
            this.lastTime = performance.now();
            this.animate();
            return true;
        }
        return false;
    }
    
    getStats() {
        return {
            fps: this.performanceStats.fps,
            particleCount: this.particles.length,
            canvasSize: {
                width: this.canvas.width,
                height: this.canvas.height
            }
        };
    }
}

// Initialize the NovaFlare Engine
document.addEventListener('DOMContentLoaded', function() {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        // Create main particle system
        window.novaFlareEngine = new NovaParticleEngine(particlesContainer, {
            particleCount: 180,          // 增加粒子数量
            particleSize: 1.2,           // 稍微减小基础大小
            baseSpeed: 0.08,             // 降低基础速度使运动更柔和
            orbitSpeed: 0.005,           // 减小轨道速度
            flowFieldIntensity: 0.15,    // 减小流场强度
            energyFieldRadius: 250,       // 增加能量场范围
            energyFieldStrength: 0.15,    // 减小能量场强度使运动更自然
            showConnections: true,
            connectDistance: 120,         // 调整连接距离
            twinkleSpeed: 0.008,         // 降低闪烁速度
            adaptivePerformance: true,
            showDebugInfo: false,
            showEnergyFields: true       // 启用能量场可视化
        });
        
        // Expose API to window for external control
        window.toggleDebugInfo = function() {
            if (window.novaFlareEngine) {
                window.novaFlareEngine.setOption('showDebugInfo', 
                    !window.novaFlareEngine.options.showDebugInfo);
            }
        };
    }
});