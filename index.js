import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http'; // Thêm thư viện http
// import { Server } from 'socket.io'; // Thêm thư viện socket.io
import { Routers } from './src/routes/index.js';
import { checkToken } from './src/middleware/checkToken.js';
// import admin from 'firebase-admin';
// import serviceAccount from './src/common/chatboxreact-6ec36-firebase-adminsdk-9hp6z-2fa4e286a5.json' assert { type: 'json' };
// import { ExpressPeerServer } from 'peer'; // Thêm thư viện Peer

dotenv.config();
// Khởi tạo Firebase Admin SDK
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://chatboxreact-6ec36-default-rtdb.firebaseio.com/',
// });

const app = express();
const server = http.createServer(app); // Sử dụng http để tạo server cho socket.io
// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST'],
//         credentials: true,
//     }
// }); // Tạo đối tượng socket.io

// Sử dụng thêm Peer Server cho WebRTC
// const peerServer = ExpressPeerServer(server, {
//     path: '/peer',
// });
// app.use('/peer', peerServer);

app.use(cors());
// app.use(checkToken);
const port = process.env.PORT ?? '8081';
const limit = { limit: '50mb' };
app.use(bodyParser.json(limit));

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Sử dụng socket.io
// const MAX_USERS = 2;
// const rooms = new Map();
// const peers = [];

// Lắng nghe sự kiện khi có người dùng kết nối
// io.on('connection', async (socket) => {
//     const { roomID } = socket.handshake.query;

//     if (!roomID || !rooms.has(roomID) || rooms.get(roomID).connectedUsers < MAX_USERS) {
//         // Tạo phòng nếu chưa tồn tại
//         if (!rooms.has(roomID)) {
//             rooms.set(roomID, { connectedUsers: 0 });
//         }

//         // Chấp nhận kết nối mới trong phòng
//         rooms.get(roomID).connectedUsers++;
//         console.log(`A user connected to room ${roomID}. Total users: ${rooms.get(roomID).connectedUsers}`);

//         // Nhận tin nhắn từ Firebase khi người dùng kết nối vào phòng
//         const messagesSnapshot = await admin.database().ref(`rooms/${roomID}/messages`).once('value');
//         const messages = messagesSnapshot.val() || [];

//         // Gửi tin nhắn từ Firebase cho người dùng mới kết nối
//         socket.emit('message', messages);

//         // Tham gia phòng
//         socket.join(roomID);

//         // Lắng nghe sự kiện từ client trong phòng
//         socket.on('message', async (data) => {
//             console.log(`Received message in room ${roomID}:`, data);

//             // Lưu tin nhắn vào Firebase Realtime Database
//             const messageRef = admin.database().ref(`rooms/${roomID}/messages`).push();
//             const messageData = {
//                 text: data.text,
//                 sender: data.sender,
//                 timestamp: admin.database.ServerValue.TIMESTAMP,
//             };

//             await messageRef.set(messageData);

//             // Gửi tin nhắn tới tất cả người dùng trong phòng
//             io.to(roomID).emit('message', { messageData });
//             console.log('a', messageData);
//         });

//         // Lắng nghe sự kiện khi người dùng ngắt kết nối trong phòng
//         socket.on('disconnect', () => {
//             rooms.get(roomID).connectedUsers--;
//             console.log(`User disconnected from room ${roomID}. Total users: ${rooms.get(roomID).connectedUsers}`);
//         });

//         // Lắng nghe sự kiện khi có người dùng khác tham gia phòng
//         socket.on('user-connected', (userId) => {
//             const peer = new Peer({
//                 initiator: true,
//                 trickle: false,
//                 stream: stream, // Stream của người dùng hiện tại
//             });

//             // Gửi thông tin SDP đến peer khác
//             peer.on('signal', (signal) => {
//                 socket.emit('send-signal', { userToSignal: userId, callerId: socket.id, signal });
//             });

//             // Thêm peer mới vào danh sách
//             peers.push({
//                 peerId: userId,
//                 peer,
//             });
//         });

//         // Lắng nghe sự kiện khi có sự kiện 'return-signal' từ người dùng khác
//         socket.on('return-signal', ({ signal, callerId }) => {
//             const peerObj = peers.find((peer) => peer.peerId === callerId);

//             if (peerObj) {
//                 // Thêm thông tin signal của người dùng khác vào peer
//                 peerObj.peer.signal(signal);
//             }
//         });

//         // Lắng nghe sự kiện khi có người dùng gọi video
//         socket.on('call-user-video', (data) => {
//             const peer = new Peer({
//                 initiator: false,
//                 trickle: false,
//                 stream: stream, // Stream của người dùng hiện tại
//             });

//             // Gửi thông tin SDP đến người dùng khác
//             peer.on('signal', (signal) => {
//                 socket.emit('send-call-signal-video', { userToCall: data.userToCall, callerId: socket.id, signal });
//             });

//             // Thêm peer mới vào danh sách
//             peers.push({
//                 peerId: data.userToCall,
//                 peer,
//             });
//         });

//         // Lắng nghe sự kiện khi có sự kiện 'return-call-signal-video' từ người dùng khác
//         socket.on('return-call-signal-video', ({ signal, callerId }) => {
//             const peerObj = peers.find((peer) => peer.peerId === callerId);

//             if (peerObj) {
//                 // Thêm thông tin signal của người dùng khác vào peer
//                 peerObj.peer.signal(signal);
//             }
//         });

//         // Lắng nghe sự kiện khi có người dùng kết nối vào phòng
//         socket.on('user-connected', (userId) => {
//             const peer = new Peer({
//                 initiator: true,
//                 trickle: false,
//                 stream: stream, // Stream của người dùng hiện tại
//             });

//             // Gửi thông tin SDP đến peer khác
//             peer.on('signal', (signal) => {
//                 socket.emit('send-signal', { userToSignal: userId, callerId: socket.id, signal });
//             });

//             // Thêm peer mới vào danh sách
//             peers.push({
//                 peerId: userId,
//                 peer,
//             });
//         });

//         // Lắng nghe sự kiện khi có sự kiện 'return-signal' từ người dùng khác
//         socket.on('return-signal', ({ signal, callerId }) => {
//             const peerObj = peers.find((peer) => peer.peerId === callerId);

//             if (peerObj) {
//                 // Thêm thông tin signal của người dùng khác vào peer
//                 peerObj.peer.signal(signal);
//             }
//         });

//         // Lắng nghe sự kiện khi có người dùng gọi video
//         socket.on('call-user-video', (data) => {
//             const peer = new Peer({
//                 initiator: false,
//                 trickle: false,
//                 stream: stream, // Stream của người dùng hiện tại
//             });

//             // Gửi thông tin SDP đến người dùng khác
//             peer.on('signal', (signal) => {
//                 socket.emit('send-call-signal-video', { userToCall: data.userToCall, callerId: socket.id, signal });
//             });

//             // Thêm peer mới vào danh sách
//             peers.push({
//                 peerId: data.userToCall,
//                 peer,
//             });
//         });

//         // Lắng nghe sự kiện khi có sự kiện 'return-call-signal-video' từ người dùng khác
//         socket.on('return-call-signal-video', ({ signal, callerId }) => {
//             const peerObj = peers.find((peer) => peer.peerId === callerId);

//             if (peerObj) {
//                 // Thêm thông tin signal của người dùng khác vào peer
//                 peerObj.peer.signal(signal);
//             }
//         });
//     } else {
//         // Từ chối kết nối mới vì đã đạt đến số lượng người dùng tối đa trong phòng
//         console.log(`Connection rejected. Maximum users reached in room ${roomID}.`);
//         socket.disconnect(true);
//     }
// });

Routers.map((item) => {
    app.use(item.path, item.router);
});
