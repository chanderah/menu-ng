export interface User {
  id: number;
  roleId: UserRole;
  role: UserRole;
  username: string;
  password: string;
  name: string;
  email: string;
  token?: string;
  fcmToken?: string;
  createdAt?: Date;
}

export interface UserLogin {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface UserBasic {
  id: number;
  roleId: UserRole;
  role: UserRole;
  username: string;
  name: string;
  email: string;
  fcmToken?: string;
  createdAt: Date;
}

export interface UserRole {
  id: number;
  name: string;
  label: string;
  level: number;
  createdAt: Date;
}
