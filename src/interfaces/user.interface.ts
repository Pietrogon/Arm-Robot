export interface User {
    uid: string;
    nameFirst: string;
    nameLast: string;
    photoURL?: string;
    status?: boolean;
    password?: string;
    email: string;
}