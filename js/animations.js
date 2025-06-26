/**
 * NovaFlare Engine - Minimalist Animations
 * Simplified animations for better performance and minimalist design
 */

document.addEventListener('DOMContentLoaded', () => {
  // Simple logo effect
  simpleLogo();
  
  // Minimal card effects
  initMinimalCards();
  
  // Simple button effects
  initSimpleButtonEffects();
  
  // Scroll animations (simplified)
  initScrollAnimations();
});

/**
 * Apply simple effect to logo
 */
function simpleLogo() {
  const logo = document.querySelector('.logo img');
  if (!logo) return;
  
  // Add simple hover effect
  logo.style.transition = 'filter 0.3s ease';
  
  const parent = logo.parentElement;
  parent.addEventListener('mouseenter', () => {
    logo.style.filter = 'drop-shadow(0 0 5px rgba(0, 161, 255, 0.5))';
  });
  
  parent.addEventListener('mouseleave', () => {
    logo.style.filter = 'none';
  });
}

/**
 * Initialize minimal hover effects for feature cards
 */
function initMinimalCards() {
  const cards = document.querySelectorAll('.feature-card');
  
  cards.forEach(card => {
    // Simple hover effect
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
      
      // Simple icon effect
      const icon = card.querySelector('.feature-icon');
      if (icon) {
        icon.style.color = '#ff0066'; // Change to pink on hover
      }
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
      
      // Reset icon
      const icon = card.querySelector('.feature-icon');
      if (icon) {
        icon.style.color = '#00a1ff'; // Reset to blue
      }
    });
  });
}

/**
 * Initialize simple button hover effects
 */
function initSimpleButtonEffects() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(btn => {
    // Simple hover effect
    btn.addEventListener('mouseenter', () => {
      btn.style.borderColor = '#ff0066';
      btn.style.boxShadow = '0 0 10px rgba(0, 161, 255, 0.3)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      btn.style.boxShadow = 'none';
    });
  });
}

/**
 * Initialize simplified scroll animations
 */
function initScrollAnimations() {
  const sections = document.querySelectorAll('.section');
  
  // Create observer for simple fade-in effect
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
  
  // Add CSS for simplified fade-in animation
  const style = document.createElement('style');
  style.textContent = `
    .section-hidden {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .section-visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Add scroll progress indicator */
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 2px;
      background: linear-gradient(90deg, #00a1ff, #ff0066);
      z-index: 1000;
      transition: width 0.1s ease;
    }
  `;
  document.head.appendChild(style);
  
  // Create scroll progress indicator
  const progressBar = document.createElement('div');
  progressBar.classList.add('scroll-progress');
  document.body.appendChild(progressBar);
  
  // Update progress bar on scroll
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    progressBar.style.width = `${scrollPercent}%`;
  });
}
    