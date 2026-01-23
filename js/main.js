const canvas = document.getElementById('canvas-layer');
const ctx = canvas.getContext('2d');
// Remove old UI references that no longer exist to prevent errors
// const signalPath = document.getElementById('signal-path');
// const outputDiv = document.getElementById('text-output');
// const startBtn = document.getElementById('start-btn');
const atmosphere = document.getElementById('atmosphere');

let width, height;
let particles = [];
let currentMood = 'default';

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);

// --- 1. 粒子系统 (简化版作为背景) ---
class Particle {
    constructor() {
        this.reset(true);
    }

    reset(isInitial = false) {
        this.z = Math.random();
        this.speed = (this.z * 0.2) + 0.05; // 减慢速度

        const angle = Math.random() * Math.PI * 2;
        const maxR = Math.max(width, height) * 0.7;

        const r = isInitial ? Math.random() * maxR : maxR;

        this.x = width / 2 + Math.cos(angle) * r;
        this.y = height / 2 + Math.sin(angle) * r;

        this.size = (this.z * 2.0) + 0.5;
        this.baseOpacity = (this.z * 0.4) + 0.1; // 降低透明度
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

        if (dist < 150) {
            this.opacity = this.baseOpacity * (dist / 150);
        }
    }

    draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // 统一金色
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 200; i++) particles.push(new Particle()); // 减少粒子数量
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

// --- 3. 漂浮装饰 (阿拉伯风情) ---
function initFloatingGlyphs() {
    const container = document.getElementById('floating-glyphs');
    const glyphs = ['★', '✦', '✧', '☪', '☾', '☀', '◈', '◊']; // 几何与天文符号
    // 也可以加入阿拉伯字母，如: ['ا', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح']

    const count = 15; // 装饰数量

    for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'glyph';
        span.innerText = glyphs[Math.floor(Math.random() * glyphs.length)];

        // 随机属性
        span.style.left = Math.random() * 100 + '%';
        span.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        span.style.animationDuration = (Math.random() * 10 + 10) + 's'; // 10-20s
        span.style.animationDelay = (Math.random() * -20) + 's'; // 负延迟让动画一开始就铺满

        container.appendChild(span);
    }
}

// 启动
resize();
initParticles();
initFloatingGlyphs();
animate();

// --- 4. 交互逻辑 ---
document.querySelectorAll('.level-node').forEach(node => {
    node.addEventListener('click', () => {
        if (node.classList.contains('locked')) {
            alert("🔒 该区域尚未解锁！\n请先完成某某前置任务...");
            return;
        }

        const label = node.getAttribute('data-label');
        console.log(`Clicked level: ${label}`);
        // 模拟跳转或显示详情
        alert(`🚀 准备启程前往：${label}`);
    });
});
