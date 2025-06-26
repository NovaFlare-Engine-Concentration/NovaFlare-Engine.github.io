document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('fading-contributors');
    if (!container) return;

    // 从API获取贡献者数据
    fetch('https://api.github.com/repos/NovaFlare-Engine-Concentration/FNF-NovaFlare-Engine/contributors')
        .then(response => response.json())
        .then(contributors => {
            // 过滤掉主开发者(beihu235)
            const otherContributors = contributors.filter(c => 
                c.login.toLowerCase() !== 'beihu235'
            );
            
            // 按贡献数量排序
            otherContributors.sort((a, b) => b.contributions - a.contributions);
            
            // 渲染贡献者头像
            renderFadingContributors(otherContributors);
        })
        .catch(error => {
            console.error('Error fetching contributors:', error);
            container.innerHTML = '<p class="error-message">无法加载贡献者数据</p>';
        });

    // 可调整配置参数
    const config = {
        baseSpacing: 50,     // 基础水平间距
        baseDepth: 40,       // 基础前后深度
        angle: 0,           // 旋转角度
        spacingFactor: 0.9,  // 间距调整系数(0-1)
        depthFactor: 0.05,   // 深度调整系数(0-1)
        fadeFactor: 0.08,    // 透明度递减系数
        rowGap: 40,          // 两排之间的基础间距
        minVisible: 2,       // 最小可见人数
        maxVisible: 100,      // 最大可见人数
        offsetX: -40,          // 整体X轴偏移
        offsetY: -360,
        offsetScale: 0.1
    };

    function renderFadingContributors(contributors) {
        // 根据窗口宽度计算实际参数
        const windowWidth = window.innerWidth;
        // 保持两排之间的水平间距固定
        const spacing = config.baseSpacing * config.spacingFactor;
        const depth = config.baseDepth * (windowWidth / 1200) * config.depthFactor;
        
        // 将贡献者分成左右两组
        const leftGroup = [];
        const rightGroup = [];
        
        contributors.forEach((contributor, index) => {
            if (index % 2 === 0) {
                leftGroup.push(contributor);
            } else {
                rightGroup.push(contributor);
            }
        });
        
        // 渲染左侧头像(向右后方排列)
        leftGroup.forEach((contributor, index) => {
            createAvatar(contributor, index, 'left', spacing, depth);
        });
        
        // 渲染右侧头像(向左后方排列)
        rightGroup.forEach((contributor, index) => {
            createAvatar(contributor, index, 'right', spacing, depth);
        });

        // 添加窗口大小变化监听（使用防抖优化性能）
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                container.innerHTML = '';
                renderFadingContributors(contributors);
            }, 100); // 100毫秒延迟
        });
    }
    
    function createAvatar(contributor, index, side, spacing, depth) {
        const avatar = document.createElement('img');
        avatar.src = contributor.avatar_url;
        avatar.alt = contributor.login;
        avatar.className = 'fading-contributor';
        avatar.title = `${contributor.login} (${contributor.contributions} contributions)`;
        
        // 计算位置
        const offsetX = (index + 1) * spacing;
        const offsetZ = (index + 1) * depth;
        
        if (side === 'left') {
            avatar.style.transform = `
                translateX(calc(-${offsetX}px + ${config.offsetX}px - ${config.rowGap}px))
                translateY(${config.offsetY}px)
                translateZ(-${offsetZ}px)
                rotateY(${config.angle}deg)
                scale(${1 - index * 0.05 + config.offsetScale})
            `;
        } else {
            avatar.style.transform = `
                translateX(calc(${offsetX}px + ${config.offsetX}px + ${config.rowGap}px))
                translateY(${config.offsetY}px)
                translateZ(-${offsetZ}px)
                rotateY(-${config.angle}deg)
                scale(${1 - index * 0.05 + config.offsetScale})
            `;
        }
        
        // 计算可见人数范围和渐变效果
        const windowWidth = window.innerWidth;
        const visibleRange = Math.min(
            config.maxVisible,
            Math.max(
                config.minVisible,
                Math.floor(windowWidth / 100) // 每100px宽度增加1个可见头像
            )
        );
        
        // 设置透明度和可见性
        if (index < visibleRange) {
            // 保持渐变效果
            avatar.style.opacity = 1 - index * config.fadeFactor;
            avatar.style.display = 'block';
        } else {
            avatar.style.display = 'none';
        }
        
        container.appendChild(avatar);
    }

    // 暴露配置对象供外部调整
    window.fadingContributorsConfig = config;
});