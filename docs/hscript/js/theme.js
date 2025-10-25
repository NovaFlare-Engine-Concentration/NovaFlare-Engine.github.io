/**
 * NovaFlare Engine - 主题切换功能
 */

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    
    // 根据保存的设置或系统偏好设置初始主题
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme === 'dark');
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon(false);
    }
    
    // 更新主题图标
    function updateThemeIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
    
    // 切换主题
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const isDark = currentTheme === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(!isDark);
    });
    
    // 监听系统主题变化
    prefersDarkScheme.addEventListener('change', (e) => {
        // 只有在用户没有手动设置主题时才跟随系统
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(e.matches);
        }
    });
});