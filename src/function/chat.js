import { MongoData } from "../common/mongo.js";
import apiresult from '../model/apiresult.js';

const loadAllByUser = async (req) => {
    try {
        await MongoData.connect();
        await MongoData.createdWithCollection('message');
        const data = await MongoData.get(req);
        return new apiresult(false, 'Lấy danh sách tin nhắn thành công!', 'Lấy danh sách tin nhắn thành công!', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy danh sách tin nhắn!', error.message);
    } finally {
        await MongoData.disConnect();
    }
}

const newMessage = async (req) => {
    
}

export const chatFunc = {
    loadAllByUser
}