import { MongoData } from "../common/mongo.js";
import apiresult from '../model/apiresult.js';

const search = async (req) => {
    try {
        const data = await MongoData.withMongo('user', () => MongoData.get(req));
        return new apiresult(false, 'Lấy danh sách thành công', 'Lấy danh sách thành công', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy danh sách', error.message);
    }
}

const load = async (req) => {
    try {
        const data = await MongoData.withMongo('user', () => MongoData.findOne(req));
        return new apiresult(false, 'Lấy thông tin thành công!', 'Lấy thông tin thành công!', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy thông tin nhân viên', error.message);
    }
}

const insert = async (req) => {
    try {
        const user = { ...req, createdAt: new Date() };
        await MongoData.withMongo('user', () => MongoData.insert(user));
        return new apiresult(false, 'Thêm mới thành công', 'Thêm mới thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi thêm mới', error.message);
    }
}

const update = async (req) => {
    try {
        const filter = { username: req.username };
        await MongoData.withMongo('user', () => MongoData.update(req, filter));
        return new apiresult(false, 'Cập nhật thành công', 'Cập nhật thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi cập nhật', error.message);
    }
}

const deleted = async (req) => {
    try {
        const filter = { username: req.username };
        await MongoData.withMongo('user', () => MongoData.deleted(filter));
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
