const canvas = document.getElementById('canvas-layer');
const ctx = canvas.getContext('2d');
const atmosphere = document.getElementById('atmosphere');

let width, height;
let particles = [];
let currentMood = 'default';

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);

// --- 1. 粒子系统 (稀疏光点汇聚) ---
class Particle {
    constructor() {
        this.reset(true);
    }

    reset(isInitial = false) {
        this.z = Math.random();
        // 速度稍慢，营造静谧感
        this.speed = (this.z * 0.3) + 0.1;

        const angle = Math.random() * Math.PI * 2;
        // 分布范围足够大
        const maxR = Math.max(width, height) * 0.8;

        // 初始均匀分布，后续从边缘生成
        const r = isInitial ? Math.random() * maxR : maxR;

        this.x = width / 2 + Math.cos(angle) * r;
        this.y = height / 2 + Math.sin(angle) * r;

        // 尺寸略有变化，看起来像光斑
        this.size = (this.z * 2.5) + 1.0;

        // 透明度
        this.baseOpacity = (this.z * 0.5) + 0.2;
        this.opacity = this.baseOpacity;
    }

    update() {
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        // 到达中心附近重置
        if (dist < 10) { this.reset(); return; }

        // 向中心移动 (汇聚效果)
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        // 接近中心时淡出，避免中心有一坨亮点
        if (dist < 100) {
            this.opacity = this.baseOpacity * (dist / 100);
        }
    }

    draw() {
        // 使用 lighter 混合模式让光点叠加时更亮
        ctx.globalCompositeOperation = 'lighter';
        // 金色光点
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 恢复默认混合模式
        ctx.globalCompositeOperation = 'source-over';
    }
}

function initParticles() {
    particles = [];
    // 数量控制：150个点，稀疏但有存在感
    for (let i = 0; i < 150; i++) particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

// --- 3. 漂浮装饰 (阿拉伯风情) ---
function initFloatingGlyphs() {
    const container = document.getElementById('floating-glyphs');
    const glyphs = ['★', '✦', '✧', '☪', '☾', '☀', '◈', '◊'];

    const count = 12; // 略微减少，避免抢夺粒子视线

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

// 启动
resize();
initParticles();
initFloatingGlyphs();
animate();

// --- 4. 交互逻辑 ---
document.querySelectorAll('.level-node').forEach(node => {
    node.addEventListener('click', () => {
        // 移除锁定检查 logic
        const label = node.getAttribute('data-label');
        console.log(`Clicked level: ${label}`);
        alert(`🚀 宇宙飞船点火，前往：${label}`);
    });
});
