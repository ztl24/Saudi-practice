const canvas = document.getElementById('canvas-layer');
const ctx = canvas.getContext('2d');
const atmosphere = document.getElementById('atmosphere');
const signalPath = document.getElementById('signal-path');
const outputDiv = document.getElementById('text-output');
const hintText = document.getElementById('hint-text');
// const startBtn = document.getElementById('start-btn'); // Renamed/Moved to enter-map-btn

let width, height;
let particles = [];
let time = 0;
let signalIntensity = 0;
let currentMood = 'default';
let skipTrigger = null; // 用于跳过等待

// --- 0. 剧本数据 ---
const fullScript = [
    { text: "这里的风，有牙齿。", mood: "wind", duration: 4000 },
    { text: "传说在北纬24度的腹地，<br>风能嚼碎坚硬的花岗岩，<br>把一切文明的痕迹还原成沙砾。", mood: "wind", duration: 7000 },
    { text: "公元 2026 年，冬。", mood: "dark", duration: 4000 },
    { text: "探测器的指针在红海沿岸疯狂跳动。", mood: "signal", duration: 4000 },
    { text: "这里本该是荒漠，<br>但频谱仪却收到了一段奇怪的信号——<br>那是一串极其规律的脉冲，<br>像是某种巨大机械的心跳。", mood: "signal", duration: 8000 },
    { text: "有人说它是海市蜃楼，<br>有人说那是通往下一个纪元的源代码。", mood: "signal", duration: 6000 },
    { text: "我们将涉沙而去，<br>探索这心跳的本源和力量。", mood: "wind", duration: 5000 },

    // 水墨篇章
    { text: "我们携带了<span style='font-weight:bold; color:#000;'>纸上的烟云</span>。", mood: "ink", duration: 5000 },
    { text: "它由松木燃烧后的灰烬与水调和而成。<br>表面上看，那只是黑与白的潦草涂抹，<br>但千万别眨眼——<br>那里面栖居着东方的五岳与长河。", mood: "ink", duration: 9000 },
    { text: "在这片色彩饱和度过载的金色沙漠里，<br>我们将展开这幅只有双色的画卷。", mood: "ink", duration: 6000 },
    { text: "它不反光，<br>却能吸收所有的燥热，<br>释放出一种名为“留白”的凉意。", mood: "ink", duration: 7000 },

    // 红色契约篇章
    { text: "我们携带了<span class='highlight-red'>红色的契约</span>。", mood: "red", duration: 5000 },
    { text: "那是一种比沙漠烈日更耀眼的红，<br>是用朱砂画就的图腾。<br>它不属于现在，而属于未来。", mood: "red", duration: 7000 },
    { text: "在这个没有严冬的国度，<br>我们将贴上这些方正的符号，<br>用来召唤一个他们或许从未真正理解的季节——", mood: "red", duration: 7000 },
    { text: "<span class='highlight-red' style='font-size:2em'>“春”</span>", mood: "red", duration: 4000 },
    { text: "这不仅是祝福，<br>更是一种古老的护身符，<br>向时间许诺：下一个轮回，万物安好。", mood: "red", duration: 7000 },

    // 迷雾篇章
    { text: "至于剩下的航程？<br>哪怕是我们自己，也只握着半张残卷。", mood: "default", duration: 6000 },
    { text: "在这片被折叠的时空里，<br>指南针是会撒谎的。", mood: "dark", duration: 5000 },
    { text: "也许下一秒，我们会闯入<br>《一千零一夜》里都不曾记载的折叠空间；", mood: "default", duration: 6000 },
    { text: "也许在某个转角，我们会与某种<br>超越了“工业”与“诗歌”的第三种存在迎面相撞。", mood: "default", duration: 7000 },
    { text: "这是一场没有剧本的潜行。", mood: "default", duration: 4000 },
    { text: "我们不是走向黑暗，<br>而是走入一片<span style='color:#fff; text-shadow:0 0 10px gold;'>金色的迷雾</span>。", mood: "gold-mist", duration: 6000 },
    { text: "唯一的确定，就是不确定本身。", mood: "gold-mist", duration: 5000 },
    { text: "在这个冬天，<br>请把你的频率调至与我们同步，保持监听。", mood: "end", duration: 6000 },
    { text: "因为接下来的每一个字节，<br>都将是从“奇迹”的中心发回的、<br>绝版的现场报告。", mood: "end", duration: 8000 }
];


function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);

// --- 1. 粒子系统 (恢复为 animation.html 原版) ---
class Particle {
    constructor() {
        this.reset(true);
    }

    reset(isInitial = false) {
        this.z = Math.random();
        this.speed = (this.z * 0.5) + 0.1;

        const angle = Math.random() * Math.PI * 2;
        const maxR = Math.max(width, height) * 0.7;
        const r = isInitial ? Math.random() * maxR : maxR;

        // 默认位置 (圆周分布)
        this.x = width / 2 + Math.cos(angle) * r;
        this.y = height / 2 + Math.sin(angle) * r;

        this.size = (this.z * 2.5) + 0.5;
        this.baseOpacity = (this.z * 0.6) + 0.1;
        this.opacity = this.baseOpacity;
    }

    update() {
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 5) { this.reset(); return; }

        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        // 距离中心近时淡出
        if (dist < 150) {
            this.opacity = this.baseOpacity * (dist / 150);
        }
    }

    draw() {
        // 根据心情改变粒子颜色
        if (currentMood === 'ink') {
            ctx.fillStyle = `rgba(20, 20, 20, ${this.opacity})`; // 墨色
        } else if (currentMood === 'red') {
            ctx.fillStyle = `rgba(255, 100, 100, ${this.opacity})`; // 红色
        } else {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // 金色
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 350; i++) particles.push(new Particle());
}

// --- 2. 信号波形 ( intro only ) ---
function updateSignal() {
    if (!signalPath) return; // Map mode might remove it or hide it

    time += 0.05;
    if (currentMood === 'ink') {
        signalPath.setAttribute('stroke-opacity', 0);
        return;
    }

    if (signalIntensity > 0.1) signalIntensity -= 0.005;
    if (currentMood === 'signal') signalIntensity = 0.8;

    let path = `M 0 100 `;
    for (let x = 0; x <= 1920; x += 40) {
        let noise = (Math.sin(x * 0.01 + time) + Math.sin(x * 0.03 - time * 2)) * 20;
        let activePulse = (Math.random() - 0.5) * 150 * signalIntensity;
        let y = 100 + noise * 0.5 + activePulse;
        path += `S ${x - 20} ${y} ${x} ${y} `;
    }
    signalPath.setAttribute('d', path);

    const strokeColor = currentMood === 'red' ? 'rgba(207, 46, 46, 0.4)' : 'rgba(212, 175, 55, 0.3)';
    signalPath.setAttribute('stroke', strokeColor);
    signalPath.setAttribute('stroke-opacity', 0.2 + signalIntensity * 0.6);
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });

    if (document.getElementById('intro-layer').style.display !== 'none') {
        updateSignal();
    }

    requestAnimationFrame(animate);
}

// --- 3. 漂浮装饰 (Map Mode Only) ---
// 已经移入HTML的 #map-layer 中，这里保留初始化逻辑但默认隐藏
function initFloatingGlyphs() {
    const container = document.getElementById('floating-glyphs');
    const glyphs = ['★', '✦', '✧', '☪', '☾', '☀', '◈', '◊'];

    // 清空现有
    container.innerHTML = '';

    const count = 12;
    for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'glyph';
        span.innerText = glyphs[Math.floor(Math.random() * glyphs.length)];
        span.style.left = Math.random() * 100 + '%';
        span.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        span.style.animationDuration = (Math.random() * 15 + 15) + 's';
        span.style.animationDelay = (Math.random() * -30) + 's';
        container.appendChild(span);
    }
}


// --- 4. 逻辑控制与状态切换 ---

function setMood(mood) {
    currentMood = mood;
    const body = document.body;

    // Default Reset
    body.style.background = 'radial-gradient(circle at center, #1a1505 0%, #000000 100%)';
    body.style.color = '#D4AF37';
    atmosphere.style.opacity = 0;
    canvas.style.opacity = 1;

    if (mood === 'dark' || mood === 'signal') {
        atmosphere.style.backgroundColor = 'rgba(0,20,20,0.8)';
        atmosphere.style.opacity = 0.5;
    }
    else if (mood === 'ink') {
        body.style.background = '#f0f0f0';
        body.style.color = '#111';
        atmosphere.style.backgroundColor = '#fff';
        atmosphere.style.opacity = 0.7;
        canvas.style.opacity = 0.4;
    }
    else if (mood === 'red') {
        body.style.background = '#1a0505';
        body.style.color = '#ffcccc';
        atmosphere.style.backgroundColor = '#4a0000';
        atmosphere.style.opacity = 0.4;
    }
    else if (mood === 'gold-mist') {
        atmosphere.style.backgroundColor = 'rgba(85, 68, 0, 0.8)';
        atmosphere.style.opacity = 0.6;
    }
}

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

// 播放脚本
let isPlaying = false;
async function playSequence() {
    isPlaying = true;
    const outputDiv = document.getElementById('text-output');
    outputDiv.innerHTML = '';

    // 显示点击提示
    if (hintText) hintText.style.opacity = 1;

    for (let item of fullScript) {
        if (!isPlaying) break; // 如果被打断(进入地图)则停止

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

    // 脚本结束，自动进入地图
    if (isPlaying) {
        transitionToMap();
    }
}

function transitionToMap() {
    isPlaying = false;
    if (skipTrigger) skipTrigger(); // 结束当前等待

    // UI 切换
    const introLayer = document.getElementById('intro-layer');
    const mapLayer = document.getElementById('map-layer');

    // 淡出开场层
    introLayer.classList.add('fade-out');

    // 恢复默认氛围 (金色)
    setMood('default');

    setTimeout(() => {
        introLayer.style.display = 'none';
        mapLayer.classList.remove('hidden');

        // 强制重绘触发 transition
        void mapLayer.offsetWidth;
        mapLayer.classList.remove('opacity-0');

        // 初始化地图特有的装饰
        initFloatingGlyphs();
    }, 1000); // 等待淡出
}


// 全局点击监听 (仅在Intro层有效时)
document.addEventListener('click', (e) => {
    // 只要不是点击了 enter-map-btn，且当前有 skipTrigger，就触发跳过
    if (!e.target.closest('#enter-map-btn') && skipTrigger) {
        skipTrigger();
    }
});

// 绑定按钮
document.getElementById('enter-map-btn').addEventListener('click', transitionToMap);

// 绑定关卡点击
document.querySelectorAll('.level-node').forEach(node => {
    node.addEventListener('click', () => {
        const label = node.getAttribute('data-label');
        alert(`🚀 宇宙飞船点火，前往：${label}`);
    });
});

// 启动
resize();
initParticles();
initFloatingGlyphs(); // 虽然一开始看不见，但先初始化也没事，或者放在 enterMap 里
animate();

// 开始播放开场
playSequence();
