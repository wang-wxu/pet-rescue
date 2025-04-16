document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const modeTabs = document.querySelectorAll('.mode-card');
    const settingPanels = document.querySelectorAll('.feeding-settings');
    const amountBtns = document.querySelectorAll('.amount-btn');
    const feedNowBtn = document.querySelector('.feed-now-btn');
    const saveSettingsBtn = document.querySelector('.save-settings-btn');
    const addScheduleBtn = document.querySelector('.add-schedule-btn');
    const addScheduleModal = document.getElementById('addScheduleModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const saveScheduleBtn = document.querySelector('.save-schedule-btn');
    const dayBtns = document.querySelectorAll('.day-btn');
    const editScheduleBtns = document.querySelectorAll('.edit-schedule');
    const amountInput = document.querySelector('.amount-input');
    
    // 初始化时间显示
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 60000); // 每分钟更新一次
    
    // 模式切换
    modeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有活动标签
            modeTabs.forEach(t => t.classList.remove('active'));
            // 添加当前活动标签
            this.classList.add('active');
            
            // 获取模式
            const mode = this.dataset.mode;
            
            // 显示对应设置面板
            settingPanels.forEach(panel => {
                if (panel.classList.contains(mode + '-settings')) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            });
        });
    });
    
    // 投喂量调整
    amountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const isDecrease = this.classList.contains('decrease');
            const amountValueEl = this.parentElement.querySelector('.amount-value');
            let amount = parseInt(amountValueEl.textContent);
            
            if (isDecrease) {
                amount = Math.max(5, amount - 5); // 最小5克
            } else {
                amount = Math.min(100, amount + 5); // 最大100克
            }
            
            amountValueEl.textContent = amount;
        });
    });
    
    // 立即投喂
    feedNowBtn.addEventListener('click', function() {
        const amount = document.querySelector('.manual-settings .amount-value').textContent;
        const foodType = document.querySelector('.manual-settings .food-select').value;
        const foodTypeText = getFoodTypeText(foodType);
        
        // 模拟投喂过程
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 投喂中...';
        
        setTimeout(() => {
            // 添加新的投喂记录
            addFeedingHistory('手动投喂', `${amount}克${foodTypeText}`);
            
            // 更新设备状态
            updateDeviceStatus();
            
            // 重置按钮
            this.disabled = false;
            this.innerHTML = '<i class="fas fa-play"></i> 立即投喂';
            
            // 显示成功消息
            showToast('投喂成功！');
        }, 2000);
    });
    
    // 保存自动投喂设置
    saveSettingsBtn.addEventListener('click', function() {
        const smartDetect = document.getElementById('smartDetect').checked;
        const maxAmount = document.querySelector('.auto-settings .amount-value').textContent;
        const maxTimes = document.querySelector('.auto-settings .amount-value:last-of-type').textContent;
        
        // 模拟保存过程
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
        
        setTimeout(() => {
            // 重置按钮
            this.disabled = false;
            this.innerHTML = '<i class="fas fa-save"></i> 保存设置';
            
            // 显示成功消息
            showToast('设置已保存！');
        }, 1000);
    });
    
    // 添加定时投喂
    addScheduleBtn.addEventListener('click', function() {
        // 重置表单
        document.querySelector('.time-input').value = '08:00';
        amountInput.value = 30;
        document.querySelector('#addScheduleModal .food-select').value = 'dry';
        dayBtns.forEach(btn => btn.classList.add('active'));
        
        // 显示弹窗
        addScheduleModal.style.display = 'block';
    });
    
    // 关闭弹窗
    closeModalBtn.addEventListener('click', function() {
        addScheduleModal.style.display = 'none';
    });
    
    // 弹窗外点击关闭
    window.addEventListener('click', function(e) {
        if (e.target === addScheduleModal) {
            addScheduleModal.style.display = 'none';
        }
    });
    
    // 定时投喂天数选择
    dayBtns.forEach(btn => {
        btn.classList.add('active'); // 默认选中所有天
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // 修改定时投喂
    editScheduleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.schedule-item');
            const time = item.querySelector('.schedule-time span').textContent;
            const amountText = item.querySelector('.schedule-amount').textContent;
            const amount = parseInt(amountText);
            const foodType = amountText.includes('干粮') ? 'dry' : amountText.includes('湿粮') ? 'wet' : 'mixed';
            const days = item.querySelectorAll('.day');
            
            // 填充表单
            document.querySelector('.time-input').value = time;
            amountInput.value = amount;
            document.querySelector('#addScheduleModal .food-select').value = foodType;
            
            // 设置天数
            dayBtns.forEach((btn, index) => {
                if (days[index].classList.contains('active')) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // 显示弹窗
            addScheduleModal.style.display = 'block';
        });
    });
    
    // 保存定时投喂
    saveScheduleBtn.addEventListener('click', function() {
        const time = document.querySelector('.time-input').value;
        const amount = amountInput.value;
        const foodType = document.querySelector('#addScheduleModal .food-select').value;
        const foodTypeText = getFoodTypeText(foodType);
        const activeDays = Array.from(dayBtns).filter(btn => btn.classList.contains('active'));
        
        if (activeDays.length === 0) {
            showToast('请至少选择一天');
            return;
        }
        
        // 模拟保存过程
        this.disabled = true;
        this.textContent = '保存中...';
        
        setTimeout(() => {
            // 添加新的定时投喂（在实际应用中应该更新到列表）
            showToast('定时投喂已保存！');
            
            // 关闭弹窗
            addScheduleModal.style.display = 'none';
            
            // 重置按钮
            this.disabled = false;
            this.textContent = '保存';
        }, 1000);
    });
    
    // 数量调整按钮
    document.querySelector('.amount-control .decrease').addEventListener('click', function() {
        if (amountInput.value > 5) {
            amountInput.value = parseInt(amountInput.value) - 5;
        }
    });
    
    document.querySelector('.amount-control .increase').addEventListener('click', function() {
        if (amountInput.value < 100) {
            amountInput.value = parseInt(amountInput.value) + 5;
        }
    });
    
    // 辅助函数
    
    // 更新时间显示
    function updateTimeDisplay() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.querySelector('.status-bar .time').textContent = `${hours}:${minutes}`;
    }
    
    // 获取食物类型文本
    function getFoodTypeText(type) {
        switch(type) {
            case 'dry': return '干粮';
            case 'wet': return '湿粮';
            case 'mixed': return '混合粮';
            default: return '干粮';
        }
    }
    
    // 添加投喂记录
    function addFeedingHistory(title, description) {
        const historyList = document.querySelector('.history-list');
        const now = new Date();
        const timeStr = '今天 ' + now.getHours().toString().padStart(2, '0') + ':' + 
                        now.getMinutes().toString().padStart(2, '0');
        
        const iconClass = title === '手动投喂' ? 'fa-utensils' : 
                         title === '定时投喂' ? 'fa-clock' : 'fa-robot';
        
        const newHistoryItem = document.createElement('div');
        newHistoryItem.className = 'history-item';
        newHistoryItem.innerHTML = `
            <div class="history-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="history-info">
                <div class="history-title">${title}</div>
                <div class="history-desc">${description}</div>
                <div class="history-time">${timeStr}</div>
            </div>
            <div class="history-status success">
                <i class="fas fa-check-circle"></i>
                <span>成功</span>
            </div>
        `;
        
        // 插入到列表开头
        historyList.insertBefore(newHistoryItem, historyList.firstChild);
        
        // 如果列表项超过5个，移除最后一个
        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
    }
    
    // 更新设备状态
    function updateDeviceStatus() {
        const foodProgress = document.querySelector('.feeder-status .progress');
        const foodPercentage = document.querySelector('.feeder-status .info-value span');
        let currentWidth = parseInt(foodProgress.style.width);
        currentWidth = Math.max(5, currentWidth - 5); // 减少5%，最小5%
        
        foodProgress.style.width = currentWidth + '%';
        foodPercentage.textContent = currentWidth + '%';
        
        // 更新上次投喂时间
        const now = new Date();
        const timeStr = '今天 ' + now.getHours().toString().padStart(2, '0') + ':' + 
                        now.getMinutes().toString().padStart(2, '0');
        document.querySelector('.info-item:last-child .info-value').textContent = timeStr;
    }
    
    // 显示提示消息
    function showToast(message) {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // 显示toast
        setTimeout(() => toast.classList.add('show'), 10);
        
        // 3秒后移除
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
    
    // 添加toast样式
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 1000;
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
        }
        .toast.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}); 