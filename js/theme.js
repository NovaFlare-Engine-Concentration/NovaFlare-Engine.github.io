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
        document.body.className = savedTheme;
        updateThemeIcon(savedTheme === 'dark-theme');
    } else if (prefersDarkScheme.matches) {
        document.body.className = 'dark-theme';
        updateThemeIcon(true);
    } else {
        document.body.className = 'light-theme';
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
        const isDark = document.body.className === 'dark-theme';
        const newTheme = isDark ? 'light-theme' : 'dark-theme';
        
        document.body.className = newTheme;
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(!isDark);
    });
    
    // 监听系统主题变化
    prefersDarkScheme.addEventListener('change', (e) => {
        // 只有在用户没有手动设置主题时才跟随系统
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark-theme' : 'light-theme';
            document.body.className = newTheme;
            updateThemeIcon(e.matches);
        }
    });
});