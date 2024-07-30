import { chatFunc } from "../function/chat.js";

const loadAllByUser = async (req, res) => {
    const data = await chatFunc.loadAllByUser(req.body);
    res.send(data);
}



export const chatContronller = {
    loadAllByUser
}