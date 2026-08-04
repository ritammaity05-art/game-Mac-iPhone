/* AirGamePad Socket Manager - Shared Socket.io Connection & Latency Layer */

class AirSocket {
  constructor() {
    this.socket = null;
    this.roomId = null;
    this.role = null; // 'host' | 'controller'
    this.latency = 0;
    this.pingInterval = null;
    this.onConnectCallbacks = [];
    this.onDisconnectCallbacks = [];
    this.onLatencyUpdate = null;
  }

  init() {
    if (this.socket) return;
    this.socket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500
    });

    this.socket.on('connect', () => {
      console.log('⚡ Socket.io connected. Socket ID:', this.socket.id);
      this.startPingLoop();
      this.onConnectCallbacks.forEach((cb) => cb(this.socket.id));
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket.io disconnected:', reason);
      this.stopPingLoop();
      this.onDisconnectCallbacks.forEach((cb) => cb(reason));
    });

    return this.socket;
  }

  onConnect(cb) {
    this.onConnectCallbacks.push(cb);
  }

  onDisconnect(cb) {
    this.onDisconnectCallbacks.push(cb);
  }

  startPingLoop() {
    this.stopPingLoop();
    this.pingInterval = setInterval(() => {
      if (!this.socket || !this.socket.connected) return;
      const start = Date.now();
      this.socket.emit('ping_check', start, (response) => {
        const end = Date.now();
        this.latency = end - start;
        if (typeof this.onLatencyUpdate === 'function') {
          this.onLatencyUpdate(this.latency);
        }
      });
    }, 1000);
  }

  stopPingLoop() {
    if (this.pingInterval) clearInterval(this.pingInterval);
  }

  createRoom(customCode, callback) {
    this.role = 'host';
    this.socket.emit('create_room', { roomCode: customCode }, (res) => {
      if (res && res.success) {
        this.roomId = res.roomId;
      }
      if (callback) callback(res);
    });
  }

  joinRoom(roomId, deviceInfo, callback) {
    this.role = 'controller';
    this.socket.emit('join_room', { roomId, deviceInfo }, (res) => {
      if (res && res.success) {
        this.roomId = res.roomId;
      }
      if (callback) callback(res);
    });
  }

  sendInput(type, payload) {
    if (!this.socket || !this.socket.connected) return;
    this.socket.emit('controller_input', {
      type,
      payload,
      timestamp: Date.now()
    });
  }
}

// Global Singleton Instance
window.airSocket = new AirSocket();
