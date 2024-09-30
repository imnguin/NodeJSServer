import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import { Routers } from './src/routes/index.js';
import { checkToken } from './src/middleware/checkToken.js';
import WebSocket, { WebSocketServer } from 'ws';
import { chatFunc } from './src/function/chat.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
app.use(cors());
app.use(checkToken);

const port = process.env.PORT ?? '8081';
const limit = { limit: '50mb' };
app.use(bodyParser.json(limit));

//WebSocket handler
wss.on('connection', (ws) => {
	ws.on('message', async (data) => {
		const message = JSON.parse(data);
		try {
			const msg = await chatFunc.insert(message);
			// Phát tin nhắn tới tất cả các client khác
			wss.clients.forEach((client) => {
				if (client !== ws && client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(msg.resultObject));
				}
			});
		} catch (error) {
			console.error('Error inserting message', error);
		}
	});

	ws.on('close', () => {
		console.log('Client disconnected');
	});
});

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

Routers.map((item) => {
	app.use(item.path, item.router);
});