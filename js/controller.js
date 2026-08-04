/* AirGamePad Mobile Controller Engine - Lightweight & Ultra-Smooth for iOS Safari */

(function () {
  let socketManager = null;
  let socket = null;
  let currentRoomId = '';

  let audioCtx = null;
  function playClickSFX(freq = 440) {
    try {
      if (!audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtx = new AudioCtx();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (audioCtx) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
      }
    } catch (e) {}
  }

  function triggerVibration() {
    if (navigator.vibrate) {
      try { navigator.vibrate(15); } catch (e) {}
    }
  }

  window.promptRoomCode = function() {
    const modal = document.getElementById('room-prompt-modal');
    if (modal) modal.classList.add('active');
  };

  window.submitMobileRoomCode = function() {
    const input = document.getElementById('mobile-room-input');
    const code = input ? input.value.trim() : '';
    if (code.length === 6) {
      connectToRoom(code);
    } else {
      alert('Please enter a valid 6-digit Room Code!');
    }
  };

  function connectToRoom(roomId) {
    if (!socketManager) return;
    currentRoomId = roomId;
    const statusText = document.getElementById('ctrl-status-text');
    const statusDot = document.getElementById('ctrl-dot');
    const roomPill = document.getElementById('ctrl-room-pill');
    const modal = document.getElementById('room-prompt-modal');

    if (statusText) statusText.innerText = 'Connecting...';

    socketManager.joinRoom(roomId, { userAgent: navigator.userAgent }, (res) => {
      if (res && res.success) {
        if (statusDot) statusDot.className = 'dot connected';
        if (statusText) statusText.innerText = 'Connected';
        if (roomPill) roomPill.innerText = `ROOM: ${roomId}`;
        if (modal) modal.classList.remove('active');
        triggerVibration();
        playClickSFX(800);
      } else {
        if (statusDot) statusDot.className = 'dot disconnected';
        if (statusText) statusText.innerText = 'Code Error';
        alert(res.error || 'Invalid 6-Digit Room Code!');
      }
    });
  }

  function initController() {
    socketManager = window.airSocket;
    if (!socketManager) return;
    socket = socketManager.init();

    const urlParams = new URLSearchParams(window.location.search);
    const paramRoom = urlParams.get('room') || '';
    const modal = document.getElementById('room-prompt-modal');

    if (paramRoom && paramRoom.length === 6) {
      document.getElementById('mobile-room-input').value = paramRoom;
      connectToRoom(paramRoom);
    } else {
      if (modal) modal.classList.add('active');
    }

    const pingLabel = document.getElementById('ctrl-ping');
    const batteryLabel = document.getElementById('ctrl-battery');
    const themeSelect = document.getElementById('theme-select');

    socketManager.onConnect(() => {
      if (currentRoomId) connectToRoom(currentRoomId);
    });

    socketManager.onDisconnect(() => {
      const statusDot = document.getElementById('ctrl-dot');
      const statusText = document.getElementById('ctrl-status-text');
      if (statusDot) statusDot.className = 'dot disconnected';
      if (statusText) statusText.innerText = 'Disconnected';
    });

    socketManager.onLatencyUpdate = (ms) => {
      if (pingLabel) pingLabel.innerText = `${ms} ms`;
    };

    if (navigator.getBattery) {
      navigator.getBattery().then((b) => {
        const updateB = () => {
          if (batteryLabel) batteryLabel.innerText = `${Math.round(b.level * 100)}% ${b.charging ? '⚡' : ''}`;
        };
        updateB();
        b.addEventListener('levelchange', updateB);
      }).catch(() => {});
    }

    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        document.body.className = `controller-body theme-${e.target.value}`;
      });
    }

    // 360° Analog Joystick
    const joystickBase = document.getElementById('joystick-base');
    const joystickStick = document.getElementById('joystick-stick');
    let joystickActive = false;
    let joystickTouchId = null;
    let baseCenter = { x: 0, y: 0 };
    const maxR = 50;

    function handleJoystickMove(clientX, clientY) {
      let dx = clientX - baseCenter.x;
      let dy = clientY - baseCenter.y;
      let dist = Math.hypot(dx, dy);

      if (dist > maxR) {
        const angle = Math.atan2(dy, dx);
        dx = Math.cos(angle) * maxR;
        dy = Math.sin(angle) * maxR;
        dist = maxR;
      }

      if (joystickStick) {
        joystickStick.style.transform = `translate(${dx}px, ${dy}px)`;
      }

      socketManager.sendInput('joystick', {
        x: Number((dx / maxR).toFixed(2)),
        y: Number((dy / maxR).toFixed(2)),
        distance: Number((dist / maxR).toFixed(2)),
        angle: Math.round((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360)
      });
    }

    function handleJoystickReset() {
      if (joystickStick) {
        joystickStick.style.transform = 'translate(0px, 0px)';
      }
      joystickActive = false;
      joystickTouchId = null;
      socketManager.sendInput('joystick', { x: 0, y: 0, distance: 0, angle: 0 });
    }

    if (joystickBase) {
      joystickBase.addEventListener('touchstart', (e) => {
        const touch = e.changedTouches[0];
        if (touch && !joystickActive) {
          joystickActive = true;
          joystickTouchId = touch.identifier;
          const rect = joystickBase.getBoundingClientRect();
          baseCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          triggerVibration();
          playClickSFX(300);
          handleJoystickMove(touch.clientX, touch.clientY);
        }
      }, { passive: true });

      joystickBase.addEventListener('touchmove', (e) => {
        if (!joystickActive) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === joystickTouchId) {
            handleJoystickMove(t.clientX, t.clientY);
            break;
          }
        }
      }, { passive: true });

      joystickBase.addEventListener('touchend', (e) => {
        if (joystickActive) {
          for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === joystickTouchId) {
              handleJoystickReset();
              break;
            }
          }
        }
      }, { passive: true });

      joystickBase.addEventListener('touchcancel', () => {
        handleJoystickReset();
      }, { passive: true });
    }

    // Action Buttons
    const activeBtnSet = new Set();
    const btnElems = document.querySelectorAll('[data-btn]');

    btnElems.forEach((btn) => {
      const btnName = btn.getAttribute('data-btn');

      const onPress = (e) => {
        if (!activeBtnSet.has(btnName)) {
          activeBtnSet.add(btnName);
          btn.classList.add('active');
          triggerVibration();
          playClickSFX(500);
          socketManager.sendInput('button_down', { button: btnName });
        }
      };

      const onRelease = (e) => {
        if (activeBtnSet.has(btnName)) {
          activeBtnSet.delete(btnName);
          btn.classList.remove('active');
          socketManager.sendInput('button_up', { button: btnName });
        }
      };

      btn.addEventListener('touchstart', onPress, { passive: true });
      btn.addEventListener('touchend', onRelease, { passive: true });
      btn.addEventListener('touchcancel', onRelease, { passive: true });

      btn.addEventListener('mousedown', onPress);
      btn.addEventListener('mouseup', onRelease);
    });

    // Gyroscope
    let gyroOn = false;
    window.toggleMotionSensors = async function () {
      const btn = document.getElementById('btn-motion-toggle');
      if (!gyroOn) {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          try {
            const perm = await DeviceOrientationEvent.requestPermission();
            if (perm !== 'granted') return alert('Permission denied');
          } catch (err) {}
        }
        gyroOn = true;
        if (btn) { btn.innerText = 'Gyro: ON'; btn.style.background = 'var(--accent-green)'; btn.style.color = '#000'; }
      } else {
        gyroOn = false;
        if (btn) { btn.innerText = 'Gyro: OFF'; btn.style.background = ''; btn.style.color = ''; }
        socketManager.sendInput('motion', { enabled: false, tiltX: 0, tiltY: 0 });
      }
    };

    window.addEventListener('deviceorientation', (e) => {
      if (!gyroOn) return;
      const tiltX = Math.min(Math.max((e.gamma || 0) / 30, -1), 1);
      const tiltY = Math.min(Math.max((e.beta || 0) / 30, -1), 1);
      socketManager.sendInput('motion', { enabled: true, tiltX, tiltY });
    }, { passive: true });

    // D-Pad Toggle
    window.toggleDpadLayout = function () {
      const joy = document.getElementById('joystick-base');
      const dpad = document.getElementById('dpad-container');
      const btn = document.getElementById('btn-dpad-toggle');
      if (dpad) {
        const isDpad = dpad.classList.toggle('active');
        if (joy) joy.style.display = isDpad ? 'none' : 'flex';
        if (btn) btn.innerText = isDpad ? 'Joystick Mode' : 'D-Pad Mode';
      }
    };

    // Fullscreen
    window.toggleFullscreen = function () {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initController);
  } else {
    initController();
  }
})();
