/* AirGamePad Game JS - 60 FPS Canvas Game Engine, Keyboard Emulator & Secret Admin Panel */

document.addEventListener('DOMContentLoaded', () => {
  const socketManager = window.airSocket;
  const socket = socketManager.init();

  // Canvas Setup
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  // Set crisp HD canvas dimensions
  canvas.width = 1280;
  canvas.height = 720;

  // Web Audio SFX Synthesizer
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playLaserSFX() {
    try {
      const ac = getAudioCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ac.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ac.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ac.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.12);
    } catch(e) {}
  }

  function playExplosionSFX() {
    try {
      const ac = getAudioCtx();
      const bufferSize = ac.sampleRate * 0.25;
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

      const whiteNoise = ac.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ac.currentTime);
      filter.frequency.linearRampToValueAtTime(50, ac.currentTime + 0.25);

      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.3, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      whiteNoise.start();
    } catch(e) {}
  }

  function playCoinSFX() {
    try {
      const ac = getAudioCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ac.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ac.currentTime + 0.08); // E6
      gain.gain.setValueAtTime(0.15, ac.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ac.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.2);
    } catch(e) {}
  }

  function playDashSFX() {
    try {
      const ac = getAudioCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ac.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ac.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.15);
    } catch(e) {}
  }

  // Keyboard Emulation Mapping
  const KEY_MAPPINGS = {
    'A': { code: 'Space', key: ' ' },
    'B': { code: 'ShiftLeft', key: 'Shift' },
    'X': { code: 'KeyE', key: 'e' },
    'Y': { code: 'KeyQ', key: 'q' },
    'DPAD_UP': { code: 'ArrowUp', key: 'ArrowUp' },
    'DPAD_DOWN': { code: 'ArrowDown', key: 'ArrowDown' },
    'DPAD_LEFT': { code: 'ArrowLeft', key: 'ArrowLeft' },
    'DPAD_RIGHT': { code: 'ArrowRight', key: 'ArrowRight' },
    'START': { code: 'Enter', key: 'Enter' },
    'SELECT': { code: 'Tab', key: 'Tab' },
    'PAUSE': { code: 'KeyP', key: 'p' },
    'L1': { code: 'Digit1', key: '1' },
    'R1': { code: 'Digit2', key: '2' },
    'L2': { code: 'Digit3', key: '3' },
    'R2': { code: 'Digit4', key: '4' }
  };

  function dispatchVirtualKey(eventType, buttonName) {
    const map = KEY_MAPPINGS[buttonName];
    if (!map) return;
    const event = new KeyboardEvent(eventType, {
      bubbles: true,
      cancelable: true,
      key: map.key,
      code: map.code,
      charCode: 0,
      keyCode: 0
    });
    window.dispatchEvent(event);
  }

  // Admin Dashboard State
  const activeButtonsSet = new Set();
  let adminLogEntries = [];
  let totalInputEventsCount = 0;
  let currentEventRate = 0;
  let lastEventCheckTime = Date.now();

  function logAdmin(text) {
    const timestamp = new Date().toLocaleTimeString();
    adminLogEntries.unshift(`[${timestamp}] ${text}`);
    if (adminLogEntries.length > 25) adminLogEntries.pop();

    const logBox = document.getElementById('admin-logs');
    if (logBox) {
      logBox.innerHTML = adminLogEntries.map(e => `<div class="admin-log-entry">${e}</div>`).join('');
    }
  }

  // Socket Connection & Room Creation
  socketManager.onConnect(() => {
    socketManager.createRoom(null, (res) => {
      if (res && res.success) {
        document.getElementById('display-room-code').innerText = res.roomId;
        document.getElementById('display-code-inline').innerText = res.roomId;
        document.getElementById('display-local-url').innerText = `http://${res.localIp}:${res.port}`;
        document.getElementById('admin-room-id').innerText = res.roomId;
        document.getElementById('admin-local-ip').innerText = `${res.localIp}:${res.port}`;
        if (res.qrDataUrl) {
          document.getElementById('qr-code-img').src = res.qrDataUrl;
        }
        logAdmin(`Room created: ${res.roomId} at ${res.localIp}:${res.port}`);
      }
    });
  });

  socketManager.onLatencyUpdate = (ms) => {
    document.getElementById('hud-ping').innerText = `${ms} ms`;
    document.getElementById('admin-latency').innerText = `${ms} ms`;
  };

  socket.on('controller_connected', (data) => {
    document.getElementById('pairing-overlay').classList.add('hidden');
    document.getElementById('game-status-dot').className = 'dot connected';
    document.getElementById('game-status-text').innerText = 'iPhone Connected';
    document.getElementById('admin-devices-count').innerText = data.connectedCount;
    logAdmin(`iPhone controller connected (${data.controllerSocketId})`);
  });

  socket.on('controller_disconnected', () => {
    document.getElementById('game-status-dot').className = 'dot disconnected';
    document.getElementById('game-status-text').innerText = 'Controller Disconnected';
    document.getElementById('admin-devices-count').innerText = '0';
    logAdmin(`iPhone controller disconnected.`);
  });

  // Receive Ultra-Low Latency Game Inputs
  socket.on('game_input', (inputData) => {
    totalInputEventsCount++;

    if (inputData.type === 'joystick') {
      const { x, y } = inputData.payload;
      player.joystickX = x;
      player.joystickY = y;
    } else if (inputData.type === 'button_down') {
      const btn = inputData.payload.button;
      activeButtonsSet.add(btn);
      dispatchVirtualKey('keydown', btn);

      if (btn === 'A') player.shoot();
      if (btn === 'B') player.dash();
      if (btn === 'X') player.triggerSpecial();
      if (btn === 'Y') player.triggerShield();
    } else if (inputData.type === 'button_up') {
      const btn = inputData.payload.button;
      activeButtonsSet.delete(btn);
      dispatchVirtualKey('keyup', btn);
    } else if (inputData.type === 'motion') {
      if (inputData.payload.enabled) {
        player.motionTiltX = inputData.payload.tiltX;
        player.motionTiltY = inputData.payload.tiltY;
      } else {
        player.motionTiltX = 0;
        player.motionTiltY = 0;
      }
    }

    // Update Admin active buttons bar
    const bar = document.getElementById('admin-active-buttons');
    if (bar) {
      if (activeButtonsSet.size === 0) {
        bar.innerHTML = `<span class="active-btn-pill" style="background: rgba(255,255,255,0.1); color: var(--text-muted);">None</span>`;
      } else {
        bar.innerHTML = Array.from(activeButtonsSet).map(b => `<span class="active-btn-pill">${b}</span>`).join('');
      }
    }
  });

  // Calculate Events/Sec
  setInterval(() => {
    currentEventRate = totalInputEventsCount;
    totalInputEventsCount = 0;
    const rateElem = document.getElementById('admin-events-rate');
    if (rateElem) rateElem.innerText = `${currentEventRate} /s`;
  }, 1000);

  // Keyboard Event Listeners for WASD Desktop Controls
  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    // Secret Admin Panel Hotkey: Ctrl + Shift + A
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
      e.preventDefault();
      toggleAdminPanel();
    }
    if (e.code === 'Space') player.shoot();
    if (e.code === 'ShiftLeft') player.dash();
  });
  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  window.toggleAdminPanel = function(forceState) {
    const adminPanel = document.getElementById('admin-panel');
    if (typeof forceState === 'boolean') {
      adminPanel.classList.toggle('visible', forceState);
    } else {
      adminPanel.classList.toggle('visible');
    }
  };

  // 60 FPS HTML5 Canvas Action Game Engine
  class Player {
    constructor() {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.radius = 24;
      this.speed = 7;
      this.health = 100;
      this.maxHealth = 100;
      this.score = 0;
      this.coins = 0;
      this.joystickX = 0;
      this.joystickY = 0;
      this.motionTiltX = 0;
      this.motionTiltY = 0;
      this.dashTimer = 0;
      this.shieldTimer = 0;
      this.lastShot = 0;
    }

    shoot() {
      const now = Date.now();
      if (now - this.lastShot < 140) return;
      this.lastShot = now;
      playLaserSFX();
      bullets.push(new Bullet(this.x, this.y - this.radius, 0, -14));
      bullets.push(new Bullet(this.x - 12, this.y - this.radius, -2, -13));
      bullets.push(new Bullet(this.x + 12, this.y - this.radius, 2, -13));
    }

    dash() {
      if (this.dashTimer <= 0) {
        this.dashTimer = 18; // frames
        playDashSFX();
        // Spawn dash particles
        for (let i = 0; i < 15; i++) {
          particles.push(new Particle(this.x, this.y, '#00f2fe', 8));
        }
      }
    }

    triggerSpecial() {
      playExplosionSFX();
      for (let angle = 0; angle < 360; angle += 20) {
        const rad = angle * Math.PI / 180;
        bullets.push(new Bullet(this.x, this.y, Math.cos(rad) * 12, Math.sin(rad) * 12));
      }
    }

    triggerShield() {
      this.shieldTimer = 120; // 2 seconds
    }

    update() {
      let moveX = 0;
      let moveY = 0;

      // WASD Keys
      if (keys['KeyW'] || keys['ArrowUp']) moveY -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) moveY += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) moveX -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) moveX += 1;

      // Mobile 360° Joystick & Motion Tilt override
      if (Math.abs(this.joystickX) > 0.05 || Math.abs(this.joystickY) > 0.05) {
        moveX = this.joystickX;
        moveY = this.joystickY;
      } else if (Math.abs(this.motionTiltX) > 0.05 || Math.abs(this.motionTiltY) > 0.05) {
        moveX = this.motionTiltX;
        moveY = this.motionTiltY;
      }

      const currentSpeed = this.dashTimer > 0 ? this.speed * 2.2 : this.speed;
      this.x += moveX * currentSpeed;
      this.y += moveY * currentSpeed;

      if (this.dashTimer > 0) this.dashTimer--;
      if (this.shieldTimer > 0) this.shieldTimer--;

      // Boundary clamp
      this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
      this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

      // Continuous shooting if space held
      if (keys['Space']) this.shoot();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);

      // Draw Shield Ring
      if (this.shieldTimer > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 14, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 15;
        ctx.stroke();
      }

      // Draw Cyber Ship (Triangle spaceship design)
      ctx.beginPath();
      ctx.moveTo(0, -this.radius - 4);
      ctx.lineTo(this.radius + 4, this.radius + 4);
      ctx.lineTo(0, this.radius - 6);
      ctx.lineTo(-this.radius - 4, this.radius + 4);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, -this.radius, 0, this.radius);
      grad.addColorStop(0, '#00f2fe');
      grad.addColorStop(1, '#7f00ff');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 20;
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Engine Thruster Flame
      ctx.beginPath();
      ctx.moveTo(-10, this.radius);
      ctx.lineTo(0, this.radius + 15 + Math.random() * 10);
      ctx.lineTo(10, this.radius);
      ctx.fillStyle = '#ff007f';
      ctx.fill();

      ctx.restore();
    }
  }

  class Bullet {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.radius = 4;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 10;
      ctx.fill();
    }
  }

  class Enemy {
    constructor() {
      this.x = Math.random() * (canvas.width - 60) + 30;
      this.y = -40;
      this.radius = 20;
      this.speed = 2.5 + Math.random() * 2;
      this.hp = 3;
    }

    update() {
      this.y += this.speed;
      this.x += Math.sin(this.y / 30) * 2;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ff007f';
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.restore();
    }
  }

  class Coin {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 10;
      this.rotation = 0;
    }

    update() {
      this.y += 1.5;
      this.rotation += 0.1;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffcf00';
      ctx.shadowColor = '#ffcf00';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
  }

  class Particle {
    constructor(x, y, color, size = 4) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = Math.random() * size + 2;
      this.vx = (Math.random() - 0.5) * 8;
      this.vy = (Math.random() - 0.5) * 8;
      this.alpha = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.03;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  // Entities Lists
  const player = new Player();
  let bullets = [];
  let enemies = [];
  let coins = [];
  let particles = [];

  let frameCount = 0;
  let lastFpsTime = Date.now();
  let currentFps = 60;

  // Game Loop
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate FPS
    frameCount++;
    const now = Date.now();
    if (now - lastFpsTime >= 1000) {
      currentFps = frameCount;
      frameCount = 0;
      lastFpsTime = now;
      document.getElementById('hud-fps').innerText = currentFps;
      document.getElementById('admin-fps').innerText = `${currentFps} FPS`;

      // Send telemetry back to host socket
      socket.emit('host_telemetry', {
        fps: currentFps,
        score: player.score,
        health: player.health
      });
    }

    // Spawn Enemies
    if (Math.random() < 0.03) {
      enemies.push(new Enemy());
    }

    // Update Player
    player.update();
    player.draw();

    // Update Bullets
    bullets.forEach((b, bi) => {
      b.update();
      b.draw();
      if (b.y < -20 || b.y > canvas.height + 20 || b.x < -20 || b.x > canvas.width + 20) {
        bullets.splice(bi, 1);
      }
    });

    // Update Enemies & Collisions
    enemies.forEach((enemy, ei) => {
      enemy.update();
      enemy.draw();

      // Check collision with Player
      const distToPlayer = Math.hypot(enemy.x - player.x, enemy.y - player.y);
      if (distToPlayer < enemy.radius + player.radius) {
        if (player.shieldTimer <= 0 && player.dashTimer <= 0) {
          player.health -= 10;
          playExplosionSFX();
          if (player.health < 0) player.health = 0;
        }
        for (let i = 0; i < 10; i++) particles.push(new Particle(enemy.x, enemy.y, '#ff007f'));
        enemies.splice(ei, 1);
      }

      // Check collision with Bullets
      bullets.forEach((b, bi) => {
        const distToBullet = Math.hypot(enemy.x - b.x, enemy.y - b.y);
        if (distToBullet < enemy.radius + b.radius) {
          enemy.hp--;
          bullets.splice(bi, 1);

          if (enemy.hp <= 0) {
            playExplosionSFX();
            player.score += 100;
            coins.push(new Coin(enemy.x, enemy.y));
            for (let i = 0; i < 16; i++) particles.push(new Particle(enemy.x, enemy.y, '#ff007f'));
            enemies.splice(ei, 1);
          }
        }
      });

      if (enemy.y > canvas.height + 40) enemies.splice(ei, 1);
    });

    // Update Coins
    coins.forEach((c, ci) => {
      c.update();
      c.draw();

      const dist = Math.hypot(c.x - player.x, c.y - player.y);
      if (dist < c.radius + player.radius) {
        player.coins++;
        player.score += 50;
        playCoinSFX();
        coins.splice(ci, 1);
      } else if (c.y > canvas.height + 20) {
        coins.splice(ci, 1);
      }
    });

    // Update Particles
    particles.forEach((p, pi) => {
      p.update();
      p.draw();
      if (p.alpha <= 0) particles.splice(pi, 1);
    });

    // Update HUD Elements
    document.getElementById('hud-score').innerText = String(player.score).padStart(6, '0');
    document.getElementById('hud-coins').innerText = `🪙 ${player.coins}`;
    document.getElementById('hud-health-fill').style.width = `${(player.health / player.maxHealth) * 100}%`;

    requestAnimationFrame(gameLoop);
  }

  // Start game loop
  requestAnimationFrame(gameLoop);
});
