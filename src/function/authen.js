import { hashMD5 } from "../common/MD5.js";
import apiresult from "../model/apiresult.js";
import { userFunc } from "./user.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const login = async (req) => {
    console.log(req)
    const { username, password } = req;
    const user = await userFunc.load({ username });
    if (!user.iserror) {
        if (user.resultObject) {
            if (password == user.resultObject.password) {
                const accessToken = genarateAccessToken(user.resultObject);
                const refeshToken = genarateRefreshToken(user.resultObject);
                const result = {
                    ...user.resultObject,
                    accessToken,
                    refeshToken
                };
                delete result.password;
                return new apiresult(false, 'Đăng nhập thành công!', 'Đăng nhập thành công!', result);
            } else {
                return new apiresult(true, 'Đăng nhập không thành công!', 'Sai mật khẩu');
            }
        } else {
            return new apiresult(true, 'Đăng nhập không thành công!', 'User name không tồn tại');
        }
    }
}

const refeshToken = async (req) => {
    try {
        const token = req.headers?.Authorization.split(' ')[1];
        if (token) {
            const result = jwt.verify(token, process.env.JWT_REFESH_KEY, (err, user) => {
                if (err) {
                    return new apiresult(true, 'Error refesh token', err);
                }
                const newaccessToken = genarateAccessToken(user);
                const newrefeshToken = genarateRefreshToken(user);
                return new apiresult(false, 'Ok', 'Ok', {
                    ...user,
                    accessToken: newaccessToken,
                    refeshToken: newrefeshToken
                });
            });

            return result;
        }
        else {
            return new apiresult(true, 'Authen doesnt exist!');
        }
    } catch (ex) {
        return new apiresult(true, 'Error refesh token', ex.message);
    }
}

const genarateAccessToken = (user) => {
    const accessToken = jwt.sign({
        username: user.username,
        email: user.email
    },
        process.env.JWT_ACCESS_KEY,
        {
            expiresIn: '1d'
        });

    return accessToken;
}

const genarateRefreshToken = (user) => {
    const dataSigin = {
        username: user.username,
        email: user.email
    };
    const refeshToken = jwt.sign(
        dataSigin,
        process.env.JWT_REFESH_KEY,
        {
            expiresIn: '15d'
        }
    );
    return refeshToken;
}

export const authenFunc = {
    login,
    refeshToken
}