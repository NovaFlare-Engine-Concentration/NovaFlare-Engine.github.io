/**
 * NovaFlare Engine - Animations
 * Adds various animation effects to the website
 */

document.addEventListener('DOMContentLoaded', () => {
  // Logo animation
  animateLogo();
  
  // Feature cards hover effects
  initFeatureCards();
  
  // Button hover effects
  initButtonEffects();
  
  // Scroll animations
  initScrollAnimations();
  
  // Glitch text effect for hero title
  initGlitchEffect();
  
  // Floating elements
  initFloatingElements();
});

/**
 * Animate the logo with a subtle pulse and glow effect
 */
function animateLogo() {
  const logo = document.querySelector('.logo img');
  if (!logo) return;
  
  // Add CSS classes for animation
  logo.classList.add('animated-logo');
  
  // Create a wrapper for the logo with glow effect
  const parent = logo.parentElement;
  const wrapper = document.createElement('div');
  wrapper.classList.add('logo-wrapper');
  
  // Move the logo into the wrapper
  parent.insertBefore(wrapper, logo);
  wrapper.appendChild(logo);
  
  // Add a glow element
  const glow = document.createElement('div');
  glow.classList.add('logo-glow');
  wrapper.appendChild(glow);
  
  // Add CSS for the animation
  const style = document.createElement('style');
  style.textContent = `
    .logo-wrapper {
      position: relative;
      display: inline-block;
    }
    
    .animated-logo {
      animation: logo-pulse 3s infinite ease-in-out;
      filter: drop-shadow(0 0 5px rgba(52, 152, 219, 0.5));
      transition: all 0.3s ease;
    }
    
    .logo-wrapper:hover .animated-logo {
      filter: drop-shadow(0 0 10px rgba(52, 152, 219, 0.8));
      transform: scale(1.05);
    }
    
    .logo-glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba(52, 152, 219, 0.3) 0%, transparent 70%);
      opacity: 0;
      animation: logo-glow 3s infinite ease-in-out;
      pointer-events: none;
      z-index: -1;
    }
    
    @keyframes logo-pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.03);
      }
    }
    
    @keyframes logo-glow {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.2);
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Initialize hover effects for feature cards
 */
function initFeatureCards() {
  const cards = document.querySelectorAll('.feature-card');
  
  cards.forEach(card => {
    // Add 3D tilt effect on hover
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angleX = (y - centerY) / 20;
      const angleY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    // Reset transform on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
    
    // Add a subtle animation to the icon
    const icon = card.querySelector('.feature-icon');
    if (icon) {
      icon.style.transition = 'transform 0.3s ease';
      
      card.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.2)';
      });
      
      card.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1)';
      });
    }
  });
}

/**
 * Initialize button hover effects
 */
function initButtonEffects() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(btn => {
    // Create ripple effect
    btn.addEventListener('click', function(e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      btn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add CSS for ripple effect
  const style = document.createElement('style');
  style.textContent = `
    .btn {
      position: relative;
      overflow: hidden;
    }
    
    .btn-ripple {
      position: absolute;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  const sections = document.querySelectorAll('.section');
  
  // Create observer for fade-in effect
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Observe all sections
  sections.forEach(section => {
    section.classList.add('section-hidden');
    observer.observe(section);
  });
  
  // Add CSS for fade-in animation
  const style = document.createElement('style');
  style.textContent = `
    .section-hidden {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .section-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}

/**
 * Initialize glitch text effect for hero title
 */
function initGlitchEffect() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;
  
  // Store original text
  const originalText = heroTitle.textContent;
  heroTitle.setAttribute('data-text', originalText);
  
  // Create glitch layers
  const glitchWrapper = document.createElement('div');
  glitchWrapper.classList.add('glitch-wrapper');
  
  // Clone the title for glitch effect
  heroTitle.parentNode.insertBefore(glitchWrapper, heroTitle);
  glitchWrapper.appendChild(heroTitle);
  
  // Create glitch layers
  const beforeLayer = document.createElement('div');
  beforeLayer.classList.add('glitch-layer', 'glitch-before');
  beforeLayer.setAttribute('data-text', originalText);
  
  const afterLayer = document.createElement('div');
  afterLayer.classList.add('glitch-layer', 'glitch-after');
  afterLayer.setAttribute('data-text', originalText);
  
  glitchWrapper.insertBefore(beforeLayer, heroTitle);
  glitchWrapper.appendChild(afterLayer);
  
  // Add CSS for glitch effect
  const style = document.createElement('style');
  style.textContent = `
    .glitch-wrapper {
      position: relative;
      display: inline-block;
      font-weight: 700;
    }
    
    .glitch-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.8;
    }
    
    .glitch-before {
      left: -2px;
      text-shadow: 2px 0 #ff00cc;
      animation: glitch-animation-1 3s infinite linear alternate-reverse;
      clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
    }
    
    .glitch-after {
      left: 2px;
      text-shadow: -2px 0 #00ccff;
      animation: glitch-animation-2 2s infinite linear alternate-reverse;
      clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
    }
    
    .glitch-layer::before {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    @keyframes glitch-animation-1 {
      0% {
        clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        transform: translate(0);
      }
      20% {
        clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%);
        transform: translate(-2px, 2px);
      }
      40% {
        clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%);
        transform: translate(-2px, 2px);
      }
      60% {
        clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%);
        transform: translate(2px, -2px);
      }
      80% {
        clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%);
        transform: translate(2px, -2px);
      }
      100% {
        clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%);
        transform: translate(0);
      }
    }
    
    @keyframes glitch-animation-2 {
      0% {
        clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
        transform: translate(0);
      }
      20% {
        clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
        transform: translate(2px, 2px);
      }
      40% {
        clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
        transform: translate(2px, 2px);
      }
      60% {
        clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
        transform: translate(-2px, -2px);
      }
      80% {
        clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
        transform: translate(-2px, -2px);
      }
      100% {
        clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
        transform: translate(0);
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Initialize floating elements
 */
function initFloatingElements() {
  // Create floating tech elements
  const floatingElements = [
    { icon: 'fas fa-code', delay: 0 },
    { icon: 'fas fa-microchip', delay: 1 },
    { icon: 'fas fa-terminal', delay: 2 },
    { icon: 'fas fa-database', delay: 3 },
    { icon: 'fas fa-cog', delay: 4 }
  ];
  
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  // Create floating container
  const floatingContainer = document.createElement('div');
  floatingContainer.classList.add('floating-elements');
  hero.appendChild(floatingContainer);
  
  // Create floating elements
  floatingElements.forEach((element, index) => {
    const floatingEl = document.createElement('div');
    floatingEl.classList.add('floating-element');
    floatingEl.style.animationDelay = `${element.delay}s`;
    
    const icon = document.createElement('i');
    icon.className = element.icon;
    floatingEl.appendChild(icon);
    
    floatingContainer.appendChild(floatingEl);
  });
  
  // Add CSS for floating elements
  const style = document.createElement('style');
  style.textContent = `
    .floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
    }
    
    .floating-element {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(18, 18, 18, 0.7);
      color: rgba(255, 255, 255, 0.7);
      box-shadow: 0 0 15px rgba(52, 152, 219, 0.4);
      border: 1px solid rgba(255, 105, 180, 0.3);
      animation: float 15s infinite linear;
      opacity: 0.7;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }
    
    .floating-element:nth-child(1) {
      top: 20%;
      left: 10%;
      animation-duration: 20s;
    }
    
    .floating-element:nth-child(2) {
      top: 70%;
      left: 20%;
      animation-duration: 25s;
    }
    
    .floating-element:nth-child(3) {
      top: 30%;
      left: 80%;
      animation-duration: 22s;
    }
    
    .floating-element:nth-child(4) {
      top: 80%;
      left: 70%;
      animation-duration: 18s;
    }
    
    .floating-element:nth-child(5) {
      top: 50%;
      left: 50%;
      animation-duration: 30s;
    }
    
    @keyframes float {
      0% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(100px, 50px) rotate(90deg);
      }
      50% {
        transform: translate(200px, 0) rotate(180deg);
      }
      75% {
        transform: translate(100px, -50px) rotate(270deg);
      }
      100% {
        transform: translate(0, 0) rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
}
    