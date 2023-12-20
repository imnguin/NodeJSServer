import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http'; // Thêm thư viện http
import { Server } from 'socket.io'; // Thêm thư viện socket.io
import { Routers } from './src/routes/index.js';
import { checkToken } from './src/middleware/checkToken.js';
import admin from 'firebase-admin';
import serviceAccount from './src/common/chatboxreact-6ec36-firebase-adminsdk-9hp6z-2fa4e286a5.json' assert { type: 'json' };

dotenv.config();
// Khởi tạo Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://chatboxreact-6ec36-default-rtdb.firebaseio.com/',
});

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
app.use(checkToken);
const port = process.env.PORT ?? '8081';
const limit = { limit: '50mb' };
app.use(bodyParser.json(limit));

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Sử dụng socket.io
const MAX_USERS = 2;
const rooms = new Map();

io.on('connection', async (socket) => {
    const { roomID } = socket.handshake.query;

    if (!roomID || !rooms.has(roomID) || rooms.get(roomID).connectedUsers < MAX_USERS) {
        // Tạo phòng nếu chưa tồn tại
        if (!rooms.has(roomID)) {
            rooms.set(roomID, { connectedUsers: 0 });
        }

        // Chấp nhận kết nối mới trong phòng
        rooms.get(roomID).connectedUsers++;
        console.log(`A user connected to room ${roomID}. Total users: ${rooms.get(roomID).connectedUsers}`);

        // Nhận tin nhắn từ Firebase khi người dùng kết nối vào phòng
        const messagesSnapshot = await admin.database().ref(`rooms/${roomID}/messages`).once('value');
        const messages = messagesSnapshot.val() || [];

        console.log(messages);

        // Gửi tin nhắn từ Firebase cho người dùng mới kết nối
        socket.emit('message', messages);

        // Tham gia phòng
        socket.join(roomID);

        // Lắng nghe sự kiện từ client trong phòng
        socket.on('message', async (data) => {
            console.log(`Received message in room ${roomID}:`, data);

            // Lưu tin nhắn vào Firebase Realtime Database
            const messageRef = admin.database().ref(`rooms/${roomID}/messages`).push();
            const messageData = {
                text: data.text,
                sender: data.sender,
                timestamp: admin.database.ServerValue.TIMESTAMP,
            };

            await messageRef.set(messageData);

            // Gửi tin nhắn tới tất cả người dùng trong phòng
            io.to(roomID).emit('message', {messageData});
            console.log('a', messageData);
        });

        // Lắng nghe sự kiện khi người dùng ngắt kết nối trong phòng
        socket.on('disconnect', () => {
            rooms.get(roomID).connectedUsers--;
            console.log(`User disconnected from room ${roomID}. Total users: ${rooms.get(roomID).connectedUsers}`);
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
