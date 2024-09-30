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

export const chatFunc = {
    insert
}