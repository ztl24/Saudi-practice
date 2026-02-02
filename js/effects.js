// --- 视觉特效: 粒子系统与信号波形 ---

let particles = [];
let signalIntensity = 0;

// --- 1. 粒子系统 ---
class Particle {
    constructor() {
        this.reset(true);
    }

    reset(isInitial = false) {
        // 使用全局 canvas 尺寸
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.z = Math.random();

        // Mobile Speed Adjustment: 60% slower on mobile
        const isMobile = w <= 768;
        const speedFactor = isMobile ? 0.15 : 1.0;
        // mark
        this.speed = ((this.z * 0.5) + 0.1) * speedFactor;

        const angle = Math.random() * Math.PI * 2;
        const maxR = Math.max(w, h) * 0.7;
        const r = isInitial ? Math.random() * maxR : maxR;

        // 默认位置 (圆周分布)
        this.x = w / 2 + Math.cos(angle) * r;
        this.y = h / 2 + Math.sin(angle) * r;

        this.size = (this.z * 2.5) + 0.5;
        this.baseOpacity = (this.z * 0.6) + 0.1;
        this.opacity = this.baseOpacity;
    }

    update() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const centerX = w / 2;
        const centerY = h / 2;

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

    draw(ctx, currentMood) {
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
    // Mobile Optimization: Reduce count from 350 to 120
    const isMobile = window.innerWidth <= 768;
    const count = isMobile ? 90 : 350;
    // mark
    for (let i = 0; i < count; i++) particles.push(new Particle());
}

// --- 2. 信号波形 ( Intro Only ) ---
function updateSignal(signalPath, currentMood, time) {
    if (!signalPath) return;

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

// --- 3. 漂浮装饰 ( Map Only ) ---
function initFloatingGlyphs() {
    const container = document.getElementById('floating-glyphs');
    if (!container) return;

    const glyphs = ['★', '✦', '✧', '☪', '☾', '☀', '◈', '◊'];
    container.innerHTML = ''; // Clear

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
