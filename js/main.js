/* Main App Logic */

const canvas = document.getElementById('canvas-layer');
const ctx = canvas.getContext('2d');
const atmosphere = document.getElementById('atmosphere');
const signalPath = document.getElementById('signal-path');
const outputDiv = document.getElementById('text-output');
const hintText = document.getElementById('hint-text');

let currentMood = 'default';
let skipTrigger = null; // 用于跳过等待
let time = 0; // Animation time

// --- 窗口调节 ---
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);


// --- 核心动画循环 ---
function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // 更新绘制所有粒子
    particles.forEach(p => {
        p.update();
        p.draw(ctx, currentMood);
    });

    // 如果处于片头动画层，更新信号
    if (document.getElementById('intro-layer').style.display !== 'none') {
        time += 0.05;
        updateSignal(signalPath, currentMood, time);
    }

    requestAnimationFrame(animate);
}

// --- 逻辑控制与状态切换 ---

function setMood(mood) {
    if (currentMood === mood) return; // 避免重复设置
    currentMood = mood;
    const body = document.body;

    // --- 1. 默认属性设定 ---
    // 默认文字颜色
    let textColor = '#D4AF37';
    // 氛围层默认是透明的，或者保持上一个颜色但透明度为0
    // 我们这里为了简单，默认设置为透明黑
    let atmosphereColor = 'rgba(0,0,0,0)';
    let atmosphereOpacity = 0;
    let canvasOpacity = 1;

    // --- 2. 根据心情覆盖属性 (只动 overlay 和文字) ---
    if (mood === 'dark' || mood === 'signal') {
        atmosphereColor = 'rgba(0,20,20,0.8)';
        atmosphereOpacity = 0.5;
    }
    else if (mood === 'ink') {
        // 水墨模式：使用 overlay 遮挡底层星空
        atmosphereColor = '#E8D0A9'; // 宣纸色如果不透明，opacity=1 就会完全盖住背景
        atmosphereOpacity = 1;
        textColor = '#111';
        canvasOpacity = 0.4;
    }
    else if (mood === 'red') {
        // 红色模式：使用 overlay 遮挡
        atmosphereColor = '#1a0505';
        atmosphereOpacity = 1; // 完全遮挡，或 0.95 透一点星空
        textColor = '#ffcccc';
    }
    else if (mood === 'gold-mist') {
        atmosphereColor = 'rgba(85, 68, 0, 0.8)';
        atmosphereOpacity = 0.6;
    }

    // --- 3. 应用样式 ---
    // 绝对不修改 body.style.background，防止闪烁
    body.style.color = textColor;

    atmosphere.style.backgroundColor = atmosphereColor;
    atmosphere.style.opacity = atmosphereOpacity;
    canvas.style.opacity = canvasOpacity;
}

// 可中断等待
function waitWithSkip(ms) {
    return new Promise(resolve => {
        let timerId = setTimeout(() => {
            skipTrigger = null;
            resolve();
        }, ms);

        skipTrigger = () => {
            clearTimeout(timerId);
            skipTrigger = null;
            resolve();
        };
    });
}

// 播放剧本
let isPlaying = false;
async function playSequence() {
    isPlaying = true;
    if (outputDiv) outputDiv.innerHTML = '';
    if (hintText) hintText.style.opacity = 1;

    for (let item of fullScript) {
        if (!isPlaying) break; // Interrupted

        setMood(item.mood);

        const p = document.createElement('div');
        p.className = 'text-line';
        p.innerHTML = item.text;
        outputDiv.appendChild(p);

        void p.offsetWidth;
        p.classList.add('active');

        // 等待 (可跳过)
        await new Promise(r => setTimeout(r, 100)); // Buffer
        await waitWithSkip(item.duration);

        p.classList.remove('active');
        p.classList.add('exit');

        await new Promise(r => setTimeout(r, 600));
        outputDiv.innerHTML = '';
    }

    // End sequence
    if (isPlaying) {
        transitionToMap();
    }
}

function transitionToMap() {
    isPlaying = false;
    if (skipTrigger) skipTrigger();

    // UI 切换
    const introLayer = document.getElementById('intro-layer');
    const mapLayer = document.getElementById('map-layer');

    // 淡出开场
    introLayer.classList.add('fade-out');

    // 恢复默认氛围
    setMood('default');

    setTimeout(() => {
        introLayer.style.display = 'none';
        mapLayer.classList.remove('hidden');

        // 强制重绘
        void mapLayer.offsetWidth;
        mapLayer.classList.remove('opacity-0');

        // 初始化地图装饰
        initFloatingGlyphs();
    }, 1000);
}


// --- 事件监听 ---

// 全局点击 (Intro Skip)
document.addEventListener('click', (e) => {
    // Skip if clicking somewhere and not the button, and skip is available
    if (!e.target.closest('#enter-map-btn') && skipTrigger) {
        skipTrigger();
    }
});

// 进入地图按钮
const btn = document.getElementById('enter-map-btn');
if (btn) btn.addEventListener('click', transitionToMap);

// 关卡点击
document.querySelectorAll('.level-node').forEach(node => {
    node.addEventListener('click', () => {
        // const label = node.getAttribute('data-label');
        // alert(`🚀 宇宙飞船点火，前往：${label}`);
        window.location.href = 'practice.html';
    });
});

// --- 启动初始化 ---
resize();
initParticles();
initFloatingGlyphs(); // Safe to call even if hidden
animate();
playSequence();
