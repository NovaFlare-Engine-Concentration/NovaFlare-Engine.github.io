// 贡献者数据获取和渲染
document.addEventListener('DOMContentLoaded', function() {
    const contributorsContainer = document.getElementById('contributors-container');
    if (!contributorsContainer) return;

    // 从API获取贡献者数据
    fetch('https://api.github.com/repos/NovaFlare-Engine/NovaFlare-Engine/contributors')
        .then(response => response.json())
        .then(contributors => {
            // 过滤掉主开发者(Beihu235)
            const otherContributors = contributors.filter(c => c.login.toLowerCase() !== 'beihu235');
            
            // 按贡献数量排序
            otherContributors.sort((a, b) => b.contributions - a.contributions);
            
            // 渲染贡献者头像
            renderContributors(otherContributors);
        })
        .catch(error => {
            console.error('Error fetching contributors:', error);
            contributorsContainer.innerHTML = '<p class="error-message">无法加载贡献者数据</p>';
        });

    function renderContributors(contributors) {
        // 计算每个头像的偏移距离
        const baseDistance = 100;
        
        contributors.forEach((contributor, index) => {
            const avatar = document.createElement('img');
            avatar.src = contributor.avatar_url;
            avatar.alt = contributor.login;
            avatar.className = 'contributor-avatar';
            avatar.title = `${contributor.login} (${contributor.contributions} contributions)`;
            
            // 设置CSS变量控制偏移距离
            // 距离随索引增加而增大，形成向两侧分散的效果
            const distance = baseDistance + (Math.floor(index/2) * 40);
            avatar.style.setProperty('--distance', distance);
            
            // 添加GitHub链接
            const link = document.createElement('a');
            link.href = contributor.html_url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.appendChild(avatar);
            
            contributorsContainer.appendChild(link);
        });
    }
});