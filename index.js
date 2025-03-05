import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import { Routers } from './src/routes/index.js';
import { checkToken } from './src/middleware/checkToken.js';
import { chatFunc } from './src/function/chat.js';
import { Server } from 'socket.io';
dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(checkToken);

const port = process.env.PORT ?? '8081';
const limit = { limit: '50mb' };
app.use(bodyParser.json(limit));

const io = new Server(server, {
	cors: {
		origin: '*',
	}
});

io.on('connection', (socket) => {
	console.log(`User connected: ${socket.id}`);

	socket.on('joinRoom', (roomId) => {
		socket.join(roomId);
		console.log(`User ${socket.id} joined room: ${roomId}`);
	});

	socket.on('sendMessage', (data) => {
		const respone = chatFunc.saveChat(data);
		console.log('saveChat', respone)
		io.to(data.roomId).emit('receiveMessage', data)
	});

	socket.on('disconnect', () => {
		console.log(`User disconnected: ${socket.id}`);
	});
});

server.listen(port, () => {
	console.log(`✅ Server chạy trên cổng: ${port}`);
});

Routers.map((item) => {
	app.use(item.path, item.router);
});