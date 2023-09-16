export interface User {
    id: number;
    role: string;
    username: string;
    password: string;
    name: string;
    email: string;
    token: string;
    createdAt: Date;
}

export interface UserBasic {
    id: number;
    role: string;
    username: string;
    name: string;
    email: string;
    createdAt: Date;
}
