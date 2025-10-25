/**
 * NovaFlare Engine - 主要交互功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
        
        // 点击导航链接后关闭菜单
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 页面加载完成后的渐入效果
    document.body.classList.add('loaded');
    
    // 保持导航栏始终可见
    const header = document.querySelector('header');
    header.style.boxShadow = '0 2px 10px var(--shadow-color)';
    header.style.backgroundColor = 'var(--bg-primary)';
    
    // 添加交互动效
    const cards = document.querySelectorAll('.feature-card, .download-card, .doc-card, .community-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // 性能优化：防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 优化滚动事件监听
    const debouncedScroll = debounce(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加渐入动画
        document.querySelectorAll('.feature-card, .download-card, .doc-card, .community-card').forEach(element => {
            const elementTop = element.getBoundingClientRect().top + scrollTop;
            if (scrollTop + window.innerHeight > elementTop + 100) {
                element.classList.add('visible');
            }
        });
    }, 16);
    
    window.addEventListener('scroll', debouncedScroll);
    
    // 初始化时触发一次
    debouncedScroll();
    
    // 错误处理
    window.addEventListener('error', function(e) {
        console.error('页面错误:', e.message);
        // 这里可以添加错误报告逻辑
    });
    
    // 性能监控
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log('页面加载时间:', loadTime + 'ms');
        });
    }
});

// 添加页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面不可见时暂停一些动画或非必要的更新
        document.title = 'NovaFlare Engine zzzzzzzzz';
    } else {
        // 页面可见时恢复
        document.title = 'NovaFlare Engine';
    }
});