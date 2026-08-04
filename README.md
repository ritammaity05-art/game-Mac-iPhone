# AirGamePad 🚀

**AirGamePad** is a complete, production-quality wireless mobile game controller system that turns your iPhone or Android smartphone into a low-latency, responsive game controller for browser games running on your MacBook or PC.

Built with **HTML5, CSS3 Glassmorphic UI, Vanilla JavaScript, Node.js, Express, and Socket.io**, it operates with sub-20ms latency over your local Wi-Fi network.

---

## 🌟 Key Features

1. **Automatic IP Detection & 1-Tap QR Code Pairing**:
   - Displays your local Wi-Fi IPv4 address (`http://192.168.1.X:3000`) on server launch.
   - Host generates a random 6-digit room code & instant QR Code for single-tap mobile pairing.
2. **Professional Mobile Controller**:
   - 360° Analog Joystick with vector math and return-to-center spring animation.
   - Action Buttons (A, B, X, Y), D-Pad, Triggers (L1, R1, L2, R2), System Buttons (Start, Select, Turbo, Pause, Home).
   - Multi-Touch Engine supporting up to 5 simultaneous finger touches.
   - Haptic Feedback (`navigator.vibrate`) & Web Audio API tactile click synth.
3. **Motion Control Steering & Touchpad Gestures**:
   - Uses iPhone `DeviceOrientation` (gyroscope & accelerometer) for tilt steering and motion aiming.
   - Touchpad mode supporting 1-finger swipe cursor movement and tap-to-click.
4. **60 FPS HTML5 Canvas Action Game ("Air Striker: Cyber Core")**:
   - Integrated arcade game running on the MacBook.
   - Features player spaceship, WASD / 360° joystick controls, enemy AI waves, gold coins, health crates, and particle explosions.
   - 100% self-contained Web Audio SFX synth (lasers, explosions, coins, dash sounds).
5. **Synthetic Keyboard Emulation**:
   - Controller events seamlessly dispatch native DOM `KeyboardEvent` (`keydown`/`keyup`) on the browser window:
     - Joystick / D-Pad ➔ `WASD` / `Arrow Keys`
     - A Button ➔ `Space` (Shoot)
     - B Button ➔ `Shift` (Dash)
     - X Button ➔ `E` (Special Attack)
     - Y Button ➔ `Q` (Shield)
6. **Secret Admin Telemetry Dashboard (`Ctrl + Shift + A`)**:
   - Hidden real-time dashboard on the game screen displaying connected devices, room ID, socket ping, input events/sec rate, active pressed buttons, and live socket event logs.
7. **Custom Controller Themes**:
   - Switch between Cyberpunk Dark, Xbox Green, PlayStation Cobalt, and Synthwave Neon themes on the fly.

---

## 📁 Folder Structure

```
/AirGamePad
│── server.js          # Express & Socket.io server with IP detection & Room manager
│── package.json       # Project metadata & dependencies
│── README.md          # Comprehensive documentation
│
├── /public
│   ├── index.html     # Main launcher landing page
│   ├── game.html      # MacBook game view & pairing overlay
│   └── controller.html# iPhone virtual gamepad controller layout
│
├── /css
│   ├── style.css      # Core design tokens, dark theme & glassmorphic UI
│   ├── game.css       # MacBook game layout, HUD & Admin panel styles
│   └── controller.css # Mobile gamepad CSS, buttons, joystick & themes
│
└── /js
    ├── socket.js      # Client Socket.io manager, latency ping/pong & room joiner
    ├── game.js        # 60 FPS HTML5 Canvas game engine, SFX synth & keyboard emulator
    └── controller.js  # iPhone gamepad engine, multi-touch, joystick, haptics & gyro
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v16.0.0 or higher) installed on your MacBook.
- iPhone and MacBook connected to the **same Wi-Fi network**.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
The console will display:
```
=======================================================
🚀 AirGamePad Server running!
💻 Host MacBook URL:   http://localhost:3000/game.html
📱 iPhone Controller: http://192.168.1.10:3000/controller.html
🌐 Local Wi-Fi URL:    http://192.168.1.10:3000
=======================================================
```

---

## 📱 How to Connect Your Phone

1. Open **`http://localhost:3000/game.html`** on your MacBook browser.
2. Scan the on-screen **QR Code** using your iPhone Camera app OR open `http://<YOUR-LOCAL-IP>:3000/controller.html` in Safari/Chrome.
3. Enter the 6-digit **Room Code** shown on the MacBook screen.
4. Your iPhone will instantly pair and display the virtual controller!

---

## 🛠️ Secret Admin Telemetry Dashboard

Press **`Ctrl + Shift + A`** on the MacBook game screen at any time to open the hidden real-time telemetry panel.

It displays:
- Active Room Code & Local IP
- Total Connected Devices
- Input Events per second rate
- Real-time Socket Latency (ping in ms)
- Game FPS gauge
- Active Pressed Buttons indicators
- Live Socket event log stream

---

## 🚀 Socket.io Architecture & Latency Optimization

- **Room Isolation**: Each game session generates an isolated socket room (`room:XXXXXX`).
- **Volatiles & Compact Payloads**: High-frequency motion and joystick events use lightweight JSON packets with normalized values (`-1.0` to `1.0`).
- **Sub-20ms Direct Forwarding**: Input packets are relayed directly to the host socket without database overhead.
- **Heartbeat & Reconnection**: Socket.io maintains an automatic 1-second ping/pong cycle with instant auto-reconnect fallback.

---

## 🔮 Future Enhancements
- WebRTC Peer-to-Peer direct data channels for sub-5ms latency.
- Custom button remapping UI.
- Multiplayer Co-Op mode (2-4 iPhones connected to 1 MacBook simultaneously).

---

## 📄 License
MIT License. Created for AirGamePad.
