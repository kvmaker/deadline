// 生命倒计时配置
const BIRTH_DATE = new Date(1987, 2, 9); // 1987年3月9日 (月份从0开始)
const LIFE_EXPECTANCY_YEARS = 100;
const TOTAL_MONTHS = LIFE_EXPECTANCY_YEARS * 12;

// 计算时间相关数据
function calculateTimeData() {
    const now = new Date();
    const birthTime = BIRTH_DATE.getTime();
    const currentTime = now.getTime();
    const endDate = new Date(BIRTH_DATE);
    endDate.setFullYear(BIRTH_DATE.getFullYear() + LIFE_EXPECTANCY_YEARS);
    
    // 计算已经过去的完整月份
    let passedMonths = 0;
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const birthYear = BIRTH_DATE.getFullYear();
    const birthMonth = BIRTH_DATE.getMonth();
    
    passedMonths = (currentYear - birthYear) * 12 + (currentMonth - birthMonth);
    
    // 计算当前年龄
    let age = currentYear - birthYear;
    if (currentMonth < birthMonth || (currentMonth === birthMonth && now.getDate() < BIRTH_DATE.getDate())) {
        age--;
    }
    
    // 计算当前月份已过去的天数比例
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    const daysInCurrentMonth = (nextMonth - currentMonthStart) / (1000 * 60 * 60 * 24);
    const daysPassed = now.getDate() - 1;
    const currentMonthProgress = daysPassed / daysInCurrentMonth;
    
    return {
        passedMonths,
        remainingMonths: TOTAL_MONTHS - passedMonths,
        currentAge: age,
        currentMonthProgress,
        daysInCurrentMonth,
        daysPassed: daysPassed + 1
    };
}

// 生成生命网格
function generateLifeGrid() {
    const gridContainer = document.getElementById('lifeGrid');
    const timeData = calculateTimeData();
    
    gridContainer.innerHTML = '';
    
    // 生成每个月的格子
    for (let i = 0; i < TOTAL_MONTHS; i++) {
        const cell = document.createElement('div');
        cell.className = 'month-cell';
        
        // 计算该月份对应的日期
        const monthDate = new Date(BIRTH_DATE);
        monthDate.setMonth(monthDate.getMonth() + i);
        const year = Math.floor(i / 12);
        const month = i % 12 + 1;
        
        // 判断状态
        if (i < timeData.passedMonths) {
            cell.classList.add('passed');
        } else if (i === timeData.passedMonths) {
            cell.classList.add('current');
            
            // 根据当前月份已过去的天数，调整格子的透明度和大小
            const progress = timeData.currentMonthProgress; // 0 到 1，表示月份进度
            const opacity = 1 - (progress * 0.7); // 从1逐渐减少到0.3
            const scale = 1 - (progress * 0.5); // 从1逐渐缩小到0.5
            
            cell.style.opacity = opacity;
            cell.style.transform = `scale(${scale})`;
            cell.style.setProperty('--progress', progress);
        } else {
            cell.classList.add('future');
        }
        
        gridContainer.appendChild(cell);
    }
    
    // 更新统计数据
    updateStats(timeData);
}

// 更新统计数据
function updateStats(timeData) {
    const passedEl = document.getElementById('passedMonths');
    const remainingEl = document.getElementById('remainingMonths');
    const ageEl = document.getElementById('currentAge');
    if (passedEl) passedEl.textContent = timeData.passedMonths;
    if (remainingEl) remainingEl.textContent = timeData.remainingMonths;
    if (ageEl) ageEl.textContent = timeData.currentAge;
}

// 实时更新当前月份进度
function updateCurrentMonthProgress() {
    const timeData = calculateTimeData();
    const currentCell = document.querySelector('.month-cell.current');
    
    if (currentCell) {
        const progress = timeData.currentMonthProgress;
        const opacity = 1 - (progress * 0.7);
        const scale = 1 - (progress * 0.5);
        
        currentCell.style.opacity = opacity;
        currentCell.style.transform = `scale(${scale})`;
    }
}

// 水母动画 - 基于C++代码移植（性能优化版）
const JellyfishAnimation = {
    canvas: null,
    ctx: null,
    t: 0,
    N: 10000,
    // 使用 TypedArray 提升性能
    i_vec: null,
    y_vec: null,
    x_vec: null,
    e_vec: null,
    // 预计算的屏幕坐标缓冲
    screenCoords: null,
    animationId: null,
    lastTime: 0,
    
    // 位异或运算
    bitxor(a, b) {
        return a ^ b;
    },
    
    // 初始化
    init() {
        const container = document.getElementById('jellyfishContainer');
        if (!container) return;
        
        // 创建canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        
        // 使用 TypedArray 提升性能
        this.i_vec = new Float32Array(this.N);
        this.y_vec = new Float32Array(this.N);
        this.x_vec = new Float32Array(this.N);
        this.e_vec = new Float32Array(this.N);
        this.screenCoords = new Float32Array(this.N * 2);
        
        // 预计算数据
        for (let idx = 0; idx < this.N; idx++) {
            this.i_vec[idx] = idx + 1;
            this.y_vec[idx] = this.i_vec[idx] / 345.0;
            this.x_vec[idx] = this.y_vec[idx];
            
            if (this.y_vec[idx] < 11) {
                this.x_vec[idx] = 6 + Math.sin(this.bitxor(Math.floor(this.x_vec[idx]), 8)) * 6;
            } else {
                this.x_vec[idx] = this.x_vec[idx] / 5 + Math.cos(this.x_vec[idx] / 2);
            }
            
            this.e_vec[idx] = this.y_vec[idx] / 7 - 13;
        }
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
        
        // 开始动画
        this.lastTime = performance.now();
        this.animate();
    },
    
    // 动画循环
    animate(currentTime) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const scale = Math.min(width, height) / 400;
        const offsetX = width / 2 - 200 * scale;
        const offsetY = height / 2 - 200 * scale;
        
        // 清除画布 - 使用更低的透明度实现拖尾效果
        this.ctx.fillStyle = 'rgba(0, 5, 16, 0.12)';
        this.ctx.fillRect(0, 0, width, height);
        
        // 获取 ImageData 进行批量像素操作
        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // 绘制所有点
        const t = this.t;
        const t4 = t / 4;
        const t2 = t / 2;
        const t4x = t * 4;
        
        for (let idx = 0; idx < this.N; idx++) {
            const i_val = this.i_vec[idx];
            const x_val = this.x_vec[idx];
            const y_val = this.y_vec[idx];
            const e_val = this.e_vec[idx];
            
            const k = x_val * Math.cos(i_val - t4);
            const kk = k * k;
            const ee = e_val * e_val;
            const d = Math.sqrt(kk + ee) + Math.sin(e_val / 4 + t) * 0.5;
            const q = y_val * k / d * (3 + Math.sin(d * 2 + y_val * 0.5 - t4x));
            const c = d * 0.5 + 1 - t2;
            
            // 计算屏幕坐标
            let screenX = (q + 60 * Math.cos(c) + 200) * scale + offsetX;
            let screenY = (400 - (q * Math.sin(c) + d * 29 - 170)) * scale + offsetY;
            
            // 边界检查
            const px = Math.floor(screenX);
            const py = Math.floor(screenY);
            
            if (px >= 0 && px < width && py >= 0 && py < height) {
                const pixelIndex = (py * width + px) * 4;
                // 根据深度计算颜色
                const brightness = Math.min(255, 150 + d * 10);
                data[pixelIndex] = brightness;         // R
                data[pixelIndex + 1] = Math.min(255, brightness + 50); // G
                data[pixelIndex + 2] = 255;            // B
                data[pixelIndex + 3] = 255;            // A
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        
        this.t += Math.PI / 120;
        
        this.animationId = requestAnimationFrame((t) => this.animate(t));
    },
    
    // 停止动画
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
};

// 生成水母
function generateJellyfish() {
    JellyfishAnimation.init();
}

// 生成气泡
function generateBubbles() {
    const container = document.getElementById('bubbles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = Math.random() * 8 + 3;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.bottom = `${Math.random() * 20}%`;
        bubble.style.setProperty('--duration', `${Math.random() * 10 + 8}s`);
        bubble.style.setProperty('--delay', `${Math.random() * 15}s`);
        container.appendChild(bubble);
    }
}

// 初始化
window.addEventListener('load', () => {
    generateJellyfish();
    generateBubbles();
    generateLifeGrid();
    
    // 每分钟更新一次进度
    setInterval(updateCurrentMonthProgress, 60000);
    
    // 每天0点重新生成网格
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    const timeUntilMidnight = tomorrow - now;
    
    setTimeout(() => {
        generateLifeGrid();
        setInterval(generateLifeGrid, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
});
