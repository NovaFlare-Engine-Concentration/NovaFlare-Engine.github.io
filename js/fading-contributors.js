document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('fading-contributors');
    if (!container) return;

    // 从API获取贡献者数据
    fetch('https://api.github.com/repos/NovaFlare-Engine-Concentration/FNF-NovaFlare-Engine/contributors?pre_page=100')
        .then(response => response.json())
        .then(contributors => {
            // 过滤掉主开发者(beihu235)
            const allowedContributors = [
                //'beihu235', // 主开发者(仍会特殊处理)
                'MaoPou',    // 必须与GitHub用户名完全一致
                'Tie-Guo',
                'VapireMox',
                'Stefan2008Git',
                'moxie-coder',
                'sirthegamercoder',
            ];

            const allowedNoGithub = [
                { login: 'Chiny', avatarUrl: 'https://raw.githubusercontent.com/NovaFlare-Engine-Concentration/FNF-NovaFlare-Engine/refs/heads/main/assets/shared/images/credits/bigIcon/chiny.png', url: 'https://space.bilibili.com/3493288327777064' },
                { login: 'Careful_Scarf_487', avatarUrl: 'https://raw.githubusercontent.com/NovaFlare-Engine-Concentration/FNF-NovaFlare-Engine/refs/heads/main/assets/shared/images/credits/bigIcon/Careful_Scarf_487.png', url: 'https://b23.tv/DQ1a0jO' },
                { login: 'MengQi', avatarUrl: 'https://raw.githubusercontent.com/NovaFlare-Engine-Concentration/FNF-NovaFlare-Engine/refs/heads/main/assets/shared/images/credits/bigIcon/mengqi.png', url: 'https://space.bilibili.com/2130239542' },
                { login: 'AZjessica', avatarUrl: 'https://raw.githubusercontent.com/NovaFlare-Engine-Concentration/FNF-NovaFlare-Engine/refs/heads/main/assets/shared/images/credits/bigIcon/AZjessica.png', url: 'https://youtube.com/@azjessica?si=aRKuPdMHR1LLBxH1' },
                { login: 'Ben Eyre', avatarUrl: 'https://raw.githubusercontent.com/NovaFlare-Engine-Concentration/FNF-NovaFlare-Engine/refs/heads/main/assets/shared/images/credits/bigIcon/beneyre.png', url: 'https://x.com/hngstngxng83905?t=GDKWYMRZsCMUMXYs0cmYrw&s=09' },
                { login: 'Als', avatarUrl: 'https://raw.githubusercontent.com/NovaFlare-Engine-Concentration/FNF-NovaFlare-Engine/refs/heads/main/assets/shared/images/credits/als.png', url: 'https://b23.tv/mNNX8R8' },
                { login: 'blockDDDdark', avatarUrl: 'https://raw.githubusercontent.com/NovaFlare-Engine-Concentration/FNF-NovaFlare-Engine/refs/heads/main/assets/shared/images/credits/bigIcon/ddd.png', url: 'https://space.bilibili.com/401733211' }
            ];

            
            const otherContributors = contributors.filter(c => 
                allowedContributors.includes(c.login)
            );

            const noGithubContributors = allowedNoGithub.map(member => ({
                login: member.login,
                contributions: 0, // 假设没有 GitHub 贡献的成员贡献值为 0
                avatar_url: member.avatarUrl
            }));
            otherContributors.push(...noGithubContributors);
            renderFadingContributors(otherContributors);
        })
        .catch(error => {
            console.error('Error fetching contributors:', error);
            container.innerHTML = '<p class="error-message">无法加载贡献者数据 ${error}</p>';
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

    function renderFadingContributors(contributors, haveGithub = true) {
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
            createAvatar(contributor, index, 'left', spacing, depth, haveGithub);
        });
        
        // 渲染右侧头像(向左后方排列)
        rightGroup.forEach((contributor, index) => {
            createAvatar(contributor, index, 'right', spacing, depth, haveGithub);
        });

        // 添加窗口大小变化监听（使用防抖优化性能）
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                container.innerHTML = '';
                renderFadingContributors(contributors, haveGithub);
            }, 100); // 100毫秒延迟
        });
    }
    
    function createAvatar(contributor, index, side, spacing, depth, haveGithub) {
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
