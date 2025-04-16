document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const modeTabs = document.querySelectorAll('.mode-tab');
    const recentSection = document.querySelector('.recent-discoveries');
    const mapSection = document.querySelector('.map-section');
    const listSection = document.querySelector('.list-section');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const discoveryMap = document.getElementById('discoveryMap');
    const trackMap = document.getElementById('trackMap');
    const profileModal = document.getElementById('animalProfileModal');
    const trackModal = document.getElementById('trackModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // 地图实例
    let mainMap;
    let trackMapInstance;
    
    // 初始化Leaflet地图
    function initMap() {
        // 设置地图容器样式
        discoveryMap.style.height = '100%';
        
        // 初始化地图（北京中心位置）
        mainMap = L.map(discoveryMap).setView([39.9042, 116.4074], 13);
        
        // 添加OpenStreetMap图层
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(mainMap);
        
        // 添加动物标记
        addAnimalMarkers();
    }
    
    // 添加动物标记
    function addAnimalMarkers() {
        // 模拟数据
        const animals = [
            {
                id: 1,
                name: "橘猫小暖",
                location: [39.9042, 116.4074],
                status: "new",
                image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
            },
            {
                id: 2,
                name: "小白",
                location: [39.9142, 116.4174],
                status: "registered",
                image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1"
            },
            {
                id: 3,
                name: "金毛阳阳",
                location: [39.8942, 116.3974],
                status: "need_help",
                image: "https://images.unsplash.com/photo-1552053831-71594a27632d"
            }
        ];
        
        animals.forEach(animal => {
            // 创建自定义图标
            const customIcon = L.divIcon({
                className: 'custom-map-marker',
                html: `<div style="width: 40px; height: 40px; border-radius: 50%; background: url(${animal.image}) center/cover; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            
            // 创建标记并添加到地图
            const marker = L.marker(animal.location, {icon: customIcon}).addTo(mainMap);
            
            // 添加点击事件
            marker.on('click', () => {
                showAnimalProfile(animal);
            });
            
            // 添加弹出信息
            marker.bindTooltip(animal.name);
        });
    }
    
    // 显示动物档案
    function showAnimalProfile(animal) {
        const profileImage = document.getElementById('profileImage');
        const profileName = document.getElementById('profileName');
        const profileStatus = document.getElementById('profileStatus');
        const profileDiscoveryTime = document.getElementById('profileDiscoveryTime');
        const profileLastLocation = document.getElementById('profileLastLocation');
        
        // 更新档案内容
        profileImage.src = animal.image;
        profileName.textContent = animal.name;
        
        let statusText = '未知';
        if (animal.status === 'new') statusText = '新发现';
        else if (animal.status === 'registered') statusText = '已登记';
        else if (animal.status === 'need_help') statusText = '需要救助';
        
        profileStatus.textContent = statusText;
        profileDiscoveryTime.textContent = new Date().toLocaleString();
        profileLastLocation.textContent = "北京市朝阳区";
        
        // 显示弹窗
        profileModal.style.display = 'block';
    }
    
    // 显示追踪记录
    function showTrackHistory(animal) {
        // 清空之前的内容
        trackMap.innerHTML = '';
        
        // 设置轨迹地图容器样式
        trackMap.style.height = '200px';
        
        // 初始化轨迹地图
        trackMapInstance = L.map(trackMap).setView(animal.location, 14);
        
        // 添加OpenStreetMap图层
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(trackMapInstance);
        
        // 添加轨迹点
        const trackPoints = [
            { time: "10:00", location: [animal.location[0] - 0.005, animal.location[1] - 0.008] },
            { time: "12:00", location: [animal.location[0] - 0.002, animal.location[1] - 0.003] },
            { time: "14:00", location: animal.location }
        ];
        
        // 创建轨迹线
        const trackLine = L.polyline(trackPoints.map(point => point.location), {
            color: '#4CAF50',
            weight: 3
        }).addTo(trackMapInstance);
        
        // 添加轨迹点标记
        trackPoints.forEach((point, index) => {
            // 创建自定义图标
            let markerColor = index === trackPoints.length - 1 ? '#4CAF50' : '#999';
            
            const pointMarker = L.circleMarker(point.location, {
                radius: 6,
                fillColor: markerColor,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            }).addTo(trackMapInstance);
            
            // 添加弹出提示
            pointMarker.bindTooltip(point.time);
        });
        
        // 自动调整地图以包含所有轨迹点
        trackMapInstance.fitBounds(trackLine.getBounds(), {
            padding: [30, 30]
        });
        
        // 更新时间线
        const timeline = document.querySelector('.track-timeline');
        timeline.innerHTML = trackPoints.map((point, index) => `
            <div class="timeline-item">
                <div class="timeline-time">${point.time}</div>
                <div class="timeline-content">
                    在${index === 0 ? '东区公园南门' : index === 1 ? '东区公园中心' : '东区公园北门'}
                    <span class="timeline-status">${index === trackPoints.length - 1 ? '发现' : '经过'}</span>
                </div>
            </div>
        `).join('');
        
        // 显示弹窗
        trackModal.style.display = 'block';
    }
    
    // 模式切换
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 更新活动标签
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 显示对应内容
            const mode = tab.dataset.mode;
            recentSection.style.display = mode === 'recent' ? 'block' : 'none';
            mapSection.style.display = mode === 'map' ? 'block' : 'none';
            listSection.style.display = mode === 'list' ? 'block' : 'none';
            
            // 如果是地图模式，初始化地图
            if (mode === 'map' && !mainMap) {
                initMap();
            } else if (mode === 'map' && mainMap) {
                // 刷新地图大小，避免地图显示问题
                setTimeout(() => {
                    mainMap.invalidateSize();
                }, 100);
            }
        });
    });
    
    // 筛选按钮点击事件
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.textContent;
            filterAnimals(filter);
        });
    });
    
    // 筛选动物列表
    function filterAnimals(filter) {
        const listItems = document.querySelectorAll('.list-item');
        listItems.forEach(item => {
            const status = item.querySelector('p').textContent.split(' · ')[0];
            if (filter === '全部' || status === filter) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 关闭弹窗
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            profileModal.style.display = 'none';
            trackModal.style.display = 'none';
            
            // 销毁轨迹地图实例
            if (trackMapInstance) {
                trackMapInstance.remove();
                trackMapInstance = null;
            }
        });
    });
    
    // 点击弹窗外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.style.display = 'none';
        }
        if (e.target === trackModal) {
            trackModal.style.display = 'none';
            
            // 销毁轨迹地图实例
            if (trackMapInstance) {
                trackMapInstance.remove();
                trackMapInstance = null;
            }
        }
    });
    
    // 查看档案按钮点击事件
    document.querySelectorAll('.view-profile').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.discovery-card');
            const animalName = card.querySelector('h3').textContent;
            const animalImage = card.querySelector('.discovery-image img').src;
            
            // 创建动物数据
            const animal = {
                id: card.dataset.id || '1',
                name: animalName,
                image: animalImage,
                status: card.querySelector('.discovery-status').classList.contains('new') ? 'new' : 'registered'
            };
            
            showAnimalProfile(animal);
        });
    });
    
    // 查看轨迹按钮点击事件
    document.querySelectorAll('.view-track').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.discovery-card');
            const animalName = card.querySelector('h3').textContent;
            
            // 创建动物数据
            const animal = {
                id: card.dataset.id || '1',
                name: animalName,
                location: [39.9042, 116.4074] // 默认位置：北京市中心
            };
            
            showTrackHistory(animal);
        });
    });
    
    // 地图控制按钮
    document.getElementById('refreshMap').addEventListener('click', () => {
        // 刷新地图数据
        if (mainMap) {
            // 清除所有标记
            mainMap.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    mainMap.removeLayer(layer);
                }
            });
            
            // 重新添加标记
            addAnimalMarkers();
        }
    });
    
    document.getElementById('centerMap').addEventListener('click', () => {
        // 居中地图
        if (mainMap) {
            mainMap.setView([39.9042, 116.4074], 13);
        }
    });
    
    // 初始化默认显示最近发现
    document.querySelector('.mode-tab[data-mode="recent"]').click();
    
    // 给发现卡片添加ID
    document.querySelectorAll('.discovery-card').forEach((card, index) => {
        card.dataset.id = (index + 1).toString();
    });
}); 