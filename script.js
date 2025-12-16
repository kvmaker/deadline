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

// 生成水母
function generateJellyfish() {
    const container = document.getElementById('jellyfishContainer');
    if (!container) return;
    
    // 水母配置 - 不同颜色和大小
    const jellyfishConfigs = [
        { 
            size: 80, x: 15, y: 60, 
            bodyColor: 'rgba(255, 100, 180, 0.6)', 
            glowColor: 'rgba(255, 150, 200, 0.8)',
            edgeColor: 'rgba(255, 80, 150, 0.4)',
            tentacleColor: 'rgba(255, 120, 180, 0.5)',
            floatDuration: 15, pulseDuration: 3
        },
        { 
            size: 120, x: 75, y: 40, 
            bodyColor: 'rgba(100, 200, 255, 0.5)', 
            glowColor: 'rgba(150, 220, 255, 0.7)',
            edgeColor: 'rgba(80, 180, 255, 0.3)',
            tentacleColor: 'rgba(100, 200, 255, 0.4)',
            floatDuration: 20, pulseDuration: 4
        },
        { 
            size: 60, x: 85, y: 75, 
            bodyColor: 'rgba(180, 100, 255, 0.6)', 
            glowColor: 'rgba(200, 150, 255, 0.8)',
            edgeColor: 'rgba(160, 80, 255, 0.4)',
            tentacleColor: 'rgba(180, 120, 255, 0.5)',
            floatDuration: 12, pulseDuration: 2.5
        },
        { 
            size: 50, x: 25, y: 25, 
            bodyColor: 'rgba(100, 255, 200, 0.5)', 
            glowColor: 'rgba(150, 255, 220, 0.7)',
            edgeColor: 'rgba(80, 255, 180, 0.3)',
            tentacleColor: 'rgba(100, 255, 200, 0.4)',
            floatDuration: 18, pulseDuration: 3.5
        },
        { 
            size: 90, x: 50, y: 70, 
            bodyColor: 'rgba(255, 200, 100, 0.5)', 
            glowColor: 'rgba(255, 220, 150, 0.7)',
            edgeColor: 'rgba(255, 180, 80, 0.3)',
            tentacleColor: 'rgba(255, 200, 100, 0.4)',
            floatDuration: 22, pulseDuration: 3
        },
        { 
            size: 40, x: 60, y: 15, 
            bodyColor: 'rgba(255, 150, 150, 0.6)', 
            glowColor: 'rgba(255, 180, 180, 0.8)',
            edgeColor: 'rgba(255, 120, 120, 0.4)',
            tentacleColor: 'rgba(255, 150, 150, 0.5)',
            floatDuration: 14, pulseDuration: 2
        }
    ];
    
    jellyfishConfigs.forEach((config, index) => {
        const jellyfish = document.createElement('div');
        jellyfish.className = 'jellyfish';
        jellyfish.style.setProperty('--size', `${config.size}px`);
        jellyfish.style.setProperty('--start-x', `${config.x}vw`);
        jellyfish.style.setProperty('--start-y', `${config.y}vh`);
        jellyfish.style.setProperty('--float-duration', `${config.floatDuration}s`);
        jellyfish.style.setProperty('--pulse-duration', `${config.pulseDuration}s`);
        jellyfish.style.setProperty('--body-color', config.bodyColor);
        jellyfish.style.setProperty('--glow-color', config.glowColor);
        jellyfish.style.setProperty('--edge-color', config.edgeColor);
        jellyfish.style.setProperty('--tentacle-color', config.tentacleColor);
        jellyfish.style.animationDelay = `${index * -3}s`;
        
        // 水母身体
        const body = document.createElement('div');
        body.className = 'jellyfish-body';
        
        // 内部纹理
        const inner = document.createElement('div');
        inner.className = 'jellyfish-inner';
        body.appendChild(inner);
        
        jellyfish.appendChild(body);
        
        // 触须容器
        const tentacles = document.createElement('div');
        tentacles.className = 'jellyfish-tentacles';
        tentacles.style.setProperty('--size', `${config.size}px`);
        
        // 生成多条触须
        const tentacleCount = 8;
        for (let i = 0; i < tentacleCount; i++) {
            const tentacle = document.createElement('div');
            tentacle.className = 'tentacle';
            if (i % 3 === 0) tentacle.classList.add('thick');
            if (i % 4 === 1) tentacle.classList.add('thin');
            
            const rotateRange = 15;
            const baseRotate = (i - tentacleCount / 2) * 3;
            tentacle.style.setProperty('--rotate-start', `${baseRotate - rotateRange / 2}deg`);
            tentacle.style.setProperty('--rotate-end', `${baseRotate + rotateRange / 2}deg`);
            tentacle.style.setProperty('--wave-duration', `${2 + Math.random()}s`);
            tentacle.style.setProperty('--delay', `${i * 0.1}s`);
            
            tentacles.appendChild(tentacle);
        }
        
        jellyfish.appendChild(tentacles);
        container.appendChild(jellyfish);
    });
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
