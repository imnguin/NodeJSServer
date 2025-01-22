import jwt from 'jsonwebtoken';
import apiresult from '../model/apiresult.js';

export const checkToken = (req, res, next) => {
    if (req.url == '/api/authen/login' || req.url == '/api/authen/refeshToken') {
        next();
        return
    }
    else {
        const token = req.headers?.authorization;
        console.log('token', token)
        if (!!token) {
            const accessToken = token.split(' ')[1];
            
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    console.log('vô đây')
                    return res.status(403).json(new apiresult(true, 'Token invalid!', 'Token invalid!', null, 403));
                }
                req.user = user;
                
                next();
            });
        }
        else {
            return res.status(401).json(new apiresult(true, 'Authen doesnt exist!', 'Authen doesnt exist!', null, 401));
        }
    }
}