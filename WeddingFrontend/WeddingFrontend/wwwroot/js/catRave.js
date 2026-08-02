// ============================================================
// Meepo Rave — kaleidoscope orbit + RGB glitch + confetti + beat
// ============================================================

function cleanupRaveState() {
    const state = window._catRaveState;
    if (state) {
        if (state.rafId) cancelAnimationFrame(state.rafId);
        state.timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
        if (state.audioCtx) {
            try { state.audioCtx.close(); } catch (e) { /* no-op */ }
        }
    }
    window._raveAudioContext = null;
    window._catRaveState = null;
}

window.startCatRave = function (imagePath) {
    // If one is already running, tear it down instantly before starting a new one
    const existingOverlay = document.getElementById('cat-rave-overlay');
    if (existingOverlay) {
        cleanupRaveState();
        existingOverlay.remove();
    }

    const state = { timers: [], rafId: null, audioCtx: null };
    window._catRaveState = state;

    // ---------------- Overlay ----------------
    const raveOverlay = document.createElement('div');
    raveOverlay.id = 'cat-rave-overlay';
    raveOverlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.15);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        pointer-events: auto;
        cursor: pointer;
    `;

    const canvas = document.createElement('canvas');
    canvas.id = 'cat-rave-canvas';
    canvas.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
    `;

    // ---------------- Kaleidoscope ring ----------------
    const kaleido = document.createElement('div');
    kaleido.style.cssText = `
        position: relative;
        width: 620px; height: 620px;
        max-width: 92vw; max-height: 92vw;
        display: flex; align-items: center; justify-content: center;
        z-index: 5;
        pointer-events: none;
    `;

    const ORBIT_COUNT = 8;
    for (let i = 0; i < ORBIT_COUNT; i++) {
        const duration = 6 + (i % 3) * 2;
        const delay = -(duration * i / ORBIT_COUNT);
        const dir = i % 2 === 0 ? 'normal' : 'reverse';

        const orbit = document.createElement('div');
        orbit.style.cssText = `
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex; align-items: flex-start; justify-content: center;
            animation: catOrbit ${duration}s linear infinite;
            animation-delay: ${delay}s;
            animation-direction: ${dir};
            opacity: 0.55;
        `;

        const img = document.createElement('img');
        img.src = imagePath;
        img.style.cssText = `
            width: 90px; height: 90px;
            object-fit: cover;
            border-radius: 12px;
            filter: hue-rotate(${i * 45}deg) saturate(2) brightness(1.2);
            mix-blend-mode: screen;
            box-shadow: 0 0 25px rgba(255, 0, 255, 0.8);
        `;
        orbit.appendChild(img);
        kaleido.appendChild(orbit);
    }

    // ---------------- Hero image w/ RGB-split glitch ----------------
    const heroWrap = document.createElement('div');
    heroWrap.style.cssText = `
        position: relative;
        z-index: 10;
        display: flex; align-items: center; justify-content: center;
        pointer-events: none;
        animation: catEnter 0.4s ease-out, catPulse 0.6s ease-in-out 0.4s infinite alternate;
    `;

    const channels = [
        { filter: 'hue-rotate(0deg)', blend: 'normal', dx: 0, dy: 0, opacity: 1, glow: true },
        { filter: 'hue-rotate(120deg) saturate(3)', blend: 'screen', dx: -4, dy: 2, opacity: 0.55, glow: false },
        { filter: 'hue-rotate(240deg) saturate(3)', blend: 'screen', dx: 4, dy: -2, opacity: 0.55, glow: false },
    ];

    channels.forEach((ch, idx) => {
        const img = document.createElement('img');
        img.src = imagePath;
        if (idx > 0) img.className = 'cat-rave-channel';
        img.style.cssText = `
            position: ${idx === 0 ? 'relative' : 'absolute'};
            top: 0; left: 0;
            max-width: 420px; max-height: 420px;
            width: 78vw; height: auto;
            border-radius: 24px;
            transform: translate(${ch.dx}px, ${ch.dy}px);
            filter: ${ch.filter} brightness(1.1);
            mix-blend-mode: ${ch.blend};
            opacity: ${ch.opacity};
            box-shadow: ${ch.glow ? '0 0 80px rgba(255,0,255,0.85), 0 0 130px rgba(0,255,255,0.6)' : 'none'};
        `;
        heroWrap.appendChild(img);
    });

    // Jitter the glitch channels for a flickery RGB-split look
    const glitchInterval = setInterval(() => {
        heroWrap.querySelectorAll('.cat-rave-channel').forEach((el) => {
            const jx = (Math.random() - 0.5) * 14;
            const jy = (Math.random() - 0.5) * 14;
            el.style.transform = `translate(${jx}px, ${jy}px)`;
        });
    }, 140);
    state.timers.push(glitchInterval);

    // ---------------- Neon flicker text ----------------
    const neonText = document.createElement('div');
    neonText.textContent = 'MEEPO RAVE';
    neonText.style.cssText = `
        position: absolute;
        top: 8%; left: 50%;
        transform: translateX(-50%);
        font-family: 'Comic Sans MS', 'Segoe UI', sans-serif;
        font-weight: 900;
        font-size: clamp(24px, 5vw, 48px);
        letter-spacing: 2px;
        color: #fff;
        text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #00ffff, 0 0 80px #00ffff;
        animation: catTextFlicker 1.4s infinite;
        z-index: 15;
        pointer-events: none;
        text-align: center;
        white-space: nowrap;
    `;

    kaleido.appendChild(heroWrap);
    raveOverlay.appendChild(canvas);
    raveOverlay.appendChild(kaleido);
    raveOverlay.appendChild(neonText);
    document.body.appendChild(raveOverlay);

    // ---------------- Keyframes (inserted once) ----------------
    if (!document.getElementById('cat-rave-styles')) {
        const style = document.createElement('style');
        style.id = 'cat-rave-styles';
        style.textContent = `
            @keyframes catEnter {
                0% { transform: scale(0.2); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes catPulse {
                0% { transform: scale(1) rotate(-1deg); }
                100% { transform: scale(1.06) rotate(1deg); }
            }
            @keyframes catOrbit {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes catTextFlicker {
                0%, 19%, 21%, 23%, 54%, 56%, 100% { opacity: 1; }
                20%, 22%, 55% { opacity: 0.4; }
            }
            @keyframes catShake {
                0% { transform: translate(0, 0); }
                25% { transform: translate(2px, -2px); }
                50% { transform: translate(-2px, 2px); }
                75% { transform: translate(2px, 2px); }
                100% { transform: translate(0, 0); }
            }
        `;
        document.head.appendChild(style);
    }

    // ---------------- Canvas: light beams + confetti ----------------
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lightBeams = [];
    let particles = [];
    let frame = 0;

    class LightBeam {
        constructor(x) {
            this.x = x;
            this.width = 100 + Math.random() * 150;
            this.intensity = Math.random() * 0.4 + 0.2;
            this.hue = Math.random() * 360;
            this.speed = 0.5 + Math.random() * 1.5;
        }
        update() { this.hue = (this.hue + 2) % 360; }
        draw() {
            ctx.save();
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, 60%, ${this.intensity})`);
            gradient.addColorStop(0.3, `hsla(${this.hue}, 100%, 50%, ${this.intensity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            const topWidth = this.width * 0.3;
            ctx.moveTo(this.x - topWidth / 2, -20);
            ctx.lineTo(this.x + topWidth / 2, -20);
            ctx.lineTo(this.x + this.width / 2, canvas.height);
            ctx.lineTo(this.x - this.width / 2, canvas.height);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    function drawHeart(size) {
        ctx.beginPath();
        const s = size / 2;
        ctx.moveTo(0, s);
        ctx.bezierCurveTo(-s, -s / 2, -s * 2, s, 0, s * 2.2);
        ctx.bezierCurveTo(s * 2, s, s, -s / 2, 0, s);
        ctx.fill();
    }

    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = -(2 + Math.random() * 5);
            this.life = 1;
            this.decay = 0.006 + Math.random() * 0.012;
            this.size = 3 + Math.random() * 6;
            this.shape = Math.random() > 0.5 ? 'heart' : 'paw';
            const colors = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0099', '#00FF99', '#FF6EC7'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() { this.x += this.vx; this.y += this.vy; this.vy += 0.02; this.life -= this.decay; }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.life);
            ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 14;
            if (this.shape === 'heart') {
                drawHeart(this.size);
            } else {
                // simple paw print: one big pad + four toes
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 0.6, this.size * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
                const toeOffsets = [[-0.6, -0.8], [-0.2, -1.1], [0.2, -1.1], [0.6, -0.8]];
                toeOffsets.forEach(([ox, oy]) => {
                    ctx.beginPath();
                    ctx.ellipse(ox * this.size, oy * this.size, this.size * 0.22, this.size * 0.22, 0, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < 6; i++) lightBeams.push(new LightBeam((canvas.width / 7) * (i + 1)));

    function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // faint non-accumulating tint so the page stays visible
        ctx.fillStyle = 'rgba(5, 0, 10, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const beam of lightBeams) { beam.update(); beam.draw(); }

        if (frame % 2 === 0) {
            for (let i = 0; i < 3; i++) particles.push(new Confetti());
        }
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].life <= 0 || particles[i].y < -20) particles.splice(i, 1);
        }

        frame++;
        state.rafId = requestAnimationFrame(drawFrame);
    }
    drawFrame();

    // ---------------- Beat-synced audio + screen shake ----------------
    playRaveBeat(state);

    // ---------------- Auto-exit & manual close ----------------
    const exitTimer = setTimeout(() => window.stopCatRave(), 6000);
    state.timers.push(exitTimer);

    raveOverlay.addEventListener('click', () => window.stopCatRave());
};

window.stopCatRave = function () {
    const raveOverlay = document.getElementById('cat-rave-overlay');
    cleanupRaveState();
    if (raveOverlay) {
        raveOverlay.style.transition = 'opacity 0.3s ease-out';
        raveOverlay.style.opacity = '0';
        setTimeout(() => {
            if (raveOverlay.parentNode) raveOverlay.parentNode.removeChild(raveOverlay);
        }, 300);
    }
};

function shakeScreen() {
    const overlay = document.getElementById('cat-rave-overlay');
    if (!overlay) return;
    overlay.style.animation = 'catShake 0.15s ease-in-out';
    setTimeout(() => { if (overlay) overlay.style.animation = ''; }, 160);
}

function playRaveBeat(state) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        state.audioCtx = audioContext;
        window._raveAudioContext = audioContext;

        const bpm = 128;
        const beatSeconds = 60 / bpm;
        const totalBeats = 12; // ~5.6s, close to the 6s auto-exit
        const stabNotes = [660, 880, 990, 1320];

        function scheduleKick(time) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.setValueAtTime(140, time);
            osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.15);
            gain.gain.setValueAtTime(0.35, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
            osc.start(time);
            osc.stop(time + 0.15);
        }

        function scheduleHat(time) {
            const bufferSize = Math.floor(audioContext.sampleRate * 0.05);
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = audioContext.createBufferSource();
            noise.buffer = buffer;
            const filter = audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 7000;
            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);
            noise.start(time);
            noise.stop(time + 0.05);
        }

        function scheduleStab(time, freq) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(time);
            osc.stop(time + 0.12);
        }

        for (let i = 0; i < totalBeats; i++) {
            const t = audioContext.currentTime + i * beatSeconds;
            scheduleKick(t);
            scheduleHat(t + beatSeconds / 2);
            if (i % 2 === 0) scheduleStab(t, stabNotes[(i / 2) % stabNotes.length]);

            const shakeTimer = setTimeout(() => shakeScreen(), i * beatSeconds * 1000);
            state.timers.push(shakeTimer);
        }
    } catch (e) {
        console.log('Web Audio API not available', e);
    }
}