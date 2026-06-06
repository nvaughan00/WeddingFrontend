window.initExplosion = function () {
    const canvas = document.getElementById('explosion-canvas');
    const ctx = canvas.getContext('2d');
    const stage = document.getElementById('stage');

    function resize() {
        canvas.width = stage.offsetWidth;
        canvas.height = stage.offsetHeight;
    }
    resize();

    const W = () => canvas.width;
    const H = () => canvas.height;
    const particles = [];
    const embers = [];

    const audio = new Audio('sounds/buddy.mp3');
    audio.volume = 0.8;
    audio.play();
    window._hellYeahAudio = audio;

    class Particle {
        constructor(x, y) {
            this.x = x; this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 12;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 6;
            this.life = 1;
            this.decay = 0.012 + Math.random() * 0.018;
            this.size = 8 + Math.random() * 20;
            const colors = ['#FF4500', '#FF6600', '#FF8C00', '#FFD700', '#FF0000', '#FFAA00', '#FFF200'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.gravity = 0.18;
            this.type = Math.random() > 0.5 ? 'circle' : 'flame';
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            this.vy += this.gravity; this.vx *= 0.98;
            this.life -= this.decay; this.size *= 0.97;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.life);
            if (this.type === 'flame') {
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                grad.addColorStop(0, '#FFFFFF');
                grad.addColorStop(0.3, this.color);
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = this.size * 2;
                ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
            }
            ctx.restore();
        }
    }

    class Ember {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = -(Math.random() * 5 + 2);
            this.life = 1;
            this.decay = 0.008 + Math.random() * 0.012;
            this.size = 1.5 + Math.random() * 2.5;
            this.gravity = 0.05;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            this.vy += this.gravity; this.vx *= 0.99;
            this.life -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.life);
            ctx.fillStyle = Math.random() > 0.5 ? '#FFD700' : '#FF6600';
            ctx.shadowColor = '#FF4500';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function explode(x, y) {
        for (let i = 0; i < 80; i++) particles.push(new Particle(x, y));
        for (let i = 0; i < 200; i++) embers.push(new Ember(x, y));
    }

    const positions = [[0.15, 0.8], [0.85, 0.8], [0.5, 0.9], [0.25, 0.6], [0.75, 0.6], [0.5, 0.7], [0.1, 0.95], [0.9, 0.95]];
    let expIdx = 0;

    function triggerNext() {
        if (expIdx < positions.length) {
            const [rx, ry] = positions[expIdx++];
            explode(W() * rx, H() * ry);
            setTimeout(triggerNext, 180);
        }
    }
    setTimeout(triggerNext, 100);
    window._hellYeahInterval = setInterval(() => { expIdx = 0; setTimeout(triggerNext, 100); }, 3000);

    function loop() {
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, 0, W(), H());
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update(); particles[i].draw();
            if (particles[i].life <= 0) particles.splice(i, 1);
        }
        for (let i = embers.length - 1; i >= 0; i--) {
            embers[i].update(); embers[i].draw();
            if (embers[i].life <= 0) embers.splice(i, 1);
        }
        for (let i = 0; i < 3; i++) embers.push(new Ember(Math.random() * W(), H()));
        requestAnimationFrame(loop);
    }
    loop();

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const actx = new AudioContext();
        window._hellYeahAudioContext = actx;

        function firework(delay) {
            setTimeout(() => {
                const whistleOsc = actx.createOscillator();
                const whistleGain = actx.createGain();
                whistleOsc.type = 'sine';
                whistleOsc.frequency.setValueAtTime(400, actx.currentTime);
                whistleOsc.frequency.exponentialRampToValueAtTime(1200, actx.currentTime + 0.4);
                whistleGain.gain.setValueAtTime(0.15, actx.currentTime);
                whistleGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.4);
                whistleOsc.connect(whistleGain);
                whistleGain.connect(actx.destination);
                whistleOsc.start(actx.currentTime);
                whistleOsc.stop(actx.currentTime + 0.4);

                setTimeout(() => {
                    const burstBuf = actx.createBuffer(1, actx.sampleRate * 1.2, actx.sampleRate);
                    const data = burstBuf.getChannelData(0);
                    for (let i = 0; i < data.length; i++) {
                        const t = i / actx.sampleRate;
                        data[i] = (Math.random() > 0.85 ? (Math.random() * 2 - 1) : 0)
                            * Math.pow(Math.max(0, 1 - t * 1.5), 0.3);
                    }
                    const src = actx.createBufferSource();
                    src.buffer = burstBuf;

                    const burstGain = actx.createGain();
                    burstGain.gain.setValueAtTime(0.6, actx.currentTime);
                    burstGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 1.2);

                    const hipass = actx.createBiquadFilter();
                    hipass.type = 'highpass';
                    hipass.frequency.value = 800;

                    const revBuf = actx.createBuffer(2, actx.sampleRate * 1.5, actx.sampleRate);
                    for (let ch = 0; ch < 2; ch++) {
                        const d = revBuf.getChannelData(ch);
                        for (let i = 0; i < d.length; i++) {
                            d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
                        }
                    }
                    const reverb = actx.createConvolver();
                    reverb.buffer = revBuf;

                    src.connect(hipass);
                    hipass.connect(burstGain);
                    burstGain.connect(reverb);
                    reverb.connect(actx.destination);
                    burstGain.connect(actx.destination);
                    src.start();
                }, 400);

            }, delay);
        }

        [0, 200, 400, 650, 900, 1150, 1400, 1700].forEach(d => firework(d + 100));
        window._hellYeahBoomInterval = setInterval(() => {
            [0, 200, 400, 650, 900, 1150, 1400, 1700].forEach(d => firework(d + 100));
        }, 3000);

    } catch (e) { console.error('Audio error:', e); }
};

window.stopExplosion = function () {
    if (window._hellYeahAudio) {
        window._hellYeahAudio.pause();
        window._hellYeahAudio.currentTime = 0;
        window._hellYeahAudio = null;
    }
    if (window._hellYeahAudioContext) {
        window._hellYeahAudioContext.close();
        window._hellYeahAudioContext = null;
    }
    if (window._hellYeahInterval) {
        clearInterval(window._hellYeahInterval);
        window._hellYeahInterval = null;
    }
    if (window._hellYeahBoomInterval) {
        clearInterval(window._hellYeahBoomInterval);
        window._hellYeahBoomInterval = null;
    }
};

window.playBoo = function () {
    const audio = new Audio('sounds/boo.mp3');
    audio.volume = 0.8;
    audio.play();
    window._hellYeahAudio = audio;
}

window.scrollToElement = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.playGlimbo = function (isFrenzy) {
    const now = Date.now();
    const delay = convertRange(Math.random(), [0, 1], [300, 700]);
    const cooldown = isFrenzy ? delay : 0;

    if (window._glimboLastPlayed && (now - window._glimboLastPlayed) < cooldown) {
        return;
    }

    window._glimboLastPlayed = now;

    // Initialize glimbo audio array if it doesn't exist
    if (!window._glimboAudioInstances) {
        window._glimboAudioInstances = [];
    }

    // Array of Glimbo sound options
    const glimboSounds = ['sounds/glimbo.mp3', 'sounds/glimbo2.mp3', 'sounds/glimbo3.mp3', 'sounds/glimbo4.mp3'];
    const randomSound = glimboSounds[Math.floor(Math.random() * glimboSounds.length)];

    const audio = new Audio(randomSound);
    audio.volume = isFrenzy ? 0.05 : 0.1; 

    // Add to array of playing sounds
    window._glimboAudioInstances.push(audio);

    // Clean up finished audio instances to prevent memory leaks
    audio.addEventListener('ended', () => {
        const index = window._glimboAudioInstances.indexOf(audio);
        if (index > -1) {
            window._glimboAudioInstances.splice(index, 1);
        }
    });

    audio.play();
}

function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}