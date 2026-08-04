const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingInterval: 1000,
  pingTimeout: 5000,
  transports: ['websocket', 'polling']
});

const PORT = process.env.PORT || 3000;

// Helper to get all non-internal IPv4 addresses
function getAllIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const interfaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({ name: interfaceName, address: iface.address });
      }
    }
  }
  return addresses.length > 0 ? addresses : [{ name: 'lo', address: '127.0.0.1' }];
}

const ALL_IPS = getAllIpAddresses();
const PRIMARY_IP = ALL_IPS.find(i => !i.address.startsWith('169.254')) ? ALL_IPS.find(i => !i.address.startsWith('169.254')).address : ALL_IPS[0].address;

// Serve static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

app.get('/controller', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'controller.html'));
});

// Dynamic QR Code API Endpoint
app.get('/api/qr', async (req, res) => {
  try {
    const text = req.query.text || `http://${PRIMARY_IP}:${PORT}/controller`;
    const qrDataUrl = await QRCode.toDataURL(text, {
      margin: 2,
      color: {
        dark: '#00F2FE',
        light: '#0b0f19'
      },
      width: 300
    });
    res.json({ success: true, qrDataUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Info Endpoint
app.get('/api/info', (req, res) => {
  res.json({
    localIp: PRIMARY_IP,
    allIps: ALL_IPS,
    port: PORT,
    url: `http://${PRIMARY_IP}:${PORT}`
  });
});

// Active Rooms State
const rooms = new Map();

setInterval(() => {
  rooms.forEach((room) => {
    room.lastEventRate = room.eventCount;
    room.eventCount = 0;
  });
}, 1000);

function generateRoomCode() {
  let code;
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (rooms.has(code));
  return code;
}

io.on('connection', (socket) => {
  let userRoomId = null;
  let userRole = null;

  socket.on('ping_check', (clientTimestamp, callback) => {
    if (typeof callback === 'function') {
      callback({
        serverTimestamp: Date.now(),
        clientTimestamp
      });
    }
  });

  socket.on('create_room', async (data, ack) => {
    const customCode = data && data.roomCode ? String(data.roomCode).trim() : null;
    const roomId = customCode && customCode.length === 6 ? customCode : generateRoomCode();
    
    rooms.set(roomId, {
      roomId,
      hostSocketId: socket.id,
      controllerSocketIds: new Set(),
      created: new Date(),
      eventCount: 0,
      lastEventRate: 0
    });

    socket.join(`room:${roomId}`);
    userRoomId = roomId;
    userRole = 'host';

    const controllerUrl = `http://${PRIMARY_IP}:${PORT}/controller.html?room=${roomId}`;
    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(controllerUrl, {
        margin: 2,
        color: { dark: '#00F2FE', light: '#0b0f19' },
        width: 300
      });
    } catch (e) {
      console.error('Failed to generate QR:', e);
    }

    const payload = {
      success: true,
      roomId,
      localIp: PRIMARY_IP,
      allIps: ALL_IPS,
      port: PORT,
      controllerUrl,
      qrDataUrl
    };

    if (typeof ack === 'function') ack(payload);
    socket.emit('room_created', payload);
  });

  socket.on('join_room', (data, ack) => {
    const roomId = data && data.roomId ? String(data.roomId).trim() : '';
    const room = rooms.get(roomId);

    if (!room) {
      const errorResponse = { success: false, error: 'Invalid or expired Room Code!' };
      if (typeof ack === 'function') ack(errorResponse);
      return socket.emit('room_join_error', errorResponse);
    }

    socket.join(`room:${roomId}`);
    userRoomId = roomId;
    userRole = 'controller';
    room.controllerSocketIds.add(socket.id);

    const successPayload = {
      success: true,
      roomId,
      deviceInfo: data.deviceInfo || {},
      connectedCount: room.controllerSocketIds.size
    };

    if (typeof ack === 'function') ack(successPayload);
    socket.emit('room_joined', successPayload);

    io.to(room.hostSocketId).emit('controller_connected', {
      controllerSocketId: socket.id,
      deviceInfo: data.deviceInfo || {},
      connectedCount: room.controllerSocketIds.size
    });
  });

  socket.on('controller_input', (inputData) => {
    if (!userRoomId || !rooms.has(userRoomId)) return;
    const room = rooms.get(userRoomId);
    room.eventCount++;

    io.to(room.hostSocketId).emit('game_input', {
      ...inputData,
      senderId: socket.id,
      serverTime: Date.now()
    });
  });

  socket.on('host_telemetry', (telemetryData) => {
    if (!userRoomId || userRole !== 'host') return;
    socket.to(`room:${userRoomId}`).emit('game_telemetry', telemetryData);
  });

  socket.on('admin_query', (data, ack) => {
    const roomDetails = [];
    rooms.forEach((r) => {
      roomDetails.push({
        roomId: r.roomId,
        hostSocketId: r.hostSocketId,
        controllersCount: r.controllerSocketIds.size,
        eventsPerSec: r.lastEventRate,
        created: r.created
      });
    });

    const payload = {
      localIp: PRIMARY_IP,
      allIps: ALL_IPS,
      port: PORT,
      totalRooms: rooms.size,
      totalSockets: io.sockets.sockets.size,
      rooms: roomDetails
    };

    if (typeof ack === 'function') ack(payload);
    socket.emit('admin_response', payload);
  });

  socket.on('disconnect', () => {
    if (userRoomId && rooms.has(userRoomId)) {
      const room = rooms.get(userRoomId);
      if (userRole === 'host') {
        socket.to(`room:${userRoomId}`).emit('host_disconnected');
        rooms.delete(userRoomId);
      } else if (userRole === 'controller') {
        room.controllerSocketIds.delete(socket.id);
        io.to(room.hostSocketId).emit('controller_disconnected', {
          controllerSocketId: socket.id,
          remainingControllers: room.controllerSocketIds.size
        });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AirGamePad Server running!`);
  console.log(`💻 Host MacBook URL:   http://localhost:${PORT}/game.html`);
  console.log(`📱 Primary Mobile URL: http://${PRIMARY_IP}:${PORT}/controller.html`);
  console.log(`🌐 Available Network IPs:`);
  ALL_IPS.forEach(ip => {
    console.log(`   - http://${ip.address}:${PORT} (${ip.name})`);
  });
  console.log(`=======================================================`);
});
