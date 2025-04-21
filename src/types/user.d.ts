export interface User {
    id: string;
    name: string;
    document: string;
    phone: string;
    establishmentName: string;
    tradingName: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    createdAt?: string;
}