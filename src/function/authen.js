import { hashMD5 } from "../common/MD5.js";
import apiresult from "../model/apiresult.js";
import { userFunc } from "./user.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { googleSheet } from "./googleSheet.js";

dotenv.config();
import fs from 'fs';

const path = "E:/Server/";

const login = async (req) => {
    // const result = await googleSheet.getDataggSheet();
    // if (!result || result.lenght < 0) {
    //     return new apiresult(true, 'Đăng nhập không thành công!', 'User name không tồn tại')
    // } else {
    //     const user = result.find(u => u.username == req.username);
    //     if (!user) {
    //         return new apiresult(true, 'Đăng nhập không thành công!', 'User name không tồn tại')
    //     } else {
    //         if (user.password != req.password) {
    //             return new apiresult(true, 'Đăng nhập không thành công!', 'Sai mật khẩu');
    //         } else {
    //             return new apiresult(false, 'Đăng nhập thành công!', 'Đăng nhập thành công!', user);
    //         }
    //     }
    // }
    // console.log(req)
    // console.log('req', req);
    var filter = {
        username: req.username
    }
    var user = await userFunc.load(filter);
    console.log('user', user)
    if (!user.iserorr) {
        if (user.resultObject) {
            if (req.password == user.resultObject.password) {
                return new apiresult(false, 'Đăng nhập thành công!', 'Đăng nhập thành công!', user.resultObject);
            } else {
                return new apiresult(true, 'Đăng nhập không thành công!', 'Sai mật khẩu');
            }
        } else {
            return new apiresult(true, 'Đăng nhập không thành công!', 'User name không tồn tại')
        }
        // console.log('user', user);
        // const md5Hash = hashMD5(req.password);
        // if(user.resultObject && user.resultObject.length > 0)
        // {
        //     console.log(user.resultObject[0].password, md5Hash);
        //     if(user.resultObject[0].password == md5Hash)
        //     {
        //         const accessToken = genarateAccessToken(user.resultObject[0]);
        // 		// const refeshToken = genarateRefreshToken(user.resultObject[0]);

        //         const resultUser = {
        //             ...user.resultObject[0], 
        //             accessToken
        //         }
        //         delete resultUser.password;
        //         return new apiresult(false, 'Đăng nhập thành công!', 'Đăng nhập thành công!', resultUser);
        //     }
        //     else
        //     {
        //         return new apiresult(true, 'Đăng nhập không thành công!', 'Sai mật khẩu');
        //     }
        // }
        // else
        // {
        //     return new apiresult(true, 'Đăng nhập không thành công!', 'User name không tồn tại')
        // }
    }
    else {
        return new apiresult(true, 'Lỗi đăng nhập', user.messagedetail)
    }
}

const refeshToken = async (req) => {
    try {
        const refesh = fs.readFileSync('D:/Server/refeshToken.txt', 'utf8');
        if (refesh) {
            const data = jwt.verify(refesh, process.env.JWT_REFESH_KEY, (err, user) => {
                if (err) {
                    return new apiresult(true, 'Error refesh token', err);
                }
                const newaccessToken = genarateAccessToken(user);
                const newrefeshToken = genarateRefreshToken(user);
                const resultUser = {
                    ...user,
                    newaccessToken
                }
                return new apiresult(false, 'Ok', 'Ok', resultUser);
            });
            return data;
        }
        else {
            return new apiresult(true, 'Authen doesnt exist!');
        }
    } catch (ex) {
        return new apiresult(true, 'Error refesh token', ex);
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
            expiresIn: '30d'
        }
    );

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    fs.writeFileSync(path + 'refeshToken.txt', refeshToken, 'utf-8');

    return refeshToken;
}

export const authenFunc = {
    login,
    refeshToken
}