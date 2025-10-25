/**
 * NovaFlare Engine - 语言切换功能
 */

document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('lang-toggle');
    
    // 检查本地存储中的语言设置
    const savedLang = localStorage.getItem('language') || 'zh';
    
    // 设置初始语言
    setLanguage(savedLang);
    
    // 切换语言
    langToggle.addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'zh';
        const newLang = currentLang === 'zh' ? 'en' : 'zh';
        setLanguage(newLang);
    });
    
    // 设置语言函数
    function setLanguage(lang) {
        // 保存语言设置
        localStorage.setItem('language', lang);
        
        // 更新切换按钮文本
        const toggleText = langToggle.querySelector('span');
        toggleText.textContent = lang === 'zh' ? 'EN' : '中';
        
        // 更新所有带有 data-en 和 data-zh 属性的元素
        const elements = document.querySelectorAll('[data-en][data-zh]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                // 如果元素是输入框或文本区域
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.getAttribute('placeholder')) {
                        element.placeholder = text;
                    } else {
                        element.value = text;
                    }
                } else {
                    element.textContent = text;
                }
            }
        });
        
        // 更新文档语言
        document.documentElement.lang = lang;
        
        // 触发自定义事件，通知其他可能需要响应语言变化的组件
        const event = new CustomEvent('languageChange', { detail: { language: lang } });
        document.dispatchEvent(event);
    }
});