export interface User {
    _id?: string;
    email: string;
    name?: string;
    username?: string;
    profilePicture?: string;
    token?: string;
    isActive?: boolean;
    onlineStatus?: boolean;
}