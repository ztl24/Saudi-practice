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

        // Toggle buttons
        const enterBtn = document.getElementById('enter-map-btn');
        const replayBtn = document.getElementById('replay-intro-btn');
        if (enterBtn) enterBtn.style.display = 'none';
        if (replayBtn) replayBtn.classList.remove('hidden');
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

// 弹窗关闭函数
function closeModal() {
    const modal = document.getElementById('link-modal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// 关卡点击 - 打开链接弹窗
document.querySelectorAll('.level-node').forEach(node => {
    node.addEventListener('click', (e) => {
        e.stopPropagation();

        const nodeId = node.id;
        const links = locationLinks[nodeId];
        const modal = document.getElementById('link-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalLinks = document.getElementById('modal-links');

        if (links && modal && modalTitle && modalLinks) {
            const label = node.getAttribute('data-label').replace('<br>', ' ');
            modalTitle.textContent = label;
            modalLinks.innerHTML = '';

            links.forEach(link => {
                const a = document.createElement('a');
                a.className = 'link-btn';
                a.textContent = link.text;

                if (link.url === '#' || !link.url) {
                    // 如果是空链接，点击直接关闭弹窗返回地图
                    a.href = 'javascript:void(0)';
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        closeModal();
                    });
                } else {
                    a.href = link.url;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                }
                modalLinks.appendChild(a);
            });

            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        }
    });
});

// 弹窗关闭逻辑
const modal = document.getElementById('link-modal');
const closeBtn = document.querySelector('.close-modal');

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

// 点击遮罩层关闭
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// --- 启动初始化 ---
// --- Replay Logic ---
function replayIntro() {
    // Hide map, show intro
    const introLayer = document.getElementById('intro-layer');
    const mapLayer = document.getElementById('map-layer');
    const replayBtn = document.getElementById('replay-intro-btn');
    const enterBtn = document.getElementById('enter-map-btn');

    introLayer.style.display = 'block';
    introLayer.classList.remove('fade-out');

    mapLayer.classList.add('hidden');
    mapLayer.classList.add('opacity-0');

    if (replayBtn) replayBtn.classList.add('hidden');
    if (enterBtn) enterBtn.style.display = 'block'; // Ensure enter button is back

    // Reset state
    currentMood = 'default';
    time = 0;

    // Start sequence
    playSequence();
}

// Replay Button Event
const replayBtn = document.getElementById('replay-intro-btn');
if (replayBtn) replayBtn.addEventListener('click', replayIntro);


// --- 启动初始化 ---
resize();
initParticles();
initFloatingGlyphs(); // Safe to call even if hidden
animate();

// Check for skipIntro param
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('skipIntro') === 'true') {
    // Skip intro, directly show map
    const introLayer = document.getElementById('intro-layer');
    const mapLayer = document.getElementById('map-layer');
    const enterBtn = document.getElementById('enter-map-btn');
    const replayBtn = document.getElementById('replay-intro-btn');

    introLayer.style.display = 'none';
    mapLayer.classList.remove('hidden');
    mapLayer.classList.remove('opacity-0');

    if (enterBtn) enterBtn.style.display = 'none';
    if (replayBtn) replayBtn.classList.remove('hidden');

    initFloatingGlyphs();
} else {
    // Normal start
    playSequence();
}
