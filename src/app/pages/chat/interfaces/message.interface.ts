import { User } from "src/app/interfaces/user";

export interface Message {
    _id: string;
    chatroomId: string;
    sender: User;
    content: string;
    type: string;
    isRead: string;
    createdAt: string;
}