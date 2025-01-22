import { chatFunc } from "../function/chat.js";

const loadAllByUser = async (req, res) => {
    const data = await chatFunc.loadAllByUser(req.body);
    res.send(data);
}

const saveChat = async (req, res) => {
    const data = await chatFunc.saveChat(req.body);
    res.send(data);
}

const loadChatsByUser = async (req, res) => {
    const data = await chatFunc.loadChatsByUser(req.body);
    res.send(data);
}

const loadMessageByChatId = async (req, res) => {
    const data = await chatFunc.loadMessageByChatId(req.body);
    res.send(data);
}

export const chatContronller = {
    loadAllByUser,
    saveChat,
    loadChatsByUser,
    loadMessageByChatId
}