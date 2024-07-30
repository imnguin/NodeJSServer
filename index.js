import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http'; // Thêm thư viện http
import { Server } from 'socket.io'; // Thêm thư viện socket.io
import { Routers } from './src/routes/index.js';
// import { checkToken } from './src/middleware/checkToken.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // Sử dụng http để tạo server cho socket.io
const io = new Server(server);

app.use(cors());
// app.use(checkToken);
const port = process.env.PORT ?? '8081';
const limit = { limit: '50mb' };
app.use(bodyParser.json(limit));

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' , msg);
        io.emit('chat message', msg);
    });
});

Routers.map((item) => {
    app.use(item.path, item.router);
});
