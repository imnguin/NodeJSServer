import {google} from 'googleapis'

// Đọc tệp JSON chứa thông tin xác thực
import credentials  from '../common/chatboxreact-6ec36-70936b302c75.json' assert { type: 'json' };
import { convert } from '../common/utils/convert.js';

// Cấu hình OAuth2 Client
const { client_email, private_key } = credentials;
const client = new google.auth.JWT(
    client_email,
    null,
    private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

// ID của Google Sheet bạn muốn đọc dữ liệu
const spreadsheetId = '1TWtkND8yXYOG3DPMZGlSPoC2GjVWRl_q4x4GAz_AKk0';
// Tên của Sheet bạn muốn đọc dữ liệu
const sheetName = 'data'; // Thay đổi thành tên Sheet thực tế

const getDataggSheet = async () => {
    try {
        // Đăng nhập và lấy token truy cập
        await client.authorize();

        // Tạo Google Sheets API instance
        const sheets = google.sheets({ version: 'v4', auth: client });

        // Đọc dữ liệu từ Sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: sheetName,
        });

        const rows = response.data.values;
        const data = convert(rows);
        if (data.length) {
            // console.log(data)
            return data
        } else {
            console.log('No data found.');
            return [];
        }
    } catch (error) {
        console.error('Error accessing Google Sheets:', error);
        return []
    }
}

export const googleSheet = {
    getDataggSheet
}

