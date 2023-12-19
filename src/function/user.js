import { MongoData } from "../common/mongo.js";
import apiresult from '../model/apiresult.js'
const search = async (req) => {
    try {
        await MongoData.connect();
        await MongoData.createdWithCollection('user');
        var data = await MongoData.get(req);
        await MongoData.disConnect();
        return new apiresult(false, 'lấy danh sách thành công', 'lấy danh sách thành công', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy danh sách', error.message);
    }
}

const insert = async (req) => {
    try {
        await MongoData.connect();
        await MongoData.createdWithCollection('user');
        await MongoData.insert(req);
        await MongoData.disConnect();
        return new apiresult(false, 'Thêm mới thành công', 'Thêm mới thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi thêm mới', 'Lỗi thêm mới');
    }
}

const update = async (req) => {
    try {
        await MongoData.connect();
        await MongoData.createdWithCollection('user');
        var filter = {
            username : req.username
        }
        await MongoData.update(req, filter);
        return new apiresult(false, 'Cập nhật thành công', 'Cập nhật thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi cập nhật', 'Lỗi cập nhật');
    } finally {
        await MongoData.disConnect();
    }
}

const deleted = async (req) => {
    try {
        await MongoData.connect();
        await MongoData.createdWithCollection('user');
        var filter = {username : req.username}
        await MongoData.deleted(filter);
        await MongoData.disConnect();
        return new apiresult(false, 'Xóa thành công', 'Xóa thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi Xóa', 'Lỗi Xóa');
    }
}

export const userFunc = {
    search,
    insert,
    update,
    deleted
}