/**
 * NovaFlare Engine - Particle Controls
 * 控制面板交互脚本，用于调整粒子系统参数
 */

document.addEventListener('DOMContentLoaded', function() {
    // 获取控制面板元素
    const controlPanel = document.getElementById('particle-controls');
    const toggleBtn = document.getElementById('toggle-controls');
    
    // 初始化控制面板状态
    let isPanelExpanded = false;
    
    // 控制面板展开/折叠
    toggleBtn.addEventListener('click', function() {
        isPanelExpanded = !isPanelExpanded;
        if (isPanelExpanded) {
            controlPanel.classList.add('expanded');
            toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            controlPanel.classList.remove('expanded');
            toggleBtn.innerHTML = '<i class="fas fa-cog"></i>';
        }
    });
    
    // 获取所有控制元素
    const particleCountSlider = document.getElementById('particle-count');
    const particleCountValue = document.getElementById('particle-count-value');
    
    const particleSizeSlider = document.getElementById('particle-size');
    const particleSizeValue = document.getElementById('particle-size-value');
    
    const flowIntensitySlider = document.getElementById('flow-intensity');
    const flowIntensityValue = document.getElementById('flow-intensity-value');
    
    const energyStrengthSlider = document.getElementById('energy-strength');
    const energyStrengthValue = document.getElementById('energy-strength-value');
    
    const showConnectionsToggle = document.getElementById('show-connections');
    const showEnergyFieldsToggle = document.getElementById('show-energy-fields');
    const showDebugToggle = document.getElementById('show-debug');
    
    const pauseResumeBtn = document.getElementById('pause-resume');
    const resetDefaultsBtn = document.getElementById('reset-defaults');
    
    // 存储默认值
    const defaultSettings = {
        particleCount: 180,
        particleSize: 1.2,
        flowFieldIntensity: 0.15,
        energyFieldStrength: 0.15,
        showConnections: true,
        showEnergyFields: true,
        showDebugInfo: false
    };
    
    // 暂停/恢复状态
    let isPaused = false;
    
    // 更新引擎参数的函数
    function updateEngineParam(param, value) {
        if (window.novaFlareEngine) {
            window.novaFlareEngine.setOption(param, value);
            return true;
        }
        return false;
    }
    
    // 初始化控制面板值
    function initControlValues() {
        if (window.novaFlareEngine) {
            // 获取当前引擎设置
            const options = window.novaFlareEngine.options;
            
            // 设置滑块初始值
            particleCountSlider.value = options.particleCount;
            particleCountValue.textContent = options.particleCount;
            
            particleSizeSlider.value = options.particleSize;
            particleSizeValue.textContent = options.particleSize;
            
            flowIntensitySlider.value = options.flowFieldIntensity;
            flowIntensityValue.textContent = options.flowFieldIntensity;
            
            energyStrengthSlider.value = options.energyFieldStrength;
            energyStrengthValue.textContent = options.energyFieldStrength;
            
            // 设置开关初始状态
            showConnectionsToggle.checked = options.showConnections;
            showEnergyFieldsToggle.checked = options.showEnergyFields;
            showDebugToggle.checked = options.showDebugInfo;
        }
    }
    
    // 添加事件监听器
    
    // 粒子数量滑块
    particleCountSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        particleCountValue.textContent = value;
        updateEngineParam('particleCount', value);
    });
    
    // 粒子大小滑块
    particleSizeSlider.addEventListener('input', function() {
        const value = parseFloat(this.value);
        particleSizeValue.textContent = value;
        updateEngineParam('particleSize', value);
    });
    
    // 流场强度滑块
    flowIntensitySlider.addEventListener('input', function() {
        const value = parseFloat(this.value);
        flowIntensityValue.textContent = value;
        updateEngineParam('flowFieldIntensity', value);
    });
    
    // 能量场强度滑块
    energyStrengthSlider.addEventListener('input', function() {
        const value = parseFloat(this.value);
        energyStrengthValue.textContent = value;
        updateEngineParam('energyFieldStrength', value);
    });
    
    // 连接线开关
    showConnectionsToggle.addEventListener('change', function() {
        updateEngineParam('showConnections', this.checked);
    });
    
    // 能量场开关
    showEnergyFieldsToggle.addEventListener('change', function() {
        updateEngineParam('showEnergyFields', this.checked);
    });
    
    // 调试信息开关
    showDebugToggle.addEventListener('change', function() {
        updateEngineParam('showDebugInfo', this.checked);
    });
    
    // 暂停/恢复按钮
    pauseResumeBtn.addEventListener('click', function() {
        if (window.novaFlareEngine) {
            if (isPaused) {
                window.novaFlareEngine.resume();
                this.textContent = 'Pause';
            } else {
                window.novaFlareEngine.pause();
                this.textContent = 'Resume';
            }
            isPaused = !isPaused;
        }
    });
    
    // 重置默认值按钮
    resetDefaultsBtn.addEventListener('click', function() {
        if (window.novaFlareEngine) {
            // 重置所有参数
            for (const [param, value] of Object.entries(defaultSettings)) {
                updateEngineParam(param, value);
            }
            
            // 更新控制面板UI
            particleCountSlider.value = defaultSettings.particleCount;
            particleCountValue.textContent = defaultSettings.particleCount;
            
            particleSizeSlider.value = defaultSettings.particleSize;
            particleSizeValue.textContent = defaultSettings.particleSize;
            
            flowIntensitySlider.value = defaultSettings.flowFieldIntensity;
            flowIntensityValue.textContent = defaultSettings.flowFieldIntensity;
            
            energyStrengthSlider.value = defaultSettings.energyFieldStrength;
            energyStrengthValue.textContent = defaultSettings.energyFieldStrength;
            
            showConnectionsToggle.checked = defaultSettings.showConnections;
            showEnergyFieldsToggle.checked = defaultSettings.showEnergyFields;
            showDebugToggle.checked = defaultSettings.showDebugInfo;
            
            // 如果暂停了，恢复动画
            if (isPaused) {
                window.novaFlareEngine.resume();
                pauseResumeBtn.textContent = 'Pause';
                isPaused = false;
            }
        }
    });
    
    // 初始化控制面板
    setTimeout(initControlValues, 500); // 延迟初始化，确保引擎已加载
});