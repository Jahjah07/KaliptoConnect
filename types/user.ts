export interface IUser {
uid: string;
email: string;
displayName?: string;
phone?: string;
role?: 'contractor' | 'admin' | 'viewer';
createdAt?: number;
}