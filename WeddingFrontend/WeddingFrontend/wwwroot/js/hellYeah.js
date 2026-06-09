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
    const sparks = [];

    const audio = new Audio('sounds/buddy.mp3');
    audio.volume = 0.8;
    audio.play();
    window._hellYeahAudio = audio;

    let animFrame = null;
    let clashProgress = 0;
    let clashPhase = 'swing'; // 'swing', 'impact', 'hold'
    let impactFlash = 0;

    class Spark {
        constructor(x, y) {
            this.x = x; this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 8;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 2;
            this.life = 1;
            this.decay = 0.015 + Math.random() * 0.025;
            this.size = 1.5 + Math.random() * 3;
            this.gravity = 0.12;
            const colors = ['#FFD700', '#FFF8DC', '#FFFACD', '#C0C0C0', '#E8E8E8', '#FFA500'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            this.vy += this.gravity; this.vx *= 0.97;
            this.life -= this.decay; this.size *= 0.98;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.life);
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function drawSword(tipX, tipY, angle, length, progress) {
        const bladeLength = length * 0.7;
        const handleLength = length * 0.3;

        // Sword slides in from off-screen toward tipX/tipY
        // At progress=1, blade tip is at (tipX, tipY)
        // Offset the sword backward along its angle based on progress
        const totalTravel = length * 4.5;
        const dist = totalTravel * (1 - progress);

        const sx = tipX - Math.cos(angle) * dist;
        const sy = tipY - Math.sin(angle) * dist;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(angle);

        // Blade (draws forward from origin toward +x)
        const bladeGrad = ctx.createLinearGradient(0, 0, bladeLength, 0);
        bladeGrad.addColorStop(0, '#A0A0A0');
        bladeGrad.addColorStop(0.2, '#E0E0E0');
        bladeGrad.addColorStop(0.5, '#FFFFFF');
        bladeGrad.addColorStop(0.8, '#C8C8C8');
        bladeGrad.addColorStop(1, '#B0B0B0');
        ctx.fillStyle = bladeGrad;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(bladeLength - 12, -3.5);
        ctx.lineTo(bladeLength, 0);
        ctx.lineTo(bladeLength - 12, 3.5);
        ctx.lineTo(0, 5);
        ctx.closePath();
        ctx.fill();

        // Fuller (blood groove)
        ctx.strokeStyle = 'rgba(150, 150, 170, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(bladeLength - 20, 0);
        ctx.stroke();

        // Edge highlights
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(5, -3.5);
        ctx.lineTo(bladeLength - 15, -2);
        ctx.stroke();

        // Guard (crossguard)
        ctx.fillStyle = '#8B6914';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(-2, -12);
        ctx.lineTo(4, -12);
        ctx.lineTo(6, -8);
        ctx.lineTo(6, 8);
        ctx.lineTo(4, 12);
        ctx.lineTo(-2, 12);
        ctx.lineTo(-4, 8);
        ctx.lineTo(-4, -8);
        ctx.closePath();
        ctx.fill();

        // Guard gem
        ctx.fillStyle = '#FF2244';
        ctx.shadowColor = '#FF4466';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(1, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // Guard ornament tips
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(1, -12, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(1, 12, 3, 0, Math.PI * 2);
        ctx.fill();

        // Handle (grip)
        const handleGrad = ctx.createLinearGradient(-4, 0, -4 - handleLength, 0);
        handleGrad.addColorStop(0, '#5C3A1E');
        handleGrad.addColorStop(0.5, '#8B5A2B');
        handleGrad.addColorStop(1, '#3E2410');
        ctx.fillStyle = handleGrad;
        ctx.shadowBlur = 0;
        ctx.fillRect(-4 - handleLength, -4, handleLength, 8);

        // Handle wrap
        ctx.strokeStyle = '#2A1A08';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < handleLength; i += 7) {
            ctx.beginPath();
            ctx.moveTo(-4 - i, -4);
            ctx.lineTo(-7 - i, 4);
            ctx.stroke();
        }

        // Pommel
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(-4 - handleLength - 5, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#AA4400';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(-4 - handleLength - 5, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function emitSparks(x, y, count) {
        for (let i = 0; i < count; i++) sparks.push(new Spark(x, y));
    }

    // Ambient fantasy elements
    const runes = [];
    const stars = [];
    const orbs = [];

    class Rune {
        constructor() {
            this.x = Math.random() * W();
            this.y = Math.random() * H();
            this.life = 1;
            this.decay = 0.003 + Math.random() * 0.005;
            this.size = 10 + Math.random() * 16;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
            this.vy = -(0.2 + Math.random() * 0.4);
            const runeChars = ['\u2720', '\u2721', '\u2726', '\u2727', '\u2728', '\u2742', '\u2733', '\u2734', '\u2735', '\u269D'];
            this.char = runeChars[Math.floor(Math.random() * runeChars.length)];
            this.color = Math.random() > 0.5 ? '#7B68EE' : '#DDA0DD';
        }
        update() {
            this.y += this.vy;
            this.rotation += this.rotSpeed;
            this.life -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.life) * 0.4;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.font = `${this.size}px serif`;
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.char, 0, 0);
            ctx.restore();
        }
    }

    class Star {
        constructor() {
            this.x = Math.random() * W();
            this.y = Math.random() * H() * 0.7;
            this.life = 1;
            this.decay = 0.004 + Math.random() * 0.006;
            this.size = 1 + Math.random() * 2;
            this.twinkleSpeed = 0.05 + Math.random() * 0.1;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.age = 0;
        }
        update() {
            this.age += this.twinkleSpeed;
            this.life -= this.decay;
        }
        draw() {
            const twinkle = (Math.sin(this.age + this.twinklePhase) + 1) / 2;
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.life) * twinkle * 0.7;
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#AACCFF';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Orb {
        constructor() {
            this.x = Math.random() * W();
            this.y = H() * 0.3 + Math.random() * H() * 0.5;
            this.life = 1;
            this.decay = 0.002 + Math.random() * 0.004;
            this.size = 4 + Math.random() * 8;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = -(0.1 + Math.random() * 0.3);
            this.wobbleSpeed = 0.02 + Math.random() * 0.03;
            this.wobbleAmp = 0.5 + Math.random() * 1;
            this.age = 0;
            const orbColors = ['#4488FF', '#8844FF', '#44FFAA', '#FFAA44', '#FF44AA'];
            this.color = orbColors[Math.floor(Math.random() * orbColors.length)];
        }
        update() {
            this.age++;
            this.x += this.vx + Math.sin(this.age * this.wobbleSpeed) * this.wobbleAmp;
            this.y += this.vy;
            this.life -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.life) * 0.5;
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0, '#FFFFFF');
            grad.addColorStop(0.3, this.color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Easing function for smooth acceleration into the clash
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function triggerClash() {
        clashProgress = 0;
        clashPhase = 'swing';
        impactFlash = 0;
    }

    triggerClash();

    function loop() {
        ctx.clearRect(0, 0, W(), H());

        const cx = W() / 2;
        const cy = H() * 0.3;
        const swordLen = Math.min(W(), H()) * 0.45;

        // The blades meet a bit before the hilt (tips stop ~20% of blade short of center)
        const stopOffset = swordLen * 0.15 * -1;

        // Update clash animation with smooth easing
        if (clashPhase === 'swing') {
            clashProgress += 0.012;
            if (clashProgress >= 1) {
                clashProgress = 1;
                clashPhase = 'impact';
                impactFlash = 1;
                emitSparks(cx, cy, 150);
            }
        } else if (clashPhase === 'impact') {
            impactFlash -= 0.02;
            if (impactFlash <= 0) {
                impactFlash = 0;
                clashPhase = 'hold';
            }
            // Lots of continuous sparks during impact
            if (Math.random() > 0.2) emitSparks(cx, cy, 6);
        } else if (clashPhase === 'hold') {
            // Occasional sparks while held
            if (Math.random() > 0.88) emitSparks(cx, cy, 2);
        }

        // Apply easing to progress for smooth motion
        const easedProgress = easeOutQuart(clashProgress);

        // Draw ambient fantasy background elements
        // Spawn runes (much more frequent)
        if (Math.random() > 0.88) runes.push(new Rune());
        for (let i = runes.length - 1; i >= 0; i--) {
            runes[i].update(); runes[i].draw();
            if (runes[i].life <= 0) runes.splice(i, 1);
        }

        // Spawn twinkling stars (much more frequent)
        if (Math.random() > 0.82) stars.push(new Star());
        for (let i = stars.length - 1; i >= 0; i--) {
            stars[i].update(); stars[i].draw();
            if (stars[i].life <= 0) stars.splice(i, 1);
        }

        // Spawn mystical orbs (more frequent)
        if (Math.random() > 0.92) orbs.push(new Orb());
        for (let i = orbs.length - 1; i >= 0; i--) {
            orbs[i].update(); orbs[i].draw();
            if (orbs[i].life <= 0) orbs.splice(i, 1);
        }

        // Draw impact flash
        if (impactFlash > 0) {
            ctx.save();
            ctx.globalAlpha = impactFlash * 0.7;
            const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, swordLen * 0.6);
            flashGrad.addColorStop(0, '#FFFFFF');
            flashGrad.addColorStop(0.2, '#FFD700');
            flashGrad.addColorStop(0.5, '#7B68EE');
            flashGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = flashGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, swordLen * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Both swords at exactly 45 degrees for perfect symmetry
        const clashAngle = Math.PI / 4;
        const bladeLen = swordLen * 0.7;

        // Sword 1: from bottom-left, blade points upper-right toward center
        const draw1 = -clashAngle;
        const guard1x = cx - (bladeLen + stopOffset) * Math.cos(draw1);
        const guard1y = cy - (bladeLen + stopOffset) * Math.sin(draw1);
        drawSword(guard1x, guard1y, draw1, swordLen, easedProgress);

        // Sword 2: from bottom-right, blade points upper-left toward center
        const draw2 = Math.PI + clashAngle;
        const guard2x = cx - (bladeLen + stopOffset) * Math.cos(draw2);
        const guard2y = cy - (bladeLen + stopOffset) * Math.sin(draw2);
        drawSword(guard2x, guard2y, draw2, swordLen, easedProgress);

        // Update and draw sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update(); sparks[i].draw();
            if (sparks[i].life <= 0) sparks.splice(i, 1);
        }

        // Ambient floating embers rising from bottom (more frequent)
        if (Math.random() > 0.7) {
            const ember = new Spark(Math.random() * W(), H());
            ember.vy = -(Math.random() * 2 + 1);
            ember.gravity = 0.01;
            ember.decay = 0.004;
            ember.color = Math.random() > 0.5 ? '#7B68EE' : '#FFD700';
            sparks.push(ember);
        }

        animFrame = requestAnimationFrame(loop);
    }
    loop();

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const actx = new AudioContext();
        window._hellYeahAudioContext = actx;

        function swordClang(delay) {
            setTimeout(() => {
                const t0 = actx.currentTime;

                // Master compressor for maximum punch
                const compressor = actx.createDynamicsCompressor();
                compressor.threshold.value = -15;
                compressor.knee.value = 4;
                compressor.ratio.value = 12;
                compressor.attack.value = 0.0005;
                compressor.release.value = 0.2;
                compressor.connect(actx.destination);

                // Shorter reverb, lower mix for tighter clash
                const reverbLen = 1.2;
                const reverbBuf = actx.createBuffer(2, actx.sampleRate * reverbLen, actx.sampleRate);
                for (let ch = 0; ch < 2; ch++) {
                    const d = reverbBuf.getChannelData(ch);
                    for (let i = 0; i < d.length; i++) {
                        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
                    }
                }
                const reverb = actx.createConvolver();
                reverb.buffer = reverbBuf;
                const reverbGain = actx.createGain();
                reverbGain.gain.value = 0.15;
                reverb.connect(reverbGain);
                reverbGain.connect(compressor);

                // Layer 1: Massive impact crack
                const hitLen = 0.08;
                const hitBuf = actx.createBuffer(1, actx.sampleRate * hitLen, actx.sampleRate);
                const hitData = hitBuf.getChannelData(0);
                for (let i = 0; i < hitData.length; i++) {
                    hitData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / hitData.length, 1.5);
                }
                const hitSrc = actx.createBufferSource();
                hitSrc.buffer = hitBuf;
                const hitGain = actx.createGain();
                hitGain.gain.setValueAtTime(1.0, t0);
                hitSrc.connect(hitGain);
                hitGain.connect(compressor);
                hitGain.connect(reverb);
                hitSrc.start(t0);

                // Layer 2: Metallic ring - epic sustain
                const metalFreqs = [987, 1423, 1891, 2741, 3547, 4729];
                const decays =     [1.5,  1.2,   0.9,  0.7,  0.5,  0.35];
                metalFreqs.forEach((freq, idx) => {
                    const osc = actx.createOscillator();
                    const gain = actx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    const vol = 0.15 / (idx + 1);
                    gain.gain.setValueAtTime(vol, t0);
                    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + decays[idx]);
                    osc.connect(gain);
                    gain.connect(compressor);
                    gain.connect(reverb);
                    osc.start(t0);
                    osc.stop(t0 + decays[idx] + 0.01);
                });

                // Layer 3: Deep sub-bass boom (heavier, longer)
                const boom = actx.createOscillator();
                const boomGain = actx.createGain();
                boom.type = 'sine';
                boom.frequency.value = 40;
                boomGain.gain.setValueAtTime(0.7, t0);
                boomGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
                boom.connect(boomGain);
                boomGain.connect(compressor);
                boom.start(t0);
                boom.stop(t0 + 0.65);

                // Layer 4: Mid punch (harder hit)
                const punch = actx.createOscillator();
                const punchGain = actx.createGain();
                punch.type = 'triangle';
                punch.frequency.value = 180;
                punchGain.gain.setValueAtTime(0.5, t0);
                punchGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2);
                punch.connect(punchGain);
                punchGain.connect(compressor);
                punch.start(t0);
                punch.stop(t0 + 0.25);

                // Layer 5: Extended thunder rumble
                const rumbleLen = 1.5;
                const rumbleBuf = actx.createBuffer(1, actx.sampleRate * rumbleLen, actx.sampleRate);
                const rumbleData = rumbleBuf.getChannelData(0);
                for (let i = 0; i < rumbleData.length; i++) {
                    const t = i / rumbleData.length;
                    rumbleData[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 1.3);
                }
                const rumbleSrc = actx.createBufferSource();
                rumbleSrc.buffer = rumbleBuf;
                const rumbleGain = actx.createGain();
                rumbleGain.gain.setValueAtTime(0.35, t0);
                rumbleGain.gain.exponentialRampToValueAtTime(0.0001, t0 + rumbleLen);
                const rumbleLow = actx.createBiquadFilter();
                rumbleLow.type = 'lowpass';
                rumbleLow.frequency.value = 300;
                rumbleSrc.connect(rumbleLow);
                rumbleLow.connect(rumbleGain);
                rumbleGain.connect(compressor);
                rumbleGain.connect(reverb);
                rumbleSrc.start(t0);

                // Layer 6: Second sub-hit slightly delayed for double-impact feel
                const boom2 = actx.createOscillator();
                const boom2Gain = actx.createGain();
                boom2.type = 'sine';
                boom2.frequency.value = 60;
                boom2Gain.gain.setValueAtTime(0.0001, t0);
                boom2Gain.gain.setValueAtTime(0.4, t0 + 0.03);
                boom2Gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
                boom2.connect(boom2Gain);
                boom2Gain.connect(compressor);
                boom2.start(t0);
                boom2.stop(t0 + 0.4);

            }, delay);
        }

        // Medieval crowd cheer (formant-based voices) + fanfare trumpets
        function medievalCheer(delay) {
            setTimeout(() => {
                const t0 = actx.currentTime;

                const cheerComp = actx.createDynamicsCompressor();
                cheerComp.threshold.value = -18;
                cheerComp.ratio.value = 4;
                cheerComp.connect(actx.destination);

                const cheerLen = 5.0;

                // Human vowel formants - these make noise sound like voices
                // Each "voice group" is a sawtooth through vowel formant filters
                function createVoiceGroup(baseFreq, vowelFormants, startTime, duration, volume) {
                    const osc = actx.createOscillator();
                    osc.type = 'sawtooth';
                    // Slight vibrato for human quality
                    osc.frequency.value = baseFreq;
                    const vibrato = actx.createOscillator();
                    const vibratoGain = actx.createGain();
                    vibrato.frequency.value = 4 + Math.random() * 3;
                    vibratoGain.gain.value = baseFreq * 0.02;
                    vibrato.connect(vibratoGain);
                    vibratoGain.connect(osc.frequency);
                    vibrato.start(startTime);
                    vibrato.stop(startTime + duration);

                    const masterGain = actx.createGain();
                    masterGain.gain.setValueAtTime(0.0001, startTime);
                    masterGain.gain.linearRampToValueAtTime(volume, startTime + Math.min(0.2, duration * 0.2));
                    const fadeStart = startTime + Math.max(duration * 0.6, duration - 1.5);
                    masterGain.gain.setValueAtTime(volume * 0.8, fadeStart);
                    masterGain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

                    // Apply formant filters (2 resonant peaks per voice = vowel sound)
                    vowelFormants.forEach(f => {
                        const formant = actx.createBiquadFilter();
                        formant.type = 'bandpass';
                        formant.frequency.value = f.freq;
                        formant.Q.value = f.q;
                        const fGain = actx.createGain();
                        fGain.gain.value = f.gain;
                        osc.connect(formant);
                        formant.connect(fGain);
                        fGain.connect(masterGain);
                    });

                    masterGain.connect(cheerComp);
                    osc.start(startTime);
                    osc.stop(startTime + duration);
                }

                // "AH" vowel formants (like a crowd yelling "YEAH/RAH")
                const ahFormants = [
                    { freq: 730, q: 8, gain: 1.0 },
                    { freq: 1090, q: 10, gain: 0.7 },
                    { freq: 2440, q: 12, gain: 0.3 }
                ];
                // "OH" vowel
                const ohFormants = [
                    { freq: 570, q: 8, gain: 1.0 },
                    { freq: 840, q: 10, gain: 0.6 },
                    { freq: 2410, q: 12, gain: 0.2 }
                ];
                // "EH" vowel
                const ehFormants = [
                    { freq: 530, q: 8, gain: 1.0 },
                    { freq: 1840, q: 10, gain: 0.5 },
                    { freq: 2480, q: 12, gain: 0.3 }
                ];

                const vowels = [ahFormants, ohFormants, ehFormants];

                // Multiple voice groups at different pitches (men's choir cheering)
                const basePitches = [95, 110, 125, 140, 160, 180, 200, 220];
                basePitches.forEach((pitch, idx) => {
                    const vowel = vowels[idx % vowels.length];
                    const stagger = Math.random() * 0.4;
                    const vol = 0.12 + Math.random() * 0.05;
                    createVoiceGroup(pitch + Math.random() * 10, vowel, t0 + stagger, cheerLen - stagger, vol);
                });

                // Higher voices (women/children in crowd)
                const highPitches = [260, 300, 340, 380];
                highPitches.forEach((pitch, idx) => {
                    const vowel = vowels[idx % vowels.length];
                    const stagger = 0.2 + Math.random() * 0.5;
                    createVoiceGroup(pitch + Math.random() * 15, vowel, t0 + stagger, cheerLen - stagger - 0.5, 0.07);
                });

                // Individual shouts (short exclamations)
                for (let v = 0; v < 20; v++) {
                    const shoutDelay = Math.random() * 2.0;
                    const shoutLen = 0.15 + Math.random() * 0.3;
                    const pitch = 100 + Math.random() * 200;
                    const vowel = vowels[Math.floor(Math.random() * vowels.length)];
                    createVoiceGroup(pitch, vowel, t0 + shoutDelay, shoutLen, 0.14 + Math.random() * 0.06);
                }

            }, delay);
        }

        // Fanfare trumpet (audio file)
        function fanfareTrumpets(delay) {
            setTimeout(() => {
                const fanfare = new Audio('sounds/buddy1.mp3');
                fanfare.volume = 0.2;
                fanfare.play();
                window._hellYeahFanfare = fanfare;
            }, delay);
        }

        // Timing: clash at 1200ms, trumpet fanfare after, crowd swells in
        swordClang(1200);
        fanfareTrumpets(1500);
        medievalCheer(2000);

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
    if (window._hellYeahFanfare) {
        window._hellYeahFanfare.pause();
        window._hellYeahFanfare.currentTime = 0;
        window._hellYeahFanfare = null;
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

    if (randomSound == 0) {
        audio.volume = isFrenzy ? 0.2 : 0.3;
    }

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