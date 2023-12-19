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
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    }
}); // Tạo đối tượng socket.io

app.use(cors());
// app.use(checkToken);
const port = process.env.PORT ?? '8081';
const limit = { limit: '50mb' };
app.use(bodyParser.json(limit));

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Sử dụng socket.io
const MAX_USERS = 2;
const rooms = new Map();

io.on('connection', (socket) => {
    const { roomID } = socket.handshake.query;

    if (!roomID || !rooms.has(roomID) || rooms.get(roomID).connectedUsers < MAX_USERS) {
        // Tạo phòng nếu chưa tồn tại
        if (!rooms.has(roomID)) {
            rooms.set(roomID, { connectedUsers: 0 });
        }

        // Chấp nhận kết nối mới trong phòng
        rooms.get(roomID).connectedUsers++;
        console.log(`A user connected to room ${roomID}. Total users: ${rooms.get(roomID).connectedUsers}`);

        // Gửi thông báo cho tất cả người dùng trong phòng
        // io.to(roomID).emit('message', 'A new user connected.');

        // Tham gia phòng
        socket.join(roomID);

        // Lắng nghe sự kiện từ client trong phòng
        socket.on('message', (data) => {
            console.log(`Received message in room ${roomID}:`, data);
            io.to(roomID).emit('message', data); // Gửi tin nhắn tới tất cả người dùng trong phòng
        });

        // Lắng nghe sự kiện khi người dùng ngắt kết nối trong phòng
        socket.on('disconnect', () => {
            rooms.get(roomID).connectedUsers--;
            console.log(`User disconnected from room ${roomID}. Total users: ${rooms.get(roomID).connectedUsers}`);
            // io.to(roomID).emit('message', 'A user disconnected.');
        });
    } else {
        // Từ chối kết nối mới vì đã đạt đến số lượng người dùng tối đa trong phòng
        console.log(`Connection rejected. Maximum users reached in room ${roomID}.`);
        socket.disconnect(true);
    }
});

Routers.map((item) => {
    app.use(item.path, item.router);
});
