const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('wait_payment', (paymentId) => {
    setTimeout(() => {
      socket.emit('payment_approved', {
        id: paymentId,
        status: 'approved',
        amount: 100.00
      });
    }, 10000);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(3002, () => {
  console.log('Servidor WebSocket rodando na porta 3002');
});