document.addEventListener('DOMContentLoaded', function() {
    // 初始化时间显示
    updateTime();
    setInterval(updateTime, 60000);

    // 获取DOM元素
    const filterTabs = document.querySelectorAll('.filter-tab');
    const petCards = document.querySelectorAll('.pet-card');
    const modal = document.getElementById('petDetailModal');
    const closeModalButton = document.querySelector('.close-modal');
    const guideMoreButton = document.querySelector('.guide-more-btn');

    // 筛选功能
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有tab的active类
            filterTabs.forEach(t => t.classList.remove('active'));
            // 添加当前tab的active类
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // 根据筛选条件显示宠物卡片
            petCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-type') === filter) {
                    card.style.display = 'block';
                    // 添加淡入动画
                    card.style.opacity = 0;
                    setTimeout(() => {
                        card.style.opacity = 1;
                        card.style.transition = 'opacity 0.3s ease';
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 宠物卡片点击事件
    petCards.forEach(card => {
        card.addEventListener('click', function() {
            showPetDetail(this);
        });
    });

    // 关闭弹窗
    closeModalButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // 点击弹窗外部关闭弹窗
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 领养说明查看更多
    if (guideMoreButton) {
        guideMoreButton.addEventListener('click', function() {
            alert('领养须知：\n\n1. 年满18岁，有稳定工作和收入。\n2. 拥有固定住所，允许养宠物。\n3. 家人同意并支持领养。\n4. 具备照顾宠物的时间和耐心。\n5. 领养前请了解宠物习性和基本护理知识。\n6. 接受领养后随访，确保宠物健康适应。\n7. 签署领养协议，承诺不虐待、不遗弃。');
        });
    }

    // 轮播图点击切换
    const sliderDots = document.querySelectorAll('.slider-dot');
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            sliderDots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            // 这里可以实现实际的轮播功能
            alert(`切换到第${index + 1}张照片`);
        });
    });

    // 申请领养和联系按钮
    const adoptionBtn = document.querySelector('.adoption-btn');
    const contactBtn = document.querySelector('.contact-btn');
    
    if (adoptionBtn) {
        adoptionBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('您的领养申请已提交，工作人员将尽快与您联系进行审核！');
        });
    }
    
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('联系电话：133-1234-5678\n工作时间：09:00-18:00');
        });
    }
});

// 更新时间函数
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.querySelector('.time').textContent = `${hours}:${minutes}`;
}

// 显示宠物详情弹窗
function showPetDetail(card) {
    const modal = document.getElementById('petDetailModal');
    const petName = card.querySelector('h3').textContent;
    const petBreed = card.querySelector('.pet-breed').textContent;
    const petAge = card.querySelector('.pet-age').textContent;
    const petGender = card.querySelector('.gender').classList.contains('male') ? '公' : '母';
    const petLocation = card.querySelector('.pet-location span').textContent;
    const petImage = card.querySelector('img').src;
    
    // 填充详情信息
    document.getElementById('petDetailName').textContent = petName;
    document.getElementById('petDetailGender').textContent = petGender;
    document.getElementById('petDetailBreed').textContent = petBreed;
    document.getElementById('petDetailAge').textContent = petAge;
    document.getElementById('petDetailImage').src = petImage;
    document.getElementById('petDetailLocation').textContent = petLocation;
    
    // 模拟一些随机信息
    document.getElementById('petDetailHealth').textContent = generateRandomHealth();
    document.getElementById('petDetailCharacter').textContent = generateRandomCharacter();
    document.getElementById('petDetailRequirements').textContent = generateRandomRequirements();
    document.getElementById('petDetailContact').textContent = generateRandomContact();
    
    // 显示弹窗
    modal.style.display = 'block';
}

// 生成随机健康状况
function generateRandomHealth() {
    const healthOptions = [
        '已绝育，已注射疫苗，体检健康',
        '已注射疫苗，最近体检一切正常',
        '身体健康，已驱虫，定期体检',
        '略微体弱，需要特别照顾，已接种疫苗',
        '健康状况良好，定期接受兽医检查'
    ];
    return healthOptions[Math.floor(Math.random() * healthOptions.length)];
}

// 生成随机性格特点
function generateRandomCharacter() {
    const characterOptions = [
        '温顺亲人，喜欢安静，适合家庭饲养',
        '活泼好动，喜欢玩耍，需要有足够活动空间',
        '性格独立，但很黏人，喜欢被抚摸',
        '胆小怕生，需要耐心呵护，但很忠诚',
        '聪明机灵，容易训练，适合有饲养经验的家庭'
    ];
    return characterOptions[Math.floor(Math.random() * characterOptions.length)];
}

// 生成随机领养要求
function generateRandomRequirements() {
    const requirementOptions = [
        '需要有养宠经验，能提供稳定的生活环境',
        '接受领养前家访，并签署不弃养协议',
        '有足够的时间陪伴，不经常出差',
        '居住环境需要有一定活动空间，接受后续回访',
        '能承担宠物的医疗费用，定期体检和疫苗'
    ];
    return requirementOptions[Math.floor(Math.random() * requirementOptions.length)];
}

// 生成随机联系方式
function generateRandomContact() {
    const contactOptions = [
        '李阿姨：133-1234-5678',
        '张先生：155-6789-0123',
        '王医生：177-8901-2345',
        '志愿者小陈：188-2345-6789',
        '救助站前台：010-12345678'
    ];
    return contactOptions[Math.floor(Math.random() * contactOptions.length)];
} 