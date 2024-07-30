import { MongoData } from "../common/mongo.js";
import apiresult from '../model/apiresult.js';

const withMongo = async (collectionName, callback) => {
    try {
        await MongoData.connect();
        await MongoData.createdWithCollection(collectionName);
        const result = await callback();
        return result;
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
        throw error;
    } finally {
        await MongoData.disConnect();
    }
}

const search = async (req) => {
    try {
        const data = await withMongo('user', () => MongoData.get(req));
        return new apiresult(false, 'Lấy danh sách thành công', 'Lấy danh sách thành công', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy danh sách', error.message);
    }
}

const load = async (req) => {
    try {
        const data = await withMongo('user', () => MongoData.get(req));
        return new apiresult(false, 'Lấy thông tin thành công!', 'Lấy thông tin thành công!', data[0]);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy thông tin nhân viên', error.message);
    }
}

const insert = async (req) => {
    try {
        await withMongo('user', () => MongoData.insert(req));
        return new apiresult(false, 'Thêm mới thành công', 'Thêm mới thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi thêm mới', error.message);
    }
}

const update = async (req) => {
    try {
        const filter = { username: req.username };
        await withMongo('user', () => MongoData.update(req, filter));
        return new apiresult(false, 'Cập nhật thành công', 'Cập nhật thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi cập nhật', error.message);
    }
}

const deleted = async (req) => {
    try {
        const filter = { username: req.username };
        await withMongo('user', () => MongoData.deleted(filter));
        return new apiresult(false, 'Xóa thành công', 'Xóa thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi Xóa', error.message);
    }
}

export const userFunc = {
    search,
    insert,
    update,
    deleted,
    load
}
