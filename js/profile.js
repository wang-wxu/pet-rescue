document.addEventListener('DOMContentLoaded', function() {
    // 初始化时间显示
    updateTime();
    setInterval(updateTime, 60000);

    // 设置和通知按钮事件
    const settingsBtn = document.getElementById('settingsBtn');
    const notificationsBtn = document.getElementById('notificationsBtn');
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            alert('设置功能尚在开发中...');
        });
    }
    
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            alert('您有3条未读消息...');
        });
    }

    // 头像编辑功能
    const editAvatarBtn = document.querySelector('.edit-avatar');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', function() {
            alert('头像更换功能尚在开发中...');
        });
    }

    // 快捷功能点击事件
    const actionItems = document.querySelectorAll('.action-item');
    actionItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const actions = ['我的宠物页面', '救助历史页面', '成就徽章页面', '爱心捐赠页面'];
            alert(`正在前往${actions[index]}...`);
        });
    });

    // 查看全部按钮点击事件
    const viewAllBtns = document.querySelectorAll('.view-all');
    viewAllBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const sections = ['活动', '收藏', '救助记录', '成就徽章'];
            alert(`正在查看所有${sections[index]}...`);
        });
    });

    // 活动点赞功能
    const likeButtons = document.querySelectorAll('.action-btn .fa-heart');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (this.classList.contains('far')) { // 未点赞状态
                this.classList.remove('far');
                this.classList.add('fas');
                // 更新点赞数量
                let countElement = this.parentNode.textContent;
                let count = parseInt(countElement.match(/\d+/)[0]) + 1;
                this.parentNode.innerHTML = `<i class="fas fa-heart"></i> ${count}`;
            } else { // 已点赞状态
                this.classList.remove('fas');
                this.classList.add('far');
                // 更新点赞数量
                let countElement = this.parentNode.textContent;
                let count = parseInt(countElement.match(/\d+/)[0]) - 1;
                this.parentNode.innerHTML = `<i class="far fa-heart"></i> ${count}`;
            }
        });
    });

    // 活动评论功能
    const commentButtons = document.querySelectorAll('.action-btn .fa-comment');
    commentButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('评论功能尚在开发中...');
        });
    });

    // 活动分享功能
    const shareButtons = document.querySelectorAll('.action-btn .fa-share-alt');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('分享功能尚在开发中...');
        });
    });

    // 我的收藏点击事件
    const collectionItems = document.querySelectorAll('.collection-item');
    collectionItems.forEach(item => {
        item.addEventListener('click', function() {
            const petName = this.querySelector('h4').textContent;
            alert(`查看${petName}的详细信息...`);
        });
    });

    // 设置项点击事件
    const settingsItems = document.querySelectorAll('.settings-item');
    settingsItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const functions = [
                '邀请好友成功，获得30个爱心币奖励！',
                '正在连接客服，请稍候...',
                '宠爱回家 v1.0.0\n一个帮助流浪动物找到家的平台',
                '确定退出登录吗？'
            ];
            
            if (index === 3) { // 退出登录
                if (confirm('确定退出登录吗？')) {
                    alert('已安全退出登录');
                    // 这里可以跳转到登录页面
                    // window.location.href = "login.html";
                }
            } else {
                alert(functions[index]);
            }
        });
    });

    // 动态生成统计数据的动画效果
    animateStats();

    // 添加操作项目的悬停效果
    document.querySelectorAll('.action-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.action-icon').style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.action-icon').style.transform = 'translateY(0)';
        });
    });

    // 添加徽章项目的悬停效果
    document.querySelectorAll('.badge-item:not(.locked)').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.badge-icon').style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.badge-icon').style.transform = 'scale(1)';
        });
    });
});

// 更新时间函数
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.querySelector('.time').textContent = `${hours}:${minutes}`;
}

// 统计数据动画效果
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(statEl => {
        const finalValue = parseInt(statEl.textContent);
        let currentValue = 0;
        const duration = 1500; // 1.5秒完成动画
        const stepTime = 30; // 每30毫秒更新一次
        const steps = duration / stepTime;
        const increment = finalValue / steps;
        
        const counter = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= finalValue) {
                clearInterval(counter);
                statEl.textContent = finalValue;
            } else {
                statEl.textContent = Math.floor(currentValue);
            }
        }, stepTime);
    });
} 