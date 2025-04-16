document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const previewSection = document.getElementById('previewSection');
    const previewImage = document.getElementById('previewImage');
    const retakeBtn = document.getElementById('retakeBtn');
    const assessmentSection = document.getElementById('assessmentSection');
    const startAssessment = document.getElementById('startAssessment');
    const healthScore = document.getElementById('healthScore');
    const healthDesc = document.getElementById('healthDesc');
    const eyeHealth = document.getElementById('eyeHealth');
    const skinHealth = document.getElementById('skinHealth');
    const bodyCondition = document.getElementById('bodyCondition');
    const assessmentTime = document.getElementById('assessmentTime');
    const uploadSection = document.getElementById('uploadSection');
    const cameraSection = document.getElementById('cameraSection');
    const cameraPreview = document.getElementById('cameraPreview');
    const captureBtn = document.getElementById('captureBtn');
    const switchCameraBtn = document.getElementById('switchCamera');
    const flashBtn = document.getElementById('flashBtn');
    const methodTabs = document.querySelectorAll('.method-tab');

    // 摄像头相关变量
    let stream = null;
    let facingMode = 'environment'; // 默认使用后置摄像头
    let flashMode = 'off';

    // 上传方式切换
    methodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            methodTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.dataset.method === 'upload') {
                uploadSection.style.display = 'block';
                cameraSection.style.display = 'none';
                stopCamera();
            } else {
                uploadSection.style.display = 'none';
                cameraSection.style.display = 'block';
                startCamera();
            }
        });
    });

    // 启动摄像头
    async function startCamera() {
        try {
            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            cameraPreview.srcObject = stream;
            cameraPreview.play();
        } catch (err) {
            console.error('摄像头启动失败:', err);
            alert('无法访问摄像头，请检查权限设置。');
        }
    }

    // 停止摄像头
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            cameraPreview.srcObject = null;
        }
    }

    // 切换摄像头
    switchCameraBtn.addEventListener('click', () => {
        facingMode = facingMode === 'user' ? 'environment' : 'user';
        stopCamera();
        startCamera();
    });

    // 切换闪光灯
    flashBtn.addEventListener('click', () => {
        flashMode = flashMode === 'off' ? 'on' : 'off';
        flashBtn.style.color = flashMode === 'on' ? '#FFD700' : '#333';
    });

    // 拍照
    captureBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = cameraPreview.videoWidth;
        canvas.height = cameraPreview.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(cameraPreview, 0, 0);
        
        // 将照片转换为Blob对象
        canvas.toBlob(blob => {
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            handleImageUpload(file);
        }, 'image/jpeg', 0.95);
    });

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => {
        imageUpload.click();
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#4CAF50';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });

    // 文件选择事件
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // 处理图片上传
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewSection.style.display = 'block';
            startAssessment.disabled = false;
            
            // 如果是摄像头模式，停止摄像头
            if (cameraSection.style.display === 'block') {
                stopCamera();
            }
        };
        reader.readAsDataURL(file);
    }

    // 重新拍摄按钮
    retakeBtn.addEventListener('click', () => {
        previewSection.style.display = 'none';
        assessmentSection.style.display = 'none';
        startAssessment.disabled = true;
        imageUpload.value = '';
        
        // 如果是从摄像头拍摄的，重新启动摄像头
        if (document.querySelector('.method-tab[data-method="camera"]').classList.contains('active')) {
            startCamera();
        }
    });

    // 开始评估按钮
    startAssessment.addEventListener('click', () => {
        // 显示加载状态
        startAssessment.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 评估中...';
        startAssessment.disabled = true;

        // 模拟AI评估过程
        setTimeout(() => {
            // 显示评估结果
            assessmentSection.style.display = 'block';
            
            // 设置评估时间
            const now = new Date();
            assessmentTime.textContent = now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            // 模拟评估结果
            const score = Math.floor(Math.random() * 30) + 70; // 70-100之间的随机分数
            healthScore.style.width = `${score}%`;
            
            // 根据分数设置健康描述
            if (score >= 90) {
                healthDesc.textContent = '宠物非常健康，继续保持良好的照顾！';
            } else if (score >= 80) {
                healthDesc.textContent = '宠物健康状况良好，但有一些小问题需要注意。';
            } else {
                healthDesc.textContent = '宠物健康需要关注，建议及时就医检查。';
            }

            // 设置其他评估结果
            eyeHealth.textContent = '眼睛明亮，无异常分泌物，视力正常。';
            skinHealth.textContent = '毛发有光泽，皮肤无异常，但需要定期梳理。';
            bodyCondition.textContent = '体型适中，建议保持当前饮食和运动习惯。';

            // 恢复按钮状态
            startAssessment.innerHTML = '<i class="fas fa-play"></i> 开始评估';
            startAssessment.disabled = false;
        }, 2000);
    });

    // 分享按钮点击事件
    document.querySelector('.share-btn').addEventListener('click', () => {
        // 这里可以添加分享功能
        alert('分享功能即将上线！');
    });

    // 保存按钮点击事件
    document.querySelector('.save-btn').addEventListener('click', () => {
        // 这里可以添加保存报告功能
        alert('报告已保存！');
    });

    // 页面卸载时停止摄像头
    window.addEventListener('beforeunload', () => {
        stopCamera();
    });
}); 