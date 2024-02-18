export interface User {
    _id?: string;
    email: string;
    name?: string;
    username?: string;
    profilePicture?: string;
    isActive?: boolean;
    onlineStatus?: 'online' | 'offline' | 'away';
}