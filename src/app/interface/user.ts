export interface User {
    id: number;
    role: string;
    username: string;
    password: string;
    name: string;
    email: string;
    token?: string;
    fcmToken?: string;
    createdAt?: Date;
}

export interface UserBasic {
    id: number;
    role: string;
    username: string;
    name: string;
    email: string;
    fcmToken?: string;
    createdAt: Date;
}

export interface UserRole {
    id: number;
    name: string;
    createdAt: Date;
}
