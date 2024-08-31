import { User } from "src/app/interfaces/user";
import { Message } from "./message.interface";

export interface Chatroom {
    lastMessage: Message;
    _id: string;
    participants: User;
    unreadMessages: number;
    isFavorite?: boolean;
    onlineStatus?: string;
}