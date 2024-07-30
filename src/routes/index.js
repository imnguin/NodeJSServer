import { authenRouter } from "./authen.js";
import { chatRouter } from "./chat.js";
import { userRouter } from "./user.js";

export const Routers = [
    userRouter,
    authenRouter,
    chatRouter
];