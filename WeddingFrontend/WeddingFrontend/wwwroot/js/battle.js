
window.startBattle = function() {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const W = 680, H = 420;
    let units = [], projectiles = [], particles = [], frame = 0;

    const TYPES = {
      elf:        { color:'#2d8a4e', accent:'#a8e6b8', hp:60,  spd:0.7, atk:12, range:90,  size:14, shape:'elf'        },
      centaur:    { color:'#8B5E3C', accent:'#d4a574', hp:120, spd:0.5, atk:20, range:50,  size:20, shape:'centaur'    },
      satyr:      { color:'#7B3F9E', accent:'#d4a8f0', hp:70,  spd:0.9, atk:10, range:70,  size:15, shape:'satyr'      },
      rabbit:     { color:'#C0392B', accent:'#f0a8a8', hp:50,  spd:1.4, atk:15, range:40,  size:13, shape:'rabbit'     },
      tribesperson:{ color:'#B5651D', accent:'#f5c88a', hp:90,  spd:0.6, atk:18, range:60,  size:17, shape:'tribe'     },
    };

    let idSeq = 0;
    function addUnit(type, side) {
      const t = TYPES[type];
      const x = side === 'left' ? 20 + Math.random()*80 : W - 20 - Math.random()*80;
      const y = 180 + Math.random() * 180;
      units.push({ id: idSeq++, type, side, x, y, hp: t.hp, maxHp: t.hp, vx: 0, vy: 0, cooldown: 0, state: 'walk', anim: Math.random()*Math.PI*2 });
    }

    function spawnParticle(x, y, color) {
      for (let i = 0; i < 6; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 1 + Math.random() * 3;
        particles.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s - 1, life: 1, color });
      }
    }

    function drawElf(x, y, color, accent, flip, anim) {
      ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1,1);
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.ellipse(0, -18, 5, 7, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(-4, -11, 8, 10);
      ctx.fillStyle = color;
      ctx.fillRect(-5, -2, 3, 8 + Math.sin(anim)*2);
      ctx.fillRect(2, -2, 3, 8 + Math.sin(anim+Math.PI)*2);
      ctx.fillStyle = accent;
      ctx.fillRect(-7, -10, 3, 7 + Math.sin(anim)*3);
      ctx.fillRect(4, -10, 3, 7 + Math.sin(anim+Math.PI)*3);
      ctx.fillStyle = '#f5e6c8';
      ctx.beginPath(); ctx.moveTo(-5, -24); ctx.lineTo(0, -32); ctx.lineTo(5, -24); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function drawCentaur(x, y, color, accent, flip, anim) {
      ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1,1);
      ctx.fillStyle = color;
      ctx.fillRect(-14, 2, 28, 12);
      ctx.fillRect(-14, 14, 5, 10 + Math.sin(anim)*3);
      ctx.fillRect(-6, 14, 5, 10 + Math.sin(anim+1)*3);
      ctx.fillRect(5, 14, 5, 10 + Math.sin(anim+2)*3);
      ctx.fillRect(13, 14, 5, 10 + Math.sin(anim+3)*3);
      ctx.fillStyle = '#f5e6c8';
      ctx.beginPath(); ctx.ellipse(8, -8, 7, 8, 0.2, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = color;
      ctx.fillRect(2, -14, 12, 8);
      ctx.fillStyle = accent;
      ctx.fillRect(14, -12, 3, 10);
      ctx.restore();
    }

    function drawSatyr(x, y, color, accent, flip, anim) {
      ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1,1);
      ctx.fillStyle = '#8B6914';
      ctx.beginPath(); ctx.ellipse(0, -10, 6, 10, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(3, -10, 3, 8, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#f5e6c8';
      ctx.beginPath(); ctx.ellipse(0, -20, 5, 6, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = color;
      ctx.fillRect(-5, -14, 10, 8);
      ctx.fillStyle = '#8B6914';
      ctx.beginPath(); ctx.ellipse(-4, -2, 4, 12, -0.2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(4, -2, 4, 12, 0.2, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(-8, -14, 3, 8 + Math.sin(anim)*3);
      ctx.restore();
    }

    function drawRabbit(x, y, color, accent, flip, anim) {
      ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1,1);
      ctx.fillStyle = '#e8d8d8';
      ctx.beginPath(); ctx.ellipse(-2, -30, 2, 7, -0.1, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(2, -29, 2, 7, 0.1, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#f0e0e0';
      ctx.beginPath(); ctx.ellipse(0, -18, 6, 7, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = color;
      ctx.fillRect(-5, -11, 10, 9);
      ctx.fillStyle = '#f0e0e0';
      ctx.fillRect(-6, -2, 4, 7 + Math.sin(anim)*2);
      ctx.fillRect(2, -2, 4, 7 + Math.sin(anim+Math.PI)*2);
      ctx.fillStyle = color;
      ctx.fillRect(-4, -12, 3, 7 + Math.sin(anim)*4);
      ctx.fillRect(4, -12, 3, 7 + Math.sin(anim+Math.PI)*4);
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(5, -13, 8, 2);
      ctx.restore();
    }

    function drawTribe(x, y, color, accent, flip, anim) {
      ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1,1);
      ctx.fillStyle = '#f5c57a';
      ctx.beginPath(); ctx.ellipse(0, -20, 6, 7, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = color;
      ctx.fillRect(-6, -13, 12, 11);
      ctx.fillStyle = accent;
      ctx.fillRect(-2, -25, 4, 6);
      ctx.fillRect(-8, -25, 3, 4);
      ctx.fillRect(5, -25, 3, 4);
      ctx.fillStyle = color;
      ctx.fillRect(-7, -13, 3, 8 + Math.sin(anim)*3);
      ctx.fillRect(4, -13, 3, 8 + Math.sin(anim+Math.PI)*3);
      ctx.fillStyle = '#f5c57a';
      ctx.fillRect(-5, -2, 4, 9 + Math.sin(anim)*2);
      ctx.fillRect(1, -2, 4, 9 + Math.sin(anim+Math.PI)*2);
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(7, -18, 2, 14);
      ctx.restore();
    }

    function drawUnit(u) {
      const t = TYPES[u.type];
      const flip = u.side === 'right';
      u.anim += 0.12;
      switch(u.type) {
        case 'elf':   drawElf(u.x, u.y, t.color, t.accent, flip, u.anim); break;
        case 'centaur': drawCentaur(u.x, u.y, t.color, t.accent, flip, u.anim); break;
        case 'satyr': drawSatyr(u.x, u.y, t.color, t.accent, flip, u.anim); break;
        case 'rabbit': drawRabbit(u.x, u.y, t.color, t.accent, flip, u.anim); break;
        case 'tribesperson': drawTribe(u.x, u.y, t.color, t.accent, flip, u.anim); break;
      }
      const bw = 24, bh = 3, bx = u.x - bw/2, by = u.y - 42;
      ctx.fillStyle = '#333'; ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = u.hp/u.maxHp > 0.5 ? '#2ecc71' : u.hp/u.maxHp > 0.25 ? '#f39c12' : '#e74c3c';
      ctx.fillRect(bx, by, bw * (u.hp/u.maxHp), bh);
    }

    function findTarget(u) {
      const t = TYPES[u.type];
      let best = null, bd = Infinity;
      for (const v of units) {
        if (v.side === u.side) continue;
        const d = Math.hypot(v.x - u.x, v.y - u.y);
        if (d < bd) { bd = d; best = v; }
      }
      return best && bd < t.range * 2.5 ? { unit: best, dist: bd } : null;
    }

    function fireProjectile(u, target) {
      const t = TYPES[u.type];
      const dx = target.x - u.x, dy = target.y - u.y;
      const d = Math.hypot(dx, dy);
      const spd = 4;
      projectiles.push({ x: u.x, y: u.y - 15, vx: dx/d*spd, vy: dy/d*spd, owner: u.id, side: u.side, dmg: t.atk * (0.8 + Math.random()*0.4), color: t.accent, life: 1 });
    }

    function tick() {
        frame++;
        for (const u of units) {
        if (u.hp <= 0) continue;
        const t = TYPES[u.type];
        u.cooldown = Math.max(0, u.cooldown - 1);
        const res = findTarget(u);
        if (res) {
            const { unit: target, dist } = res;
            if (dist < t.range) {
            if (u.cooldown <= 0) {
                if (t.range < 55) {
                target.hp -= t.atk * (0.8 + Math.random()*0.4);
                spawnParticle(target.x, target.y - 10, '#e74c3c');
                } else {
                fireProjectile(u, target);
                }
                u.cooldown = 40 + Math.random()*20;
            }
            u.vx *= 0.7; u.vy *= 0.7;
            } else {
            const dx = target.x - u.x, dy = target.y - u.y;
            const d = Math.hypot(dx, dy);
            u.vx += dx/d * t.spd * 0.3;
            u.vy += dy/d * t.spd * 0.3;
            }
        } else {
            const dir = u.side === 'left' ? 1 : -1;
            u.vx += dir * t.spd * 0.2;
            u.vy += (Math.random()-0.5)*0.3;
        }
        u.vx *= 0.85; u.vy *= 0.85;
        u.x += u.vx; u.y += u.vy;
        u.x = Math.max(10, Math.min(W-10, u.x));
        u.y = Math.max(160, Math.min(H-20, u.y));
        }
        for (const p of projectiles) {
            p.x += p.vx; p.y += p.vy; p.life -= 0.015;
            for (const u of units) {
                if (u.side === p.side || u.hp <= 0) continue;
                if (Math.hypot(u.x - p.x, u.y - p.y) < 10) {
                u.hp -= p.dmg;
                spawnParticle(p.x, p.y, p.color);
                p.life = 0;
                }
            }
        }
        for (const p of particles) { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= 0.05; }
        units = units.filter(u => u.hp > 0);
        projectiles = projectiles.filter(p => p.life > 0);
        particles = particles.filter(p => p.life > 0);
        const leftTypes = ['elf', 'centaur'];
        const rightTypes = ['satyr', 'rabbit', 'tribesperson'];

        if (frame % 120 === 0 && units.length < 100) {
        
        addUnit(leftTypes[Math.floor(Math.random()*leftTypes.length)], 'left');
        }

        if (frame % 100 === 0 && units.length < 100) {
            addUnit(rightTypes[Math.floor(Math.random() * rightTypes.length)], 'right');
        }
    }

    function drawBg() {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, W, 180);
      ctx.fillStyle = '#4a7c59';
      ctx.fillRect(0, 160, W, H-160);
      ctx.fillStyle = '#3d6b4a';
      for (let i = 0; i < 12; i++) {
        const x = 30 + i * 55, h = 40 + (i*37)%50;
        ctx.beginPath(); ctx.moveTo(x, 165); ctx.lineTo(x+12, 165-h); ctx.lineTo(x+24, 165); ctx.fill();
        ctx.fillStyle = '#2d5a39';
        ctx.beginPath(); ctx.moveTo(x+4, 165); ctx.lineTo(x+12, 165-h-15); ctx.lineTo(x+20, 165); ctx.fill();
        ctx.fillStyle = '#3d6b4a';
      }
      ctx.fillStyle = '#5a8c6a';
      ctx.fillRect(0, 300, W, H-300);
      ctx.fillStyle = '#7ab890';
      for (let i = 0; i < 40; i++) {
        ctx.fillRect(i*17, 298, 8, 4 + (i*7)%6);
      }
    }

    function drawProjectiles() {
      for (const p of projectiles) {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }

    function drawParticles() {
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }

    function drawScoreboard() {
      const left = units.filter(u => u.side === 'left').length;
      const right = units.filter(u => u.side === 'right').length;
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(10, 10, 140, 28); ctx.fillRect(W-150, 10, 140, 28);
      ctx.fillStyle = '#2d8a4e'; ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`🌿 Elves/Tribe: ${left}`, 18, 29);
      ctx.fillStyle = '#7B3F9E';
      ctx.fillText(`Satyrs/Rabbits: ${right}`, W-143, 29);
    }

    for (let i = 0; i < 5; i++) {
      addUnit(['elf','centaur','tribesperson'][i%3], 'left');
      addUnit(['satyr','rabbit'][i%2], 'right');
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawBg();
      tick();
      units.sort((a,b) => a.y - b.y);
      for (const u of units) drawUnit(u);
      drawProjectiles();
      drawParticles();
      drawScoreboard();
      requestAnimationFrame(loop);
    }
        loop();
}