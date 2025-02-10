import { MongoData } from "../common/mongo.js";
import apiresult from '../model/apiresult.js';

const insert = async (req) => {
    try {
        const newMessage = {
            chatId: req.chatId,
            senderId: req.senderId,
            text: req.text,
            timestamp: new Date(),
        };
        await MongoData.withMongo('message', () => MongoData.insert(newMessage));
        return new apiresult(false, 'Lưu tin nhắn thành công!', 'Lưu tin nhắn thành công!', newMessage);
    } catch (error) {
        return new apiresult(true, 'Lỗi lưu tin nhắn!', error.message);
    }
}

const saveChat = async (req) => {
    try {
        console.log('lưu tin nhắn', req)
        await MongoData.withMongo('message', () => MongoData.insert(req));
        return new apiresult(false, 'ok', 'ok', null);
    } catch (error) {
        return new apiresult(true, 'Lỗi lưu tin nhắn!', error.message);
    }
}

const loadChatsByUser = async (req) => {
    try {
        const data = await MongoData.withMongo('room', () => MongoData.get(req));
        return new apiresult(false, 'Lấy thông tin thành công!', 'Lấy thông tin thành công!', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy thông tin!', error.message);
    }
}

const loadMessageByChatId = async (req) => {
    try {

        console.log('loadMessageByChatId', req)
        const data = await MongoData.withMongo('message', () => MongoData.get(req));
        return new apiresult(false, 'Lấy thông tin thành công!', 'Lấy thông tin thành công!', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy thông tin!', error.message);
    }
}

export const chatFunc = {
    insert,
    saveChat,
    loadChatsByUser,
    loadMessageByChatId
}