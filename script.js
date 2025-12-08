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

// 生成星空背景
function generateStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    // 生成星星（更多层次）
    for (let i = 0; i < 300; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        if (Math.random() > 0.9) star.classList.add('bright');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 2.5 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${Math.random() * 4 + 2}s`);
        star.style.setProperty('--opacity', `${Math.random() * 0.6 + 0.2}`);
        starsContainer.appendChild(star);
    }
    
    // 生成流星（更多、更明显）
    for (let i = 0; i < 8; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.left = `${Math.random() * 60 + 10}%`;
        meteor.style.top = `${Math.random() * 40}%`;
        meteor.style.setProperty('--duration', `${Math.random() * 2 + 1.5}s`);
        meteor.style.setProperty('--delay', `${Math.random() * 15}s`);
        starsContainer.appendChild(meteor);
    }
}

// 生成星球
function generatePlanets() {
    const planetsContainer = document.getElementById('planets');
    if (!planetsContainer) return;
    
    const planetTypes = ['gas-giant', 'ice-giant', 'rocky'];
    const planetConfigs = [
        { type: 'gas-giant', size: 80, x: 85, y: 15, hasRing: true, duration: 20 },
        { type: 'ice-giant', size: 45, x: 10, y: 70, hasRing: false, duration: 25 },
        { type: 'rocky', size: 25, x: 75, y: 80, hasRing: false, duration: 18 },
        { type: 'rocky', size: 15, x: 5, y: 20, hasRing: false, duration: 22 },
    ];
    
    planetConfigs.forEach(config => {
        const planet = document.createElement('div');
        planet.className = `planet ${config.type}`;
        planet.style.width = `${config.size}px`;
        planet.style.height = `${config.size}px`;
        planet.style.left = `${config.x}%`;
        planet.style.top = `${config.y}%`;
        planet.style.setProperty('--duration', `${config.duration}s`);
        
        if (config.hasRing) {
            const ring = document.createElement('div');
            ring.className = 'planet-ring';
            ring.style.width = `${config.size * 1.8}px`;
            ring.style.height = `${config.size * 0.6}px`;
            ring.style.left = `${-config.size * 0.4}px`;
            ring.style.top = `${config.size * 0.35}px`;
            planet.appendChild(ring);
        }
        
        planetsContainer.appendChild(planet);
    });
}

// 生成星座
function generateConstellations() {
    const constellationsContainer = document.getElementById('constellations');
    if (!constellationsContainer) return;
    
    // 定义几个简单的星座图案
    const constellations = [
        // 北斗七星形状
        { 
            x: 20, y: 25, 
            stars: [[0, 0], [30, 5], [60, 0], [90, 10], [110, 30], [100, 55], [130, 70]],
            lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
        },
        // 猎户座形状
        { 
            x: 70, y: 45, 
            stars: [[20, 0], [0, 20], [40, 20], [10, 40], [30, 40], [20, 60], [20, 80]],
            lines: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [5, 6]]
        },
        // 三角形
        { 
            x: 45, y: 10, 
            stars: [[0, 30], [40, 0], [80, 30]],
            lines: [[0, 1], [1, 2], [2, 0]]
        }
    ];
    
    constellations.forEach(constellation => {
        const group = document.createElement('div');
        group.className = 'constellation';
        group.style.left = `${constellation.x}%`;
        group.style.top = `${constellation.y}%`;
        
        // 绘制连线
        constellation.lines.forEach(([from, to]) => {
            const star1 = constellation.stars[from];
            const star2 = constellation.stars[to];
            const line = document.createElement('div');
            line.className = 'constellation-line';
            
            const dx = star2[0] - star1[0];
            const dy = star2[1] - star1[1];
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            line.style.width = `${length}px`;
            line.style.left = `${star1[0]}px`;
            line.style.top = `${star1[1]}px`;
            line.style.transform = `rotate(${angle}deg)`;
            
            group.appendChild(line);
        });
        
        // 绘制星星
        constellation.stars.forEach(([x, y]) => {
            const star = document.createElement('div');
            star.className = 'constellation-star';
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;
            group.appendChild(star);
        });
        
        constellationsContainer.appendChild(group);
    });
}

// 初始化
window.addEventListener('load', () => {
    generateStars();
    generatePlanets();
    generateConstellations();
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
