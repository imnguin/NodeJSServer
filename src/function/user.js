import { MongoData } from "../common/mongo.js";
import apiresult from '../model/apiresult.js'

const search = async (req) => {
    try {
        await MongoData.connect();
        await MongoData.createdWithCollection('user');
        const data = await MongoData.get(req);
        return new apiresult(false, 'lấy danh sách thành công', 'lấy danh sách thành công', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy danh sách', error.message);
    } finally {
        // await MongoData.disConnect();
    }
}

const load = async (req) => {
    try {
        await MongoData.connect();
        await MongoData.createdWithCollection('user');
        const data = await MongoData.get(req);
        return new apiresult(false, 'lấy thông tin thành công!', 'lấy thông tin thành công!', data[0]);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy thông tin nhân viên', error.message);
    }
    finally {
        await MongoData.disConnect();
    }
}

const insert = async (req) => {
    try {
        await MongoData.connect();
        await MongoData.createdWithCollection('user');
        await MongoData.insert(req);
        return new apiresult(false, 'Thêm mới thành công', 'Thêm mới thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi thêm mới', 'Lỗi thêm mới');
    }
    finally {
        await MongoData.disConnect();
    }
}

const update = async (req) => {
    try {
        await MongoData.connect();
        await MongoData.createdWithCollection('user');
        var filter = { username: req.username }
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
        var filter = { username: req.username }
        await MongoData.deleted(filter);
        return new apiresult(false, 'Xóa thành công', 'Xóa thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi Xóa', 'Lỗi Xóa');
    }
    finally {
        await MongoData.disConnect();
    }
}

export const userFunc = {
    search,
    insert,
    update,
    deleted,
    load
}